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
  const { id } = useParams<{ id: string }>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviewsInfo = async () => {
      try {
        setLoading(true);
        if (id === undefined) throw new Error('id is undefined!');
        const response = await fetch(
          `http://localhost:5173/api/profile/${id}/reviews`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          const errorData = (await response.json()) as ErrorResponseType;
          throw new Error(`데이터 불러오기 실패: ${errorData.error}`);
        }

        const data = (await response.json()) as Review[];
        console.info(data);
        setReviews(data);
      } catch (error) {
        console.error('error:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchReviewsInfo();
  }, [id]);

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
          {reviews.slice(0, 3).map((review, index) => (
            <div key={index} className={styles.reviewBlock}>
              <img src={placeHolder} className={styles.reviewPic} />
              <div className={styles.reviewSubBlock}>
                <p className={styles.reviewNickname}>
                  {review.seller.id === id
                    ? review.buyer.nickname
                    : review.seller.nickname}
                </p>
                <p className={styles.reviewInfo}>
                  {review.seller.id === id ? '구매자' : '판매자'} ·{' '}
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
