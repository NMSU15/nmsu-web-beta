// app/page.js (or any other route)

import { createClient } from '@supabase/supabase-js';
import { useSession } from "next-auth/react";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next"
import styles from './styles.module.scss'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function HomePage() {
    const session = await getServerSession(authOptions);
    // const { data: session } = useSession();

    const { data: authorizedEmailsData, error: authorizedEmailsError } = await supabase
    .from('authorizedEmails')
    .select('email');
    
    const { data, error } = await supabase.from('ShineJil').select('*');

    if (error) {
      console.error(error);
      return { props: { data: [] } };
    }

    const authorizedEmails = authorizedEmailsData?.map((item) => item.email) || [];
    const userEmail = session?.user?.email;

    if (!authorizedEmails.includes(userEmail)) {
        return(
            <main className={styles.container}>
                Please login with an authorized account<br />
                Your current email: {userEmail || "please login"}
            </main>
        )

    }

    return (
        <main className={styles.container}>
        <h1>Form Data</h1>
        <table border="0">
            <thead>
            <tr>
                <th>Id</th>
                <th>Email</th>
                <th>Name</th>
                <th>Group</th>
                <th>ShineJildOroh</th>
                <th>Ticket</th>
                <th>Idea</th>
            </tr>
            </thead>
            <tbody>
            {data.map((item, index) => (
                <tr key={item.id}>
                <td>{index + 1}</td>
                <td>
                {item.email ? (
                    item.email
                ) : (
                    <span style={{ color: '#ddd' }}>not logged in</span>
                )}
                </td>
                <td>{item.name}</td>
                <td>{item.group}</td>
                <td>{item.ShineJildOroh}</td>
                <td>{item.Ticket}</td>
                <td>{item.Idea}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </main>
    );
}
