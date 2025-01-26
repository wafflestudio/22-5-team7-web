/*
    회원가입 페이지
*/
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import leftArrow from '../assets/leftarrow.svg';
import Loader from '../components/Loader';
import styles from '../css/RegisterPage.module.css';
import type { ErrorResponseType, SignupUser } from '../typings/user';

const EmailRegex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const LoginPage = () => {
  const [nickname, setnickname] = useState<string>('');
  const [isNicknameValid, setIsNicknameValid] = useState(true);
  const [isNicknameConflict, setIsNicknameConflict] = useState(false);
  const [id, setId] = useState<string>('');
  const [isIdValid, setIsIdValid] = useState(true);
  const [isIdConflict, setIsIdConflict] = useState(false);
  const [pw, setPw] = useState<string>('');
  const [isPwValid, setIsPwValid] = useState(true);
  const [email, setEmail] = useState<string>('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handlenicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setnickname(e.target.value);
    setIsNicknameValid(
      e.target.value.length >= 2 && e.target.value.length <= 10,
    );
    setIsNicknameConflict(false);
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
    setIsIdValid(e.target.value.length >= 5 && e.target.value.length <= 20);
    setIsIdConflict(false);
  };

  const handlePwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPw(e.target.value);
    setIsPwValid(e.target.value.length >= 8 && e.target.value.length <= 16);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setIsEmailValid(EmailRegex.test(e.target.value));
  };

  const handleRegisterClick = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/sign/up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: nickname,
          userId: id,
          password: pw,
          email: email,
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as ErrorResponseType;
        throw new Error(`회원가입 실패: ${errorData.error}`);
      }
      const data = (await response.json()) as SignupUser;
      console.info('회원가입 성공!', data);
      void navigate('/');
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === '회원가입 실패: UserId conflict')
          setIsIdConflict(true);
        if (error.message === '회원가입 실패: Nickname conflict')
          setIsNicknameConflict(true);
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
          아이디와 비밀번호로 회원가입 합니다.
        </p>
        <p className={styles.subText}>
          토이프로젝트 7조의 당근은 아이디와 비밀번호로 로그인해요. 아이디와
          비밀번호는 <span style={{ fontWeight: 'bold' }}>안전하게 보관</span>
          되며 어디에도 공개되지 않아요.
        </p>
        <p>닉네임</p>
        <input
          className={styles.inputBox}
          type="nickname"
          placeholder="닉네임을 입력하세요"
          value={nickname}
          onChange={handlenicknameChange}
        ></input>
        {!isNicknameValid && (
          <p className={styles.alertText}>닉네임은 2~10 글자여야 해요.</p>
        )}
        {isNicknameConflict && (
          <p className={styles.alertText}>이 닉네임은 이미 사용중이에요.</p>
        )}
        <p>아이디</p>
        <input
          className={styles.inputBox}
          type="id"
          placeholder="아이디를 입력하세요"
          value={id}
          onChange={handleIdChange}
        ></input>
        {!isIdValid && (
          <p className={styles.alertText}>아이디는 5~20 글자여야 해요.</p>
        )}
        {isIdConflict && (
          <p className={styles.alertText}>이 아이디는 이미 사용중이에요.</p>
        )}
        <p>비밀번호</p>
        <input
          className={styles.inputBox}
          type="password"
          placeholder="비밀번호를 입력하세요"
          onChange={handlePwChange}
        ></input>
        {!isPwValid && (
          <p className={styles.alertText}>비밀번호는 8~16 글자여야 해요.</p>
        )}
        <p>이메일</p>
        <input
          className={styles.inputBox}
          type="email"
          placeholder="이메일은 아이디를 찾는데 활용돼요"
          onChange={handleEmailChange}
        ></input>
        {!isEmailValid && (
          <p className={styles.alertText}>올바른 이메일 형식을 작성해주세요.</p>
        )}
        <button
          onClick={() => {
            handleRegisterClick().catch(() => {
              console.error('error');
            });
          }}
          className={styles.registerButton}
        >
          회원가입
        </button>
        <div className={styles.helpBox}></div>
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
