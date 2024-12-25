// app/api/submit-form/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req) {
  try {
    const body = await req.json();
    console.log('Received form submission:', body);

    const { data, error } = await supabase
      .from('menu_selections')
      .insert({
        email: body.email,
        name: body.name,
        instagram: body.instagram,
        starter: body.starter,
        main_dishes: body.mainDishes,
        alcohol: body.alcohol
      });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Successfully saved to Supabase:', data);

    return NextResponse.json(
      { message: 'Form submitted successfully', data },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error submitting form:', error);
    return NextResponse.json(
      { error: 'Failed to submit form data' },
      { status: 500 }
    );
  }
}