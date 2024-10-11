'use client';

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import styles from "./page.module.scss";
import { useRouter } from 'next/navigation'
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';

function Buttons({ isFirstSlide, isLastSlide, handlePrevSlide, handleNextSlide, disabled }) {
  return (
    <div className={styles.navigationButtons}>
      {!isFirstSlide && (
        <button type="button" onClick={handlePrevSlide} className={styles.navButton}>
          Өмнөх
        </button>
      )}
      {!isLastSlide && (
        <button type="button" onClick={handleNextSlide} className={styles.navButton} disabled={!disabled}>
          Дараах
        </button>
      )}
    </div>
  )
}

export default function Page() {
  const router = useRouter();
  const { data: session } = useSession();
  const swiperRef = useRef(null);
  const [isFirstSlide, setIsFirstSlide] = useState(true);
  const [isLastSlide, setIsLastSlide] = useState(false);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    group: '',
    davuutal: '',
    sultal: '',
    volunteerExperience: [],
    reasonForJoining: '',
    selfDescription: ''
  });

const handleNextSlide = () => {
  if (swiperRef.current && swiperRef.current.swiper) {
    swiperRef.current.swiper.slideNext();  // Set speed to 0 for instant transitions
    swiperRef.current.swiper.update();      // Force recalculation of dimensions
    swiperRef.current.swiper.updateSlides(); // Ensure slides are updated
    swiperRef.current.swiper.updateSize();  // Force Swiper to recalculate size
  }
};

