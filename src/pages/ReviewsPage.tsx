/*
  다른 이용자들의 받은 거래 후기 페이지.
*/
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import leftArrow from '../assets/leftarrow.svg';
import placeHolder from '../assets/placeholder_gray.png';
import Loader from '../components/Loader';
import styles from '../css/ReviewsPage.module.css';
import type { ErrorResponseType, Review } from '../typings/user';

const ReviewsPage = () => {
  const { nickname } = useParams<{ nickname: string }>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastId, setLastId] = useState(2100000);
  const [nextRequestId, setNextRequestId] = useState(2100000);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviewsInfo = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (token === null) throw new Error('No token found');
        if (nickname === undefined) throw new Error('id is undefined!');

        const response = await fetch(
          `/api/profile/${nickname}/reviews?reviewId=${lastId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          const errorData = (await response.json()) as ErrorResponseType;
          throw new Error(`데이터 불러오기 실패: ${errorData.error}`);
        }

        const data = (await response.json()) as Review[];

        setNextRequestId(data[data.length - 1]?.id ?? 0);
        console.info(data);
        setReviews((prevReviews) => [...prevReviews, ...data]);
      } catch (error) {
        console.error('error:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchReviewsInfo();
  }, [nickname, lastId]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 500
      ) {
        setLastId(nextRequestId);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [nextRequestId]);

  return (
    <div className={styles.main}>
      <div className={styles.upperBar}>
        <button
          onClick={() => {
            void navigate(-1);
          }}
          className={styles.button}
        >
          <img src={leftArrow} className={styles.upperIcon} />
        </button>
        <p className={styles.pageTitle}>거래 후기 상세</p>
      </div>
      {loading ? (
        <Loader marginTop="40vh" />
      ) : (
        <div className={styles.contentBox}>
          <p className={styles.reviewNumber}>후기 {reviews.length}개</p>
          {reviews.map((review, index) => (
            <div key={index} className={styles.reviewBlock}>
              <img src={placeHolder} className={styles.reviewPic} />
              <div className={styles.reviewSubBlock}>
                <p className={styles.reviewNickname}>
                  {review.seller.nickname === nickname
                    ? review.buyer.nickname
                    : review.seller.nickname}
                </p>
                <p className={styles.reviewInfo}>
                  {review.seller.nickname === nickname ? '구매자' : '판매자'} ·{' '}
                  {review.location}
                </p>
                <p>{review.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;
