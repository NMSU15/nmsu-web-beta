'use client';

import { useState } from 'react';
import { useSession } from "next-auth/react";
import styles from './page.module.scss'
import Navbar from '@/components/Navbar';
import Providers from '@/components/Providers';


export default function SendEmailForm() {
  const [subject, setSubject] = useState('Оюутны холбооны элсэлтийн эхний шатанд тэнцсэнд баяр хүргэе!');
  const [sending, setSending] = useState(false);
  // const [username, setUsername] = useState('');
//   const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('se22d50@nmit.edu.mn');
  // const [price, setPrice] = useState();
  const [responseMessage, setResponseMessage] = useState(null);

  const sendEmail = async (e) => {
    e.preventDefault();

    setSending(true)

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: subject,
          to: recipient
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResponseMessage(data.message);
        alert(data.message)

        // setUsername('');
        setRecipient('');
        // setPrice('');

      } else {
        setResponseMessage('Failed to send email');
        alert(data.message)
      }
      setSending(false)
    } catch (error) {
      console.error('Error:', error);
      setResponseMessage('An error occurred while sending the email.');
      setSending(false)
    }
  };

  return (
    <Providers>
    <Auth>
      <Navbar/>
        <main>
            <form className={styles.form} onSubmit={sendEmail}>
            <p>Subject</p>
            <input
                type="text"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
            />
            {/* <p>Username (Ирмүүн Мөнгөншагай etc)</p>
            <input
                type="text"
                placeholder="Username (Ирмүүн Мөнгөншагай)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            /> */}
            <p>student id (se24d99 etc) not (se24d99@nmit.edu.mn)</p>
            <input
                type="text"
                placeholder="student id (se24d99 etc)"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
            />
            {/* <p>Ticket Price</p>
            <select name="price" required onChange={(e) => setPrice(e.target.value)}>
                <option disabled="disabled" selected="selected">--Choose Price--</option>
                <option value={30} >30k juniors</option>
                <option value={33} >33k freshmen(1)</option>
                <option value={35} >35k (2-4)</option>
                <option value={38} >38k (1)</option>
                <option value={40} >40k (2-4)</option>
                <option value={43} >43k (1) Үүднээсээ</option>
                <option value={45} >45k (2-4) Үүднээсээ</option>
            </select> */}
            <button type="submit"> {sending? "sending..." : "Send Email"} </button>
            {responseMessage && <p>{responseMessage}</p>}
            </form>
        </main>
    </Auth>
    </Providers>
  );
}


function Auth({ children }) {
    const { data: session } = useSession();

    const authorizedEmails = ["ce22d08@nmit.edu.mn", "se21d20@nmit.edu.mn", "se22d50@nmit.edu.mn", "student_union@nmit.edu.mn"];
    const userEmail = session?.user?.email;

    if (!authorizedEmails.includes(userEmail)) {
        return (
            <main>
                Please login with an authorized account<br />
                Your current email: {userEmail || "please login"}
            </main>
        );
    }

    return children;
}