"use client"; // Marks this as a client component

import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import styles from "./page.module.scss";
import Image from 'next/image';

const JoinClubForm = ({ params }) => {
  const { data: session } = useSession();
  const [fields, setFields] = useState([]); // Club form fields
  const [formValues, setFormValues] = useState({}); // Stores student's answers
  const [clubDetails, setClubDetails] = useState({}); // Stores club's expanded details
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch the club form fields and club details when the component mounts
  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await fetch(`/api/pocketbase/club_forms_get?id=${params.slug}`);
        const data = await response.json();

        if (data.success) {
          // Extract form fields from the response
          const clubFields = Object.keys(data.fields)
            .filter(key => key.startsWith('field_') && data.fields[key] !== "") // Filter and include only non-empty fields
            .map(key => data.fields[key]);

          // Set form fields and club details
          setFields(clubFields);
          setClubDetails(data.fields.expand.club_id); // Expanded club details
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to fetch club form fields.');
      }
    };

    fetchFields();
  }, [params.slug]);

  const handleInputChange = (field, value) => {
    setFormValues(prevValues => ({
      ...prevValues,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/pocketbase/join_club`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          club_id: params.slug,
          student_email: session.user.email,
          formValues, // Submitting student's responses
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccessMessage('Your join request was successfully submitted!');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to submit the form.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <form className={styles.form} onSubmit={handleSubmit}>
        {clubDetails.name ? (
          <div className={styles.clubDetails}>
            <Image src={`${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/files/clubs/${clubDetails.id}/${clubDetails.profile_image}`} width={96} height={96} alt={clubDetails.name} />
            <h2>{clubDetails.name}</h2>
            {/* <p>{clubDetails.description}</p> */}
          </div>
        ) : (
          <p>Loading club details...</p>
        )}

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        
        {fields.map((field, index) => (
          <div key={index} className={styles.question}>
            <label>
              {field}:
              <textarea
                type="text"
                value={formValues[field] || ''}
                onChange={(e) => handleInputChange(field, e.target.value)}
              />
            </label>
          </div>
        ))}

        <button className={styles.submit} type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Requist'}
        </button>
      </form>
    </main>
  );
};

export default JoinClubForm;
