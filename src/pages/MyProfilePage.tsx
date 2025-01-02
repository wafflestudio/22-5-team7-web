/*
  나의 프로필 페이지.
*/
import { NavLink } from 'react-router-dom';

import infoIcon from '../assets/information.svg';
import leftArrow from '../assets/leftarrow.svg';
import peopleIcon from '../assets/people.svg';
import placeHolder from '../assets/placeholder_gray.png';
import rightArrow from '../assets/rightarrow_black.svg';
import shareIcon from '../assets/share.svg';
import TemperatureGauge from '../components/TemperatureGauge';
import styles from '../css/ProfilePage.module.css';
import type { User } from '../typings/user';

const MyProfilePage = () => {
  const tempUser: User = {
    // 나중에 API 연결
    id: 'mytempid',
    nickname: '단호한 호박',
    userId: 'hobak123',
    location: '대학동',
    temperature: 40.7,
    sellingItems: 2,
    manners: [
      {
        label: '친절하고 매너가 좋아요.',
        number: 45,
      },
      {
        label: '시간 약속을 잘 지켜요.',
        number: 42,
      },
      {
        label: '제가 있는 곳까지 와서 거래했어요.',
        number: 28,
      },
      {
        label: '응답이 빨라요.',
        number: 42,
      },
      {
        label: '물품상태가 설명한 것과 같아요.',
        number: 12,
      },
      {
        label: '좋은 물품을 저렴하게 판매해요.',
        number: 10,
      },
      {
        label: '물품설명이 자세해요.',
        number: 8,
      },
      {
        label: '나눔을 해주셨어요.',
        number: 5,
      },
    ],
    reviews: [
      {
        profilePic: 'put_url_here',
        nickname: '췌민킴',
        type: '구매자',
        location: '서울특별시 관악구',
        time: 8,
        text: '상품 상태가 좋네요 ^^',
      },
      {
        profilePic: 'put_url_here',
        nickname: 'ilovekimchi',
        type: '판매자',
        location: '서울특별시 송파구',
        time: 27,
        text: '잘 쓰세요~',
      },
      {
        profilePic: 'put_url_here',
        nickname: 'imwinter',
        type: '구매자',
        location: '서울특별시 영등포구',
        time: 81,
        text: '안녕하세요 에스파 윈터입니다~ 새로 나온 저희 앨범 잘 들어주세요!',
      },
    ],
  };

  return (
    <div className={styles.main}>
      <div className={styles.upperBar}>
        <NavLink to="/mypage">
          <img src={leftArrow} className={styles.upperIcon} />
        </NavLink>
        <p className={styles.pageTitle}>프로필</p>
        <img src={shareIcon} className={styles.upperIcon} />
      </div>
      <div className={styles.contentBox}>
        <div className={styles.block}>
          <div className={styles.profile}>
            <img src={placeHolder} className={styles.profilePic} />
            {tempUser.nickname}
          </div>
          <NavLink to="/temp" className={styles.profileEditButton}>
            프로필 수정
          </NavLink>
          <div style={{ display: 'flex' }}>
            <p className={styles.mannerTempTitle}>매너온도</p>
            <img src={infoIcon} style={{ height: '20px' }} />
          </div>
          <TemperatureGauge temperature={tempUser.temperature} />
        </div>
        <div className={styles.separator} />
        <div className={styles.block}>
          <NavLink to="/mypage/sells" className={styles.button}>
            <p>판매물품 {tempUser.sellingItems}개</p>
            <img src={rightArrow} style={{ height: '20px' }} />
          </NavLink>
        </div>
        <div className={styles.separator} />
        <div className={styles.block}>
          <NavLink
            to={`/profile/${tempUser.id}/manners`}
            className={styles.button}
          >
            <p>받은 매너 평가</p>
            <img src={rightArrow} style={{ height: '20px' }} />
          </NavLink>
          {tempUser.manners
            .sort((a, b) => b.number - a.number)
            .slice(0, 3)
            .map((manner, index) => (
              <div key={index} className={styles.mannerLine}>
                <img src={peopleIcon} style={{ height: '20px' }} />
                <p style={{ fontWeight: 'bold' }}>{manner.number}</p>
                <p className={styles.mannerLabel}>{manner.label}</p>
              </div>
            ))}
        </div>
        <div className={styles.separator} />
        <div className={styles.block}>
          <NavLink
            to={`/profile/${tempUser.id}/reviews`}
            className={styles.button}
          >
            <p>받은 거래 후기 {tempUser.reviews.length}</p>
            <img src={rightArrow} style={{ height: '20px' }} />
          </NavLink>
        </div>
        {tempUser.reviews.slice(0, 3).map((review, index) => (
          <div key={index} className={styles.reviewBlock}>
            <img src={placeHolder} className={styles.reviewPic} />
            <div className={styles.reviewSubBlock}>
              <p className={styles.reviewNickname}>{review.nickname}</p>
              <p className={styles.reviewInfo}>
                {review.type} · {review.location} · {review.time}일 전
              </p>
              <p>{review.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyProfilePage;
