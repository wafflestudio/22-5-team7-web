/*
  소셜 로그인 시 redirect 되는 페이지
*/
import { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import leftArrow from '../assets/leftarrow.svg';
import styles from '../css/SocialLoginRedirectPage.module.css';
import type { ProfileResponse } from '../typings/user';

const SocialLoginRedirectPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async (token: string) => {
      try {
        const response = await fetch('/api/mypage/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('사용자 정보를 가져오는 데 실패했습니다.');
        }

        const data = (await response.json()) as ProfileResponse;
        console.info('사용자 정보:', data);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('nickname', data.user.nickname);

        if (data.user.location === 'void') {
          void navigate('/location');
        } else {
          void navigate('/main');
        }
      } catch (error) {
        console.error('사용자 정보를 가져오는 데 실패했습니다:', error);
        void navigate('/');
      }
    };

    const getTokenAndFetchUserData = async () => {
      const hash = window.location.hash;
      const token = new URLSearchParams(hash.replace('#', '?')).get('token');

      console.info(token);
      if (token !== null) {
        localStorage.setItem('token', token);
        console.info('로그인 성공!');
        await fetchUserData(token);
      } else {
        console.info('token not found!');
        void navigate('/');
      }
    };

    void getTokenAndFetchUserData();
  }, [navigate]);

  return (
    <div className={styles.main}>
      <NavLink to="/">
        <img src={leftArrow} className={styles.leftArrow} />
      </NavLink>
      <p style={{ alignSelf: 'center' }}>리다이렉트 중...</p>
    </div>
  );
};

export default SocialLoginRedirectPage;
