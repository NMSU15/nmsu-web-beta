import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    const data = {
      name: formData.get('name'),
      description: formData.get('description'),
      club_admin: formData.get('club_admin'),
      club_created: formData.get('club_created'),
      profile_image: formData.get('profile_image'),
      cover_image: formData.get('cover_image'),
      phone_number: formData.get('phone_number'),
      email_address: formData.get('email_address'),
      website: formData.get('website'),
      facebook: formData.get('facebook'),
      instagram: formData.get('instagram'),
    };

    // Authenticate with PocketBase
    await pb.admins.authWithPassword(process.env.POCKETBASE_AUTH_EMAIL, process.env.POCKETBASE_AUTH_PASS);
    
    // Create the new club record
    const record = await pb.collection('clubs').create(data);

    // Fetch the user by 'guser_id' (assumed to be sent in the formData)
    const userRecord = await pb.collection('accounts').getFirstListItem(`email="${data.club_admin}"`);

    if (userRecord) {
      // Update the user's 'my_clubs' relation by adding the newly created club's ID
      const updatedMyClubs = userRecord.my_clubs ? [...userRecord.my_clubs, record.id] : [record.id];

      await pb.collection('accounts').update(userRecord.id, {
        my_clubs: updatedMyClubs,
      });
    }

    return new Response(JSON.stringify({ message: 'Club created and user updated successfully!', record }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating club or updating user:', error);
    return new Response(JSON.stringify({ error: 'Error creating club or updating user' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
