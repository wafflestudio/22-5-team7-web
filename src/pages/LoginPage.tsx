/*
  LandingPage에서 로그인하기를 눌렀을 때 연결되는 페이지.
*/
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import leftArrow from '../assets/leftarrow.svg';
import styles from '../css/LoginPage.module.css';

const LoginPage = () => {
  const [id, setId] = useState<string>('');
  const [pw, setPw] = useState<string>('');
  const navigate = useNavigate();

  const handleLoginClick = () => {
    console.info(id); // Placeholder
    console.info(pw); // Placeholder
    void navigate('/main');
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
          }}
        ></input>
        <input
          className={styles.inputBox}
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={pw}
          onChange={(e) => {
            setPw(e.target.value);
          }}
        ></input>
        <button onClick={handleLoginClick} className={styles.loginButton}>
          로그인
        </button>
        <div className={styles.helpBox}>
          <span className={styles.helpText}>아이디 찾기</span>
          <span className={styles.helpTextSplicer}>|</span>
          <span className={styles.helpText}>비밀번호 재설정</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
