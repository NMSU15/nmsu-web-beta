import PocketBase from 'pocketbase';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const formData = await req.formData(); 
    const imageFile = formData.get('file'); 
    const name = formData.get('name');
    const email = formData.get('email');
    const guser_id = formData.get('guser_id');

    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

    await pb.admins.authWithPassword(process.env.POCKETBASE_AUTH_EMAIL, process.env.POCKETBASE_AUTH_PASS);

    let existingUser;
    try {
      existingUser = await pb.collection('accounts').getFirstListItem(`guser_id="${guser_id}"`);
    } catch (error) {
      if (error.status === 404) {
        console.log(`User with guser_id ${guser_id} not found. A new user will be created.`);
      } else {
        console.error('Error fetching user from PocketBase:', error);
        return NextResponse.json({ error: 'PocketBase user fetch failed' }, { status: 500 });
      }
    }

    const userData = {
      username: name || null,
      email: email || null,
      guser_id: guser_id || null,
      lastlogin: new Date().toISOString(),
    };

    let userId;
    if (existingUser) {
      await pb.collection('accounts').update(existingUser.id, userData);
      userId = existingUser.id;
    } else {
      const newUser = await pb.collection('accounts').create(userData);
      userId = newUser.id;
    }

    if (imageFile) {
      const fileData = new FormData();
      fileData.append('image', imageFile, imageFile.name); // Include the file name for identification

      // Upload the image to the account collection
      await pb.collection('accounts').update(userId, fileData);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving user to PocketBase:', error);
    return NextResponse.json({ error: 'PocketBase user save failed' }, { status: 500 });
  }
}
