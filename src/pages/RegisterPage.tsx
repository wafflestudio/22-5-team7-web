/*
    회원가입 페이지
*/
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import leftArrow from '../assets/leftarrow.svg';
import styles from '../css/RegisterPage.module.css';
import type { ErrorResponseType, SignupUser } from '../typings/user';

const LoginPage = () => {
  const [nickName, setNickName] = useState<string>('');
  const [id, setId] = useState<string>('');
  const [pw, setPw] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [email, setEmail] = useState<string>('');
  const navigate = useNavigate();

  const handleRegisterClick = async () => {
    try {
      const response = await fetch('http://localhost:5173/auth/sign/up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: nickName,
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
      if (error instanceof Error) alert(error.message);
      console.error('error: ', error);
    }
  };

  const regions = [
    '보라매동',
    '은천동',
    '성현동',
    '중앙동',
    '청림동',
    '행운동',
    '청룡동',
    '낙성대동',
    '인헌동',
    '남현동',
    '신림동',
    '신사동',
    '조원동',
    '미성동',
    '난곡동',
    '난향동',
    '서원동',
    '신원동',
    '서림동',
    '삼성동',
    '대학동',
  ];

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
            setEmail(e.target.value);
          }}
        ></input>
        <p>지역 설정</p>
        <select
          className={styles.inputBox}
          value={selectedRegion}
          onChange={(e) => {
            setSelectedRegion(e.target.value);
          }}
        >
          <option value="">지역을 선택하세요</option>
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
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
    </div>
  );
};

export default LoginPage;
