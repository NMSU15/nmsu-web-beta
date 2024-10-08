'use client';

import { useState } from "react";
import { useSession } from "next-auth/react";
import styles from "./page.module.scss";

export default function Page() {
  const { data: session } = useSession();

  const [formData, setFormData] = useState({
    email: session?.user?.email || '',
    name: session?.user?.name || '',
    group: '',
    volunteerExperience: '',
    reasonForJoining: '',
    selfDescription: ''
  });

    // Handles checkbox changes
    const handleCheckboxChange = (e) => {
      const { value, checked } = e.target;
      setFormData(prevState => {
        const selectedOptions = prevState.volunteerExperience;
        if (checked) {
          // Add the option if it's checked
          return {
            ...prevState,
            volunteerExperience: [...selectedOptions, value]
          };
        } else {
          return {
            ...prevState,
            volunteerExperience: selectedOptions.filter(option => option !== value)
          };
        }
      });
    };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <main>
      <form className={styles.form} onSubmit={handleSubmit} action="https://formsubmit.co/student_union@nmit.edu.mn" method="POST">
          <input type="hidden" name="_next" value={`https://student.nmit.edu.mn/thanks`}/>
          <input type="hidden" name="_captcha" value="false"/>
          <input type="hidden" name="_template" value="table"/>
        <div className={styles.inputField}>
          <label>Имэйл хаяг:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled
          />
        </div>
        <div className={styles.inputField}>
          <label>Нэр:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            disabled
          />
        </div>
        <div className={styles.inputField}>
          <label>Групп:</label>
          <input
            type="text"
            name="group"
            value={formData.group}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.inputField}>
          <label>Өмнө нь сайн дурын ажил, СӨУЗ, оюутны холбоонд байсан эсэх:</label>
          <div className={styles.checkboxGroup}>
            <label className={styles.label}>
            Сайн дурын ажил хийж байсан
              <input
                type="checkbox"
                value="Сайн дурын ажил хийж байсан"
                onChange={handleCheckboxChange}
                checked={formData.volunteerExperience.includes("Сайн дурын ажил хийж байсан")}
              />
            </label>
            <label className={styles.label}>
            Сурагчдын өөрөө удирдах зөвлөлд байсан
              <input
                type="checkbox"
                value="Сурагчдын өөрөө удирдах зөвлөлд байсан"
                onChange={handleCheckboxChange}
                checked={formData.volunteerExperience.includes("Сурагчдын өөрөө удирдах зөвлөлд байсан")}
              />
            </label>
            <label className={styles.label}>
            Оюутны холбоонд байсан
              <input
                type="checkbox"
                value="Оюутны холбоонд байсан"
                onChange={handleCheckboxChange}
                checked={formData.volunteerExperience.includes("Оюутны холбоонд байсан")}
              />
            </label>
          </div>
        </div>
        <div className={styles.inputField}>
          <label>Оюутны холбоонд орох болсон шалтгаан:</label>
          <textarea
            name="reasonForJoining"
            value={formData.reasonForJoining}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.inputField}>
          <label>Өөрийгөө нэг өгүүлбэрээр илэрхийл гэвэл:</label>
          <textarea
            name="selfDescription"
            value={formData.selfDescription}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className={styles.submit}>Илгээх</button>
      </form>
    </main>
  );
}
