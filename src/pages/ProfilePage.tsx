/*
  다른 이용자들의 프로필 페이지.
*/
import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';

import infoIcon from '../assets/information.svg';
import leftArrow from '../assets/leftarrow.svg';
import peopleIcon from '../assets/people.svg';
import placeHolder from '../assets/placeholder_gray.png';
import rightArrow from '../assets/rightarrow_black.svg';
import shareIcon from '../assets/share.svg';
import Loader from '../components/Loader';
import TemperatureGauge from '../components/TemperatureGauge';
import styles from '../css/ProfilePage.module.css';
import type { LocationState } from '../typings/toolBar';
import type { ErrorResponseType, ProfileResponse } from '../typings/user';
import { mannerTypeLabels } from '../typings/user';
import { handleShareClick } from '../utils/eventhandlers';
import { getTimeAgo } from '../utils/utils';

const ProfilePage = () => {
  const { nickname } = useParams<{ nickname: string }>();
  const [profile, setProfile] = useState<ProfileResponse>();
  const [loading, setLoading] = useState<boolean>(true);
  const myId = localStorage.getItem('userId');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchProfileInfo = async () => {
      const token = localStorage.getItem('token');
      try {
        setLoading(true);
        if (token === null) throw new Error('No token found');
        if (nickname === undefined) throw new Error('Nickname is undefined');
        const response = await fetch(
          `/api/profile?nickname=${encodeURIComponent(nickname)}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
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

    void fetchProfileInfo();
  }, [nickname]);

  const handleBackClick = () => {
    const locationState = location.state as LocationState;

    if (locationState !== null && locationState.from === 'profileEdit') {
      void navigate(-3);
    } else {
      void navigate(-1);
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.upperBar}>
        <button onClick={handleBackClick} className={styles.button}>
          <img src={leftArrow} className={styles.upperIcon} />
        </button>
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
            {profile.user.id === myId ? (
              <NavLink
                to="/mypage/profile/edit"
                className={styles.profileEditButton}
              >
                프로필 수정
              </NavLink>
            ) : (
              <NavLink to="/temp" className={styles.profileEditButton}>
                매너 칭찬하기
              </NavLink>
            )}
            <div style={{ display: 'flex' }}>
              <p className={styles.mannerTempTitle}>매너온도</p>
              <img src={infoIcon} style={{ height: '20px' }} />
            </div>
            <TemperatureGauge temperature={profile.user.temperature} />
          </div>
          <div className={styles.separator} />
          <div className={styles.block}>
            <NavLink
              to={
                profile.user.id === myId
                  ? '/mypage/sells'
                  : `/profile/${profile.user.nickname}/sells`
              }
              className={styles.button}
            >
              <p>판매물품 {profile.itemCount} 개</p>
              <img src={rightArrow} style={{ height: '20px' }} />
            </NavLink>
          </div>
          <div className={styles.separator} />
          <div className={styles.block}>
            <NavLink
              to={`/profile/${profile.user.nickname}/manners`}
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
                  <p className={styles.mannerLabel}>
                    {
                      mannerTypeLabels[
                        manner.mannerType as keyof typeof mannerTypeLabels
                      ]
                    }
                  </p>
                </div>
              ))}
          </div>
          <div className={styles.separator} />
          <div className={styles.block}>
            <NavLink
              to={`/profile/${profile.user.nickname}/reviews`}
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

export default ProfilePage;