const handlePrevSlide = () => {
  if (swiperRef.current && swiperRef.current.swiper) {
    swiperRef.current.swiper.slidePrev();  // Set speed to 0 for instant transitions
    swiperRef.current.swiper.update();      // Force recalculation of dimensions
    swiperRef.current.swiper.updateSlides(); // Ensure slides are updated
    swiperRef.current.swiper.updateSize();  // Force Swiper to recalculate size
  }
};

  const handleSlideChange = (swiper) => {
    setIsFirstSlide(swiper.isBeginning);
    setIsLastSlide(swiper.isEnd);
  };

  // Populate email and name once session is loaded
  useEffect(() => {
    if (session) {
      setFormData(prevData => ({
        ...prevData,
        email: session.user.email,
        name: session.user.name
      }));
    }
  }, [session]);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prevState => {
      const selectedOptions = prevState.volunteerExperience;
      if (checked) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    let failed = true;

    const volunteerExperienceString = formData.volunteerExperience.join(', ');

    const extendedFormData = {
      ...formData,
      _next: "https://student.nmit.edu.mn/thanks",
      _subject: "Elselt!",
      _captcha: "false",
      _template: "table",
      volunteerExperience: volunteerExperienceString,
    };

    // try {
    //   const internalResponse = await fetch('/api/submit-form', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(formData),
    //   });

    //   const internalResult = await internalResponse.json();
    //   if (internalResponse.ok) {
    //     failed = false;
    //   } else {
    //     alert('Failed to submit form to internal API.');
    //   }
    // } catch (error) {
    //   console.error('Error submitting form to internal API:', error);
    // }

    try {
      await fetch('https://formsubmit.co/87210a15849cb9819b7b5c5f21f75e0e', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(extendedFormData).toString(),
      });
      failed = false;
    } catch (error) {
      console.warn('Failed to submit to formsubmit.co. Ignoring error and continuing.', error);
    }

    if (!failed) {
      router.push('/thanks');
    } else {
      alert("not submitted!");
      setSending(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        // Check if the current slide's input is valid before moving to the next slide
        if (swiperRef.current && swiperRef.current.swiper) {
          const currentSlide = swiperRef.current.swiper.activeIndex;

          switch (currentSlide) {
            case 0:
              if (formData.email && (formData.email.includes("@nmit.edu.mn") || formData.email.includes("@gmail.com") || formData.email.includes("@yahoo.com") || formData.email.includes("@hotmail.com") || formData.email.includes("@outlook.com"))) {
                handleNextSlide();
              }
              break;
            case 1:
              if (formData.name !== '') {
                handleNextSlide();
              }
              break;
            case 2:
              if (formData.group !== '') {
                handleNextSlide();
              }
              break;
            case 3:
              handleNextSlide(); // For checkboxes, allow moving ahead without validation
              break;
            case 4:
              if (formData.reasonForJoining !== '') {
                handleNextSlide();
              }
              break;
            case 5:
              if (formData.selfDescription !== '') {
                handleNextSlide();
              }
              break;
            default:
              break;
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [formData]);

  return (
    <main className={styles.main}>
      <form className={styles.form} onSubmit={handleSubmit}>
      <Swiper
          ref={swiperRef}
          className={styles.swiper}
          spaceBetween={120}
          slidesPerView={1}
          onSlideChange={handleSlideChange}
          allowTouchMove={false}
          resistance={false}
          simulateTouch={false}
          speed={0}
          autoHeight={false}
          modules={[Pagination, Navigation]}
        >
        <SwiperSlide className={styles.swiperSlide}>
        <div className={styles.dis}>
          <div 
            className={styles.inputField}
          >
            <label>Имэйл хаяг:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              readOnly={!!session}
            />
            <Buttons 
              isFirstSlide={isFirstSlide} 
              isLastSlide={isLastSlide} 
              handlePrevSlide={handlePrevSlide} 
              handleNextSlide={handleNextSlide}
              disabled={formData.email.includes("@nmit.edu.mn") || formData.email.includes("@gmail.com") || formData.email.includes("@yahoo.com") || formData.email.includes("@hotmail.com") || formData.email.includes("@outlook.com")}
            />
          </div>
          <div className={styles.background} style={{backgroundImage: `url("/elselt/1.jpg")`}}></div>
        </div>
        </SwiperSlide>
        <SwiperSlide className={styles.swiperSlide}>
        <div className={styles.dis}>
          <div className={styles.inputField}>
            <label>Нэр:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              readOnly={!!session}
            />
            <Buttons
              isFirstSlide={isFirstSlide} 
              isLastSlide={isLastSlide} 
              handlePrevSlide={handlePrevSlide} 
              handleNextSlide={handleNextSlide}
              disabled={formData.name.trim() != ""}
            />
          </div>
          <div className={styles.background} style={{backgroundImage: `url("/elselt/1.jpg")`}}></div>
        </div>
        </SwiperSlide>
        <SwiperSlide className={styles.swiperSlide}>
        <div className={styles.dis}>
          <div className={styles.inputField}>
            <label>Анги групп:</label>
            <input
              type="text"
              name="group"
              value={formData.group}
              onChange={handleInputChange}
              required
            />
            <Buttons 
              isFirstSlide={isFirstSlide} 
              isLastSlide={isLastSlide} 
              handlePrevSlide={handlePrevSlide} 
              handleNextSlide={handleNextSlide}
              disabled={formData.group.trim() != ""}
            />
          </div>
          <div className={styles.background} style={{backgroundImage: `url("/elselt/1.jpg")`}}></div>
        </div>
        </SwiperSlide>
        <SwiperSlide className={styles.swiperSlide}>
        <div className={styles.dis}>
        <div className={styles.background} style={{backgroundImage: `url("/elselt/2.jpg")`}}></div>
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
            <Buttons 
                isFirstSlide={isFirstSlide} 
                isLastSlide={isLastSlide} 
                handlePrevSlide={handlePrevSlide} 
                handleNextSlide={handleNextSlide}
                disabled={true}
              />
          </div>
        </div>
        </SwiperSlide>        
        <SwiperSlide className={styles.swiperSlide}>
        <div className={styles.dis} style={{gridTemplateColumns: "1fr"}}>
          <div className={styles.inputField}>
            <label>Чи бусдаас юугаараа илүү байж чадах вэ? Ямар чадвар давуу талтай вэ?:</label>
            <textarea
              name="davuutal"
              value={formData.davuutal}
              onChange={handleInputChange}
              required
            />
            <Buttons 
                isFirstSlide={isFirstSlide} 
                isLastSlide={isLastSlide} 
                handlePrevSlide={handlePrevSlide} 
                handleNextSlide={handleNextSlide}
                disabled={formData.davuutal.trim() != ""}
              />
          </div>
        </div>
        </SwiperSlide>
        <SwiperSlide className={styles.swiperSlide}>
        <div className={styles.dis} style={{gridTemplateColumns: "1fr"}}>
          <div className={styles.inputField}>
            <label>Өөрийнхөө сул тал болон сайжруулахыг хүсдэг зүйлс:</label>
            <textarea
              name="sultal"
              value={formData.sultal}
              onChange={handleInputChange}
              required
            />
            <Buttons 
                isFirstSlide={isFirstSlide} 
                isLastSlide={isLastSlide} 
                handlePrevSlide={handlePrevSlide} 
                handleNextSlide={handleNextSlide}
                disabled={formData.sultal.trim() != ""}
              />
          </div>
        </div>
        </SwiperSlide>
        <SwiperSlide className={styles.swiperSlide}>
        <div className={styles.dis} style={{gridTemplateColumns: "1fr"}}>
          <div className={styles.inputField}>
            <label>Оюутны холбоонд орох болсон шалтгаан:</label>
            <textarea
              name="reasonForJoining"
              value={formData.reasonForJoining}
              onChange={handleInputChange}
              required
            />
            <Buttons 
              isFirstSlide={isFirstSlide} 
              isLastSlide={isLastSlide} 
              handlePrevSlide={handlePrevSlide} 
              handleNextSlide={handleNextSlide}
              disabled={formData.reasonForJoining.trim() != ""}
            />
          </div>
        </div>
        </SwiperSlide>
        <SwiperSlide className={styles.swiperSlide}>
        <div className={styles.dis} style={{gridTemplateColumns: "1fr"}}>
          <div className={styles.inputField}>
            <label>Өөрийгөө нэг өгүүлбэрээр илэрхийл гэвэл:</label>
            <textarea
              name="selfDescription"
              value={formData.selfDescription}
              onChange={handleInputChange}
              required
            />
            <Buttons 
              isFirstSlide={isFirstSlide} 
              isLastSlide={isLastSlide} 
              handlePrevSlide={handlePrevSlide} 
              handleNextSlide={handleNextSlide}
            />
            <button type="submit" className={styles.submit} disabled={sending}>
              {sending ? 'Илгээж байна...' : 'Илгээх'}
            </button>
          </div>
        </div>
        </SwiperSlide>
        </Swiper>
      </form>
    </main>
  );
}
