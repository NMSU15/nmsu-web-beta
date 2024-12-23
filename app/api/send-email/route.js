'use server';
import { render } from '@react-email/components';
import { NextResponse } from 'next/server';
import { Mail } from "@/components/Email"; 
import nodemailer from 'nodemailer';
import PocketBase from 'pocketbase';

// const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

export async function POST(request) {
    try {
        const { subject, to } = await request.json();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_PASS,
            },
        });

        
        // await pb.admins.authWithPassword(process.env.POCKETBASE_AUTH_EMAIL, process.env.POCKETBASE_AUTH_PASS);

        
        // let existingRecord;
        // try {
        //     existingRecord = await pb.collection('meeting_party_email').getFirstListItem(`email="${emailto}"`);
        // } catch (err) {
            
        //     if (err.response.code === 404) {
        //         existingRecord = null;
        //     } else {
        //         throw err; 
        //     }
        // }
        
        
        // if (existingRecord) {
        //     return NextResponse.json({ message: `${emailto} already sent` }, { status: 400 });
        // }

        
        // const data = {
        //     email: emailto,
        //     username: username,
        //     email_send: true,
        //     price: price
        // };
        
        // const record = await pb.collection('meeting_party_email').create(data);

        
        // const ticketid = record.id || "error";

        
        // if (!username || !price) {
        //     throw new Error('Missing username or price');
        // }

        
        const emailHtml = await render(<Mail/>);

        const mailOption = {
            from: process.env.NODEMAILER_EMAIL,
            to: to,
            subject: subject,
            html: emailHtml
        };
        await transporter.sendMail(mailOption);

        return NextResponse.json({ message: 'Email Sent Successfully' }, { status: 200 });

    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ message: 'Failed to Send Email', error: error.message }, { status: 500 });
    }
}
