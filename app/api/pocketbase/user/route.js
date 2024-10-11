import PocketBase from 'pocketbase';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { user } = body;

    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

    await pb.admins.authWithPassword(process.env.POCKETBASE_AUTH_EMAIL, process.env.POCKETBASE_AUTH_PASS);

    let existingUser;
    try {
      existingUser = await pb.collection('accounts').getFirstListItem(`guser_id="${user.guser_id}"`);
    } catch (error) {
      if (error.status === 404) {
        console.log(`User with guser_id ${user.guser_id} not found. A new user will be created.`);
      } else {
        console.error('Error fetching user from PocketBase:', error);
        return NextResponse.json({ error: 'PocketBase user fetch failed' }, { status: 500 });
      }
    }

    const userData = {
      username: user.name || 'Unnamed',
      email: user.email,
      guser_id: user.guser_id,
      lastlogin: new Date().toISOString(),
      profileImage: user.picture || '',
    };

    if (existingUser) {
      await pb.collection('accounts').update(existingUser.id, userData);
    } else {
      await pb.collection('accounts').create(userData);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving user to PocketBase:', error);
    return NextResponse.json({ error: 'PocketBase user save failed' }, { status: 500 });
  }
}
