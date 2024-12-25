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
    instagram: '',
    starter: '',
    mainDishes: [],
    alcohol: ''
  });

  function Buttons({ isFirstSlide, isLastSlide, handlePrevSlide, handleNextSlide, disabled }) {
    return (
      <div className={styles.navigationButtons}>
        {!isFirstSlide && (
          <button type="button" onClick={handlePrevSlide} className={styles.navButtonPrev}>
            Previous
          </button>
        )}
        {!isLastSlide ? (
          <button type="button" onClick={handleNextSlide} className={styles.navButton} disabled={!disabled}>
            Next
          </button>
        ) : (
          <button type="submit" className={styles.navButton} disabled={sending}>
            {sending ? 'Sending...' : 'Submit'}
          </button>
        )}
      </div>
    )
  }

  const handleNextSlide = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
      swiperRef.current.swiper.update();
    }
  };

  const handlePrevSlide = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
      swiperRef.current.swiper.update();
    }
  };

  const handleSlideChange = (swiper) => {
    setIsFirstSlide(swiper.isBeginning);
    setIsLastSlide(swiper.isEnd);
  };

  useEffect(() => {
    if (session) {
      setFormData(prevData => ({
        ...prevData,
        email: session.user.email,
        name: session.user.name
      }));
    }
  }, [session]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'mainDishes') {
      let updatedMainDishes = [...formData.mainDishes];
      
      if (checked && updatedMainDishes.length < 2) {
        updatedMainDishes.push(value);
      } else if (!checked) {
        updatedMainDishes = updatedMainDishes.filter(dish => dish !== value);
      }
      
      setFormData(prevState => ({
        ...prevState,
        mainDishes: updatedMainDishes
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    let failed = true;

    const extendedFormData = {
      ...formData,
      _next: "https://nmit.vercel.app/thanks",
      _subject: "Menu Selection",
      _captcha: "false",
      _template: "table"
    };

    try {
      const internalResponse = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!internalResponse.ok) {
        alert('Failed to submit form to internal API.');
      }
    } catch (error) {
      console.error('Error submitting form to internal API:', error);
    }

    try {
      await fetch('https://formsubmit.co/student_union@nmit.edu.mn', {
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
      setSending(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        
        if (swiperRef.current && swiperRef.current.swiper) {
          const currentSlide = swiperRef.current.swiper.activeIndex;
          
          switch (currentSlide) {
            case 0:
              if (formData.name.trim() !== '') handleNextSlide();
              break;
            case 1:
              if (formData.instagram.trim() !== '') handleNextSlide();
              break;
            case 2:
              if (formData.starter.trim() !== '') handleNextSlide();
              break;
            case 3:
              if (formData.mainDishes.length === 2) handleNextSlide();
              break;
            case 4:
              if (formData.alcohol.trim() !== '') handleNextSlide();
              break;
            default:
              break;
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
              <div className={styles.inputField}>
                <label>Name:</label>
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
                  disabled={formData.name.trim() !== ""}
                />
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className={styles.swiperSlide}>
            <div className={styles.dis}>
              <div className={styles.inputField}>
                <label>Instagram:</label>
                <input
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleInputChange}
                />
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
            <div className={styles.dis}>
              <div className={styles.inputField}>
                <label>Starter:</label>
                <div className={styles.checkboxGroup}>
                  <div className={styles.label}>
                    <input
                      name="starter"
                      id="s1"
                      type="radio"
                      value="Caesar salad"
                      onChange={handleInputChange}
                      checked={formData.starter === "Caesar salad"}
                      required
                      hidden
                    />
                    <label htmlFor="s1" className={styles.label}>
                      Caesar salad
                    </label>
                  </div>
                  <div className={styles.label}>
                    <input
                      name="starter"
                      id="s2"
                      type="radio"
                      value="Mango Salad"
                      onChange={handleInputChange}
                      checked={formData.starter === "Mango Salad"}
                      required
                      hidden
                    />
                    <label htmlFor="s2" className={styles.label}>
                      Mango Salad
                    </label>
                  </div>
                </div>
                <Buttons
                  isFirstSlide={isFirstSlide}
                  isLastSlide={isLastSlide}
                  handlePrevSlide={handlePrevSlide}
                  handleNextSlide={handleNextSlide}
                  disabled={formData.starter.trim() !== ""}
                />
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className={styles.swiperSlide}>
            <div className={styles.dis}>
              <div className={styles.inputField}>
                <label>Main Dish (Select 2):</label>
                <div className={styles.checkboxGroup}>
                  <div className={styles.label}>
                    <input
                      type="checkbox"
                      name="mainDishes"
                      id="m1"
                      value="Chicken steak"
                      onChange={handleInputChange}
                      checked={formData.mainDishes.includes("Chicken steak")}
                      disabled={formData.mainDishes.length >= 2 && !formData.mainDishes.includes("Chicken steak")}
                    />
                    <label htmlFor="m1" className={styles.label}>
                      Chicken steak
                    </label>
                  </div>
                  <div className={styles.label}>
                    <input
                      type="checkbox"
                      name="mainDishes"
                      id="m2"
                      value="Grilled lamb roll"
                      onChange={handleInputChange}
                      checked={formData.mainDishes.includes("Grilled lamb roll")}
                      disabled={formData.mainDishes.length >= 2 && !formData.mainDishes.includes("Grilled lamb roll")}
                    />
                    <label htmlFor="m2" className={styles.label}>
                      Grilled lamb roll
                    </label>
                  </div>
                  <div className={styles.label}>
                    <input
                      type="checkbox"
                      name="mainDishes"
                      id="m3"
                      value="Pork neck steak"
                      onChange={handleInputChange}
                      checked={formData.mainDishes.includes("Pork neck steak")}
                      disabled={formData.mainDishes.length >= 2 && !formData.mainDishes.includes("Pork neck steak")}
                    />
                    <label htmlFor="m3" className={styles.label}>
                      Pork neck steak
                    </label>
                  </div>
                </div>
                <small className={styles.helper}>
                  {formData.mainDishes.length}/2 selected
                </small>
                <Buttons
                  isFirstSlide={isFirstSlide}
                  isLastSlide={isLastSlide}
                  handlePrevSlide={handlePrevSlide}
                  handleNextSlide={handleNextSlide}
                  disabled={formData.mainDishes.length === 2}
                />
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className={styles.swiperSlide}>
            <div className={styles.dis}>
              <div className={styles.inputField}>
                <label>Alcohol Option:</label>
                <small className={styles.description}>
                21 хүрсэн эсвэл 3 болон 4-р курсийн оюутнууд үнэгүй авах боломжтой.
                </small>
                <div className={styles.checkboxGroup}>
                  <div className={styles.label}>
                    <input
                      name="alcohol"
                      id="a1"
                      type="radio"
                      value="yes"
                      onChange={handleInputChange}
                      checked={formData.alcohol === "yes"}
                      required
                      hidden
                    />
                    <label htmlFor="a1" className={styles.label}>
                      Yes
                    </label>
                  </div>
                  <div className={styles.label}>
                    <input
                      name="alcohol"
                      id="a2"
                      type="radio"
                      value="no"
                      onChange={handleInputChange}
                      checked={formData.alcohol === "no"}
                      required
                      hidden
                    />
                    <label htmlFor="a2" className={styles.label}>
                      No
                    </label>
                  </div>
                </div>
                <Buttons
                  isFirstSlide={isFirstSlide}
                  isLastSlide={isLastSlide}
                  handlePrevSlide={handlePrevSlide}
                  handleNextSlide={handleNextSlide}
                  disabled={formData.alcohol.trim() !== ""}
                />
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </form>
    </main>
  );
}