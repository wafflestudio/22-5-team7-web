/*
    경매 물품 올리기 페이지
*/
import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';

import quitcross from '../assets/quitcross.svg';
import styles from '../css/MannerPraisePage.module.css';
import type { ArticleResponse } from '../typings/item';
import type { User } from '../typings/user';

const MannerPraisePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<string>();
  const [nickname, setNickname] = useState<string>();
  const [temp, setTemp] = useState<number>();
  const [checkedItems, setCheckedItems] = useState({
    item1: false,
    item2: false,
    item3: false,
  });

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setCheckedItems((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  useEffect(() => {
    const fetchIteminfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token === null) {
          throw new Error('토큰이 없습니다.');
        }
        if (id === undefined) {
          throw new Error('상대방 정보가 없습니다.');
        }
        const response = await fetch(`/api/item/get/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`서버에 데이터를 전송하지 못했습니다`);
        }

        const data: User = (await response.json()) as User;
        setNickname(data.nickname);
        setTemp(data.temperature);
        setProfileImage(data.imagePresignedUrl);
      } catch (error) {
        console.error(error);
      }
    };

    void fetchIteminfo();
  }, [id]);

  const handlePostClick = async () => {
    const postData = {};

    const token = localStorage.getItem('token');

    try {
      if (token === null) throw new Error('No token found');
      const response = await fetch('/api/item/post', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error('서버에 데이터를 전송하지 못했습니다.');
      }

      const data = (await response.json()) as ArticleResponse;

      void navigate(`/item/${data.id}`, {
        state: { from: 'itempost' },
      });
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
        <img src={profileImage} className={styles.profileImage} />
        <div className={styles.nickname}>
          <p className={styles.nicknameText}>
            {nickname === undefined ? '닉네임' : nickname}
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
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="item1"
            className={styles.checkbox}
            checked={checkedItems.item1}
            onChange={handleCheckboxChange}
          />
          시간 약속을 잘 지켜요.
        </label>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="item2"
            className={styles.checkbox}
            checked={checkedItems.item2}
            onChange={handleCheckboxChange}
          />
          친절하고 매너가 좋아요.
        </label>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="item3"
            className={styles.checkbox}
            checked={checkedItems.item3}
            onChange={handleCheckboxChange}
          />
          응답이 빨라요.
        </label>
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
