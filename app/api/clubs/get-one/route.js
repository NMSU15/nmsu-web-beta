import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const clubId = searchParams.get('id');

    if (!clubId) {
      return new Response(JSON.stringify({ error: 'Club ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await pb.admins.authWithPassword(
      process.env.POCKETBASE_AUTH_EMAIL, 
      process.env.POCKETBASE_AUTH_PASS
    );

    // Fetch the club with expanded members
    const club = await pb.collection('clubs').getOne(clubId, {
      expand: 'members' // This is crucial for fetching member details
    });

    // Transform club data with image URLs and member details
    const clubWithImages = {
      ...club,
      profile_image_url: club.profile_image
        ? `${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/files/clubs/${club.id}/${club.profile_image}`
        : null,
      cover_image_url: club.cover_image
        ? `${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/files/clubs/${club.id}/${club.cover_image}`
        : null,
      members: club.expand?.members?.map(member => ({
        id: member.id,
        name: member.username,
        email: member.email,
        image: member.image
          ? `${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/files/accounts/${member.id}/${member.image}`
          : null,
      })) || [],
    };

    return new Response(JSON.stringify({ club: clubWithImages }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching club:', error);
    return new Response(JSON.stringify({ error: 'Error fetching club' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}