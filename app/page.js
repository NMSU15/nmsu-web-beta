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
    group: '',
    ShineJildOroh: '',
    Ticket: '',
    Idea: ''
  });

  function Buttons({ isFirstSlide, isLastSlide, handlePrevSlide, handleNextSlide, disabled }) {
    return (
      <div className={styles.navigationButtons}>
        {!isFirstSlide && (
          <button type="button" onClick={handlePrevSlide} className={styles.navButtonPrev}>
            Өмнөх
          </button>
        )}
        {!isLastSlide ?(
          <button type="button" onClick={handleNextSlide} className={styles.navButton} disabled={!disabled}>
            Дараах
          </button>
        ):(
          <button type="submit" className={styles.navButton} disabled={sending}>
            {sending ? 'Илгээж байна...' : 'Илгээх'}
          </button>
          )
        }
      </div>
    )
  }

const handleNextSlide = () => {
  if (swiperRef.current && swiperRef.current.swiper) {
    swiperRef.current.swiper.slideNext();
    swiperRef.current.swiper.update();
    swiperRef.current.swiper.updateSlides();
    swiperRef.current.swiper.updateSize();
  }
};

const handlePrevSlide = () => {
  if (swiperRef.current && swiperRef.current.swiper) {
    swiperRef.current.swiper.slidePrev();
    swiperRef.current.swiper.update();
    swiperRef.current.swiper.updateSlides();
    swiperRef.current.swiper.updateSize();
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

    const extendedFormData = {
      ...formData,
      _next: "https://student.nmit.edu.mn/thanks",
      _subject: "Shine Jil!",
      _captcha: "false",
      _template: "table"
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
      // await fetch('https://formsubmit.co/87210a15849cb9819b7b5c5f21f75e0e', {
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
              if (formData.name.trim() !== '') {
                handleNextSlide();
              }
              break;
            case 1:
              if (formData.group.trim() !== '') {
                handleNextSlide();
              }
              break;
            case 2:
              if (formData.ShineJildOroh.trim() !== '') {
                handleNextSlide();
              }
              break;
            case 3:
              if (formData.Ticket.trim() !== '') {
                handleNextSlide();
              }
              break;
            case 4:
              if (formData.Idea.trim() !== '') {
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
          {/* <div className={styles.background} style={{backgroundImage: `url("/elselt/1.jpg")`}}></div> */}
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
          {/* <div className={styles.background} style={{backgroundImage: `url("/elselt/1.jpg")`}}></div> */}
        </div>
        </SwiperSlide>
        <SwiperSlide className={styles.swiperSlide}>
        <div className={styles.dis}>
        {/* <div className={styles.background} style={{backgroundImage: `url("/elselt/2.jpg")`}}></div> */}
          <div className={styles.inputField}>
            <label>Энэ жилийн шинэ жилд орох уу?:</label>
            <div className={styles.checkboxGroup}>
              <div className={styles.label}>
                <input
                  name="ShineJildOroh"
                  id="c1"
                  type="radio"
                  value="Шинэ жилд орно"
                  onChange={handleInputChange}
                  checked={formData.ShineJildOroh === "Шинэ жилд орно"}
                  required
                  hidden
                />
                <label htmlFor="c1" className={styles.label}>
                  Орно
                </label>
              </div>
              <div className={styles.label}>
                <input
                  name="ShineJildOroh"
                  id="c2"
                  type="radio"
                  value="Шинэ жилд орохгүй"
                  onChange={handleInputChange}
                  checked={formData.ShineJildOroh === "Шинэ жилд орохгүй"}
                  required
                  hidden
                />
                <label htmlFor="c2" className={styles.label}>
                  Орохгүй
                </label>
              </div>
              <div className={styles.label}>
                <input
                  name="ShineJildOroh"
                  id="c3"
                  type="radio"
                  value="Шийдээгүй байгаа"
                  onChange={handleInputChange}
                  checked={formData.ShineJildOroh === "Шийдээгүй байгаа"}
                  required
                  hidden
                />
                <label htmlFor="c3" className={styles.label}>
                Шийдээгүй байгаа
                </label>
              </div>
            </div>
            <Buttons 
                isFirstSlide={isFirstSlide} 
                isLastSlide={isLastSlide} 
                handlePrevSlide={handlePrevSlide} 
                handleNextSlide={handleNextSlide}
                disabled={formData.ShineJildOroh.trim() != ''}
              />
          </div>
        </div>
        </SwiperSlide>        
        <SwiperSlide className={styles.swiperSlide}>
        <div className={styles.dis} style={{gridTemplateColumns: "1fr"}}>
          <div className={styles.inputField}>
            <label>Шинэ жилийн ticket-ний үнэ 90k байвал авах уу? авахгүй бол үнийн хувьд хэд байвал авах вэ?:</label>
            <input
              name="Ticket"
              type="text"
              value={formData.Ticket}
              onChange={handleInputChange}
              required
            />
            <Buttons 
                isFirstSlide={isFirstSlide} 
                isLastSlide={isLastSlide} 
                handlePrevSlide={handlePrevSlide} 
                handleNextSlide={handleNextSlide}
                disabled={formData.Ticket.trim() != ""}
              />
          </div>
        </div>
        </SwiperSlide>
        <SwiperSlide className={styles.swiperSlide}>
        <div className={styles.dis} style={{gridTemplateColumns: "1fr"}}>
          <div className={styles.inputField}>
            <label>Шинэ жилээр хийхийг хүссэн зүйл болон хүсэлт байна уу?:</label>
            <textarea
              name="Idea"
              value={formData.Idea}
              onChange={handleInputChange}
            />
            <Buttons 
              isFirstSlide={isFirstSlide} 
              isLastSlide={isLastSlide} 
              handlePrevSlide={handlePrevSlide} 
              handleNextSlide={handleNextSlide}
              disabled={formData.Idea.trim() != ""}
            />
          </div>
        </div>
        </SwiperSlide>
        </Swiper>
      </form>
    </main>
  );
}
