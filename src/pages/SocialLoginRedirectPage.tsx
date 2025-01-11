/*
  소셜 로그인 시 redirect 되는 페이지
*/
import { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import leftArrow from '../assets/leftarrow.svg';
import styles from '../css/SocialLoginRedirectPage.module.css';

const SocialLoginRedirectPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    const token = new URLSearchParams(hash.replace('#', '?')).get('token');

    console.info(token);
    if (token !== null) {
      localStorage.setItem('token', token);
      console.info('로그인 성공!');
      void navigate('/main');
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
