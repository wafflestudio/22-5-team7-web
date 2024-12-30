/*
    회원가입 페이지
*/
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import leftArrow from '../assets/leftarrow.svg';
import styles from '../css/RegisterPage.module.css';

const LoginPage = () => {
  const [nickName, setNickName] = useState<string>('');
  const [id, setId] = useState<string>('');
  const [pw, setPw] = useState<string>('');
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    console.info(id); // Placeholder
    console.info(pw); // Placeholder
    void navigate('/');
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
          value={nickName}
          onChange={(e) => {
            setNickName(e.target.value);
          }}
        ></input>
        <p>아이디</p>
        <input
          className={styles.inputBox}
          type="id"
          placeholder="아이디를 입력하세요"
          value={id}
          onChange={(e) => {
            setId(e.target.value);
          }}
        ></input>
        <p>비밀번호</p>
        <input
          className={styles.inputBox}
          type="password"
          placeholder="비밀번호를 입력하세요"
          onChange={(e) => {
            setPw(e.target.value);
          }}
        ></input>
        <p>이메일</p>
        <input
          className={styles.inputBox}
          type="email"
          placeholder="이메일은 아이디를 찾는데 활용돼요"
          onChange={(e) => {
            setPw(e.target.value);
          }}
        ></input>
        <button onClick={handleRegisterClick} className={styles.registerButton}>
          회원가입
        </button>
        <div className={styles.helpBox}></div>
      </div>
    </div>
  );
};

export default LoginPage;
