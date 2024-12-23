'use client'

import { useState } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation'
import styles from "./page.module.scss";

export default function AddClub() {
    const { data: session } = useSession();
    const router = useRouter();
    const defaultFormData = {
        name: '',
        description: '',
        club_admin: session?.user.email || '',
        club_created: '',
        profile_image: null,
        cover_image: null,
        phone_number: '',
        email_address: '',
        website: '',
        facebook: '',
        instagram: '',
        members_relation: '',
    };

    const [formData, setFormData] = useState(defaultFormData);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (files) {
            setFormData((prev) => ({
                ...prev,
                [name]: files[0],
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.club_admin) {
            alert('Please fill in all required fields.');
            return;
        }

        try {
            const formDataObj = new FormData();
            formDataObj.append('name', formData.name);
            formDataObj.append('description', formData.description);
            formDataObj.append('club_admin', formData.club_admin);
            formDataObj.append('club_created', formData.club_created);
            formDataObj.append('phone_number', formData.phone_number);
            formDataObj.append('email_address', formData.email_address);
            formDataObj.append('website', formData.website);
            formDataObj.append('facebook', formData.facebook);
            formDataObj.append('instagram', formData.instagram);

            if (formData.profile_image) {
                formDataObj.append('profile_image', formData.profile_image);
            }
            if (formData.cover_image) {
                formDataObj.append('cover_image', formData.cover_image);
            }

            const response = await fetch('/api/clubs/add', {
                method: 'POST',
                body: formDataObj,
            });

            if (!response.ok) {
                throw new Error('Failed to create club');
            }

            const result = await response.json();
            alert(`${formData.name} амжилттай үүслээ!`);
            setFormData(defaultFormData);
            router.push('/');
        } catch (error) {
            console.error('Error creating club:', error);
            alert('Error creating club');
        }
    };

    return (
        <main>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2>
                Шинээр клуб Үүсгэх
                </h2>
                <div className={styles.inbx}>
                    <h4>Клубын нэр</h4>
                    <input
                        type="text"
                        name="name"
                        placeholder="Club name*"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />           
                </div>     
                <div className={styles.inbx}>
                    <h4>Клубын тайлбар</h4>
                    <input
                        type="text"
                        name="description"
                        placeholder="Description*"
                        value={formData.description}
                        onChange={handleChange}
                    />           
                </div> 
                <div className={styles.inbx}>
                    <h4>Logo</h4>
                    {/* <p>Logo</p> */}
                    <input
                        type="file"
                        name="profile_image"
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.inbx}>
                    <h4>Клубын зураг</h4>
                    <p>background зураг</p>
                    <input
                        type="file"
                        name="cover_image"
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.inbx}>
                    <h4>Утас</h4>
                    <p>холбогдох утас</p>
                    <input
                        type="tel"
                        name="phone_number"
                        placeholder="Phone Number"
                        value={formData.phone_number}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.inbx}>
                    <h4>email</h4>
                    <p>холбогдох email хаяг</p>
                    <input
                        type="email"
                        name="email_address"
                        placeholder="Email_address"
                        value={formData.email_address}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.inbx}>
                    <h4>Website</h4>
                    <input
                        type="url"
                        name="website"
                        placeholder="Website"
                        value={formData.website}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.inbx}>
                    <h4>Facebook хаяг</h4>
                    <input
                        type="url"
                        name="facebook"
                        placeholder="Facebook URL"
                        value={formData.facebook}
                        onChange={handleChange}
                    />           
                </div>     
                <div className={styles.inbx}>
                    <h4>Instagram хаяг</h4>
                    <input
                        type="url"
                        name="instagram"
                        placeholder="Instagram URL"
                        value={formData.instagram}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.inbx}>
                    <h4>Клуб үүссэн өдөр</h4>
                    <input
                        type="date"
                        name="club_created"
                        value={formData.club_created}
                        onChange={handleChange}
                    />          
                </div>
                {/* <div className={styles.inbx}> */}
                    <button className={styles.submit} type="submit">Үүсгэх</button>
                {/* </div> */}
            </form>
        </main>
    );
}
