import PocketBase from 'pocketbase';
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

export async function GET(request) {
  try {
    await pb.admins.authWithPassword(process.env.POCKETBASE_AUTH_EMAIL, process.env.POCKETBASE_AUTH_PASS);

    // Fetch all clubs with sorting and include member details in one query
    const clubsWithDetails = await pb.collection('clubs').getFullList({
      sort: '-created_date',
      expand: 'members', // Include member details
    });

    // Map clubs and include image URLs
    const clubsWithImages = clubsWithDetails.map(club => {
      const hasMembers = club.expand && club.expand.members && club.expand.members.length > 0;

      return {
        ...club,
        profile_image_url: club.profile_image
          ? `${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/files/clubs/${club.id}/${club.profile_image}`
          : null,
        cover_image_url: club.cover_image
          ? `${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/files/clubs/${club.id}/${club.cover_image}`
          : null,
        members: hasMembers
          ? club.expand.members.map(member => ({
              id: member.id,
              username: member.username,
              image: `${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/files/accounts/${member.id}/${member.image}`,
            }))
          : [], // Include an empty array if there are no members
      };
    });

    return new Response(JSON.stringify(clubsWithImages), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching clubs:', error.message);
    return new Response(JSON.stringify({ error: 'Error fetching clubs', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
