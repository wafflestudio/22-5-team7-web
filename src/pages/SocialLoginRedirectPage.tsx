/*
  소셜 로그인 시 redirect 되는 페이지
*/
import { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import leftArrow from '../assets/leftarrow.svg';
import styles from '../css/SocialLoginRedirectPage.module.css';
import type { ErrorResponseType, ProfileResponse } from '../typings/user';

const SocialLoginRedirectPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    const token = new URLSearchParams(hash.replace('#', '?')).get('token');

    console.info(token);
    if (token !== null) {
      localStorage.setItem('token', token);

      const fetchMyProfileInfo = async () => {
        try {
          const response = await fetch('/api/mypage/profile', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            const errorData = (await response.json()) as ErrorResponseType;
            throw new Error(`데이터 불러오기 실패: ${errorData.error}`);
          }

          const data = (await response.json()) as ProfileResponse;
          console.info('프로필 데이터: ', data);

          if (data.user.location === '') {
            console.info('회원가입 성공! 지역 설정 페이지로 이동 중...');
            void navigate('/location');
          } else {
            console.info('로그인 성공!');
            void navigate('/main');
          }
        } catch (error) {
          console.error('error:', error);
        }
      };

      void fetchMyProfileInfo();
    } else {
      console.info('token not found!');
      void navigate('/');
    }
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
