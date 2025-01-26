/*
    경매 물품 올리기 페이지
*/
import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';

import placeHolder from '../assets/placeholder_gray.png';
import quitcross from '../assets/quitcross.svg';
import styles from '../css/MannerPraisePage.module.css';
import type { ProfileResponse } from '../typings/user';
import { mannerTypeLabels } from '../typings/user';

type MannerType = keyof typeof mannerTypeLabels;

const MannerPraisePage = () => {
  const { nickname } = useParams<{ nickname: string }>();
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<string>('');
  const [temp, setTemp] = useState<number>();
  const [checkedItems, setCheckedItems] = useState<Record<MannerType, boolean>>(
    Object.fromEntries(
      Object.keys(mannerTypeLabels).map((type) => [type, false]),
    ) as Record<MannerType, boolean>,
  );

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setCheckedItems((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  useEffect(() => {
    const fetchProfileInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token === null) {
          throw new Error('토큰이 없습니다.');
        }
        if (nickname === undefined) {
          throw new Error('닉네임 정보가 없습니다.');
        }
        const response = await fetch(`/api/profile/${nickname}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`서버에 데이터를 전송하지 못했습니다`);
        }

        const data = (await response.json()) as ProfileResponse;
        setTemp(data.user.temperature);
        setProfileImage(data.user.imagePresignedUrl);
      } catch (error) {
        console.error(error);
      }
    };

    void fetchProfileInfo();
  }, [nickname]);

  const handlePostClick = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token === null) throw new Error('No token found');
      if (nickname === undefined) throw new Error('닉네임 정보가 없습니다.');

      const selectedMannerTypes = Object.entries(checkedItems)
        .filter(([, checked]) => checked)
        .map(([key]) => key as MannerType);

      for (const mannerType of selectedMannerTypes) {
        const response = await fetch(
          `/api/profile/${nickname}/praise/${mannerType}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to send praise for ${mannerType}`);
        }
      }

      void navigate(-1);
    } catch (error) {
      console.error('에러 발생:', error);
    }
  };

  const handlePostClickWrapper = () => {
    void handlePostClick();
  };

  return (
    <div className={styles.main}>
      <div className={styles.upperbar}>
        <button
          onClick={() => {
            void navigate(-1);
          }}
          className={styles.button}
        >
          <img src={quitcross} className={styles.quitcross} />
        </button>
        <p className={styles.upperbartext}>매너 칭찬하기</p>
      </div>
      <div className={styles.profile}>
        <img
          src={profileImage === '' ? placeHolder : profileImage}
          className={styles.profileImage}
        />
        <div className={styles.nickname}>
          <p className={styles.nicknameText}>
            {nickname === undefined ? '닉네임' : decodeURIComponent(nickname)}
          </p>
          <p
            className={styles.temp}
          >{`매너온도 ${temp === undefined ? 0 : temp}°C`}</p>
        </div>
      </div>
      <div className={styles.info}>
        <p>칭찬 인사를 남기면 상대방의 매너온도가 올라가요.</p>
        <NavLink to="/temp">자세히 보기</NavLink>
      </div>
      <div className={styles.checkboxContainer}>
        <p className={styles.mainText}>어떤 점이 좋았나요?</p>
        {Object.entries(mannerTypeLabels).map(([key, label]) => (
          <label key={key} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name={key}
              className={styles.checkbox}
              checked={checkedItems[key as MannerType]}
              onChange={handleCheckboxChange}
            />
            {label}
          </label>
        ))}
      </div>
      <div className={styles.content}>
        <button onClick={handlePostClickWrapper} className={styles.PostButton}>
          칭찬하기
        </button>
        <p className={styles.cancelBox}>취소</p>
      </div>
    </div>
  );
};

export default MannerPraisePage;
