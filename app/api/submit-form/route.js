// app/api/submit-form/route.js
import { NextResponse } from 'next/server';
import PocketBase from 'pocketbase';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req) {
  
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  await pb.admins.authWithPassword(process.env.POCKETBASE_AUTH_EMAIL, process.env.POCKETBASE_AUTH_PASS);

  try {
    const body = await req.json();
    console.log(body);

    const pocketBaseRecord = await pb.collection('elselt').create({
      "email": body.email,
      "name": body.name,
      "group": body.group,
      "davuutal": body.davuutal,
      "sultal": body.sultal,
      "volunteerExperience": body.volunteerExperience.join(", "),
      "reasonForJoining": body.reasonForJoining,
      "selfDescription": body.selfDescription,
    });

    console.log('PocketBase record:', pocketBaseRecord);

    const { data: supabaseData, error: supabaseError } = await supabase
      .from('elselt')
      .insert({
        email: body.email,
        name: body.name,
        group: body.group,
        davuutal: body.davuutal,
        sultal: body.sultal,
        volunteerExperience: body.volunteerExperience.join(", "),
        reasonForJoining: body.reasonForJoining,
        selfDescription: body.selfDescription,
      });

    if (supabaseError) {
      throw new Error(supabaseError.message);
    }

    console.log('Supabase data:', supabaseData);

    return new NextResponse(
      JSON.stringify({
        pocketBaseRecord,
        supabaseData,
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error('Error:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to submit data' }), { status: 500 });
  }
}
