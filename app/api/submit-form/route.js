// app/api/submit-form/route.js
import { NextResponse } from 'next/server';
import PocketBase from 'pocketbase';

export async function POST(req) {
    
    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
    await pb.admins.authWithPassword(process.env.POCKETBASE_AUTH_EMAIL, process.env.POCKETBASE_AUTH_PASS);

  try {
    const body = await req.json();
    console.log(body)
    const record = await pb.collection('elselt').create({
      "email": body.email,
      "name": body.name,
      "group": body.group,
      "davuutal": body.davuutal,
      "sultal": body.sultal,
      "volunteerExperience": body.volunteerExperience.join(", "),
      "reasonForJoining": body.reasonForJoining,
      "selfDescription": body.selfDescription,
    });

    console.log(body)

    return new NextResponse(JSON.stringify(record), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'Failed to submit data' }), { status: 500 });
  }
}
