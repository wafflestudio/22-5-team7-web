/*
  LandingPage에서 로그인하기를 눌렀을 때 연결되는 페이지.
*/
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import leftArrow from '../assets/leftarrow.svg';
import Loader from '../components/Loader';
import styles from '../css/LoginPage.module.css';
import type { ErrorResponseType, SigninResponse } from '../typings/user';

const LoginPage = () => {
  const [id, setId] = useState<string>('');
  const [pw, setPw] = useState<string>('');
  const [isIdError, setIsIdError] = useState(false);
  const [isPwError, setIsPwError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = async () => {
    try {
      const response = await fetch('/api/auth/sign/in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: id,
          password: pw,
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as ErrorResponseType;
        throw new Error(`로그인 실패: ${errorData.error}`);
      }
      const data = (await response.json()) as SigninResponse;
      console.info('로그인 성공!');
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('nickname', data.user.nickname);

      if (data.user.location === 'void') {
        void navigate('/location');
      } else {
        localStorage.setItem('location', data.user.location);
        void navigate('/main');
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === '로그인 실패: User not found') setIsIdError(true);
        if (error.message === '로그인 실패: Invalid password')
          setIsPwError(true);
      }
      console.error('error: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.main}>
      <NavLink to="/">
        <img src={leftArrow} className={styles.leftArrow} />
      </NavLink>
      <div className={styles.content}>
        <p className={styles.mainText}>
          안녕하세요!
          <br />
          아이디와 비밀번호로 로그인해주세요.
        </p>
        <p className={styles.subText}>
          토이프로젝트 7조의 당근은 아이디와 비밀번호로 로그인해요. 아이디와
          비밀번호는 <span style={{ fontWeight: 'bold' }}>안전하게 보관</span>
          되며 어디에도 공개되지 않아요.
        </p>
        <input
          className={styles.inputBox}
          type="text"
          placeholder="아이디를 입력하세요"
          value={id}
          onChange={(e) => {
            setId(e.target.value);
            setIsIdError(false);
          }}
        ></input>
        {isIdError && (
          <p className={styles.alertText}>사용자를 찾을 수 없습니다.</p>
        )}
        <input
          className={styles.inputBox}
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={pw}
          onChange={(e) => {
            setPw(e.target.value);
            setIsPwError(false);
          }}
        ></input>
        {isPwError && (
          <p className={styles.alertText}>잘못된 비밀번호입니다.</p>
        )}
        <button
          onClick={() => {
            handleLoginClick().catch(() => {
              console.error('error');
            });
          }}
          className={styles.loginButton}
        >
          로그인
        </button>
        <div className={styles.helpBox}>
          <span className={styles.helpText}>아이디 찾기</span>
          <span className={styles.helpTextSplicer}>|</span>
          <span className={styles.helpText}>비밀번호 재설정</span>
        </div>
      </div>
      {isLoading && (
        <div className={styles.loadingBox}>
          <Loader marginTop="45vh" />
        </div>
      )}
    </div>
  );
};

export default LoginPage;
