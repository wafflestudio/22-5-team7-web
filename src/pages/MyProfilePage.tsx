/*
  나의 프로필 페이지.
*/
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import infoIcon from '../assets/information.svg';
import leftArrow from '../assets/leftarrow.svg';
import peopleIcon from '../assets/people.svg';
import placeHolder from '../assets/placeholder_gray.png';
import rightArrow from '../assets/rightarrow_black.svg';
import shareIcon from '../assets/share.svg';
import Loader from '../components/Loader';
import TemperatureGauge from '../components/TemperatureGauge';
import styles from '../css/ProfilePage.module.css';
import type { ProfileResponse } from '../typings/user';
import type { ErrorResponseType } from '../typings/user';
import { handleShareClick } from '../utils/eventhandlers';
import { getTimeAgo } from '../utils/utils';

const MyProfilePage = () => {
  const [profile, setProfile] = useState<ProfileResponse>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMyProfileInfo = async () => {
      const token = localStorage.getItem('token');
      try {
        setLoading(true);
        if (token === null) throw new Error('No token found');
        const response = await fetch(
          '/api/mypage/profile',
          //'https://eab7f8a7-4889-4c27-8a86-0305c4e85524.mock.pstmn.io/api/mypage/profile',  // mock API
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`, // token 어떻게 전달하는지 얘기해봐야 함
            },
          },
        );

        if (!response.ok) {
          const errorData = (await response.json()) as ErrorResponseType;
          throw new Error(`데이터 불러오기 실패: ${errorData.error}`);
        }

        const data = (await response.json()) as ProfileResponse;
        console.info(data);
        setProfile(data);
      } catch (error) {
        console.error('error:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchMyProfileInfo();
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.upperBar}>
        <NavLink to="/mypage">
          <img src={leftArrow} className={styles.upperIcon} />
        </NavLink>
        <p className={styles.pageTitle}>프로필</p>
        <img
          src={shareIcon}
          className={styles.upperIcon}
          onClick={handleShareClick}
        />
      </div>
      {loading || profile === undefined ? (
        <Loader marginTop="40vh" />
      ) : (
        <div className={styles.contentBox}>
          <div className={styles.block}>
            <div className={styles.profile}>
              <img
                src={
                  profile.user.imagePresignedUrl === ''
                    ? placeHolder
                    : profile.user.imagePresignedUrl
                }
                className={styles.profilePic}
              />
              {profile.user.nickname}
            </div>
            <NavLink to="edit" className={styles.profileEditButton}>
              프로필 수정
            </NavLink>
            <div style={{ display: 'flex' }}>
              <p className={styles.mannerTempTitle}>매너온도</p>
              <img src={infoIcon} style={{ height: '20px' }} />
            </div>
            <TemperatureGauge temperature={profile.user.temperature} />
          </div>
          <div className={styles.separator} />
          <div className={styles.block}>
            <NavLink to="/mypage/sells" className={styles.button}>
              <p>판매물품 {profile.itemCount} 개</p>
              <img src={rightArrow} style={{ height: '20px' }} />
            </NavLink>
          </div>
          <div className={styles.separator} />
          <div className={styles.block}>
            <NavLink
              to={`/profile/${profile.user.id}/manners`}
              className={styles.button}
            >
              <p>받은 매너 평가</p>
              <img src={rightArrow} style={{ height: '20px' }} />
            </NavLink>
            {profile.manners
              .sort((a, b) => b.count - a.count)
              .slice(0, 3)
              .map((manner, index) => (
                <div key={index} className={styles.mannerLine}>
                  <img src={peopleIcon} style={{ height: '20px' }} />
                  <p style={{ fontWeight: 'bold' }}>{manner.count}</p>
                  <p className={styles.mannerLabel}>{manner.mannerType}</p>
                </div>
              ))}
          </div>
          <div className={styles.separator} />
          <div className={styles.block}>
            <NavLink
              to={`/profile/${profile.user.id}/reviews`}
              className={styles.button}
            >
              <p>받은 거래 후기 {profile.reviewCount}</p>
              <img src={rightArrow} style={{ height: '20px' }} />
            </NavLink>
          </div>
          {profile.reviews.slice(0, 3).map((review, index) => (
            <div key={index} className={styles.reviewBlock}>
              <img src={placeHolder} className={styles.reviewPic} />
              <div className={styles.reviewSubBlock}>
                <p className={styles.reviewNickname}>
                  {review.seller.id === profile.user.id
                    ? review.buyer.nickname
                    : review.seller.nickname}
                </p>
                <p className={styles.reviewInfo}>
                  {review.seller.id === profile.user.id ? '구매자' : '판매자'} ·{' '}
                  {review.location} · {getTimeAgo(review.createdAt)}
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

export default MyProfilePage;
