/*
  처음 접속 시 보이는 당근마켓 랜딩페이지.
*/

import { NavLink } from 'react-router-dom';

import DaangnLogo from '../assets/Daangn_logo.png';
import GoogleLogo from '../assets/GoogleLogo.png';
import KakaoLogo from '../assets/Kakaosmall.png';
import NaverLogo from '../assets/NaverLogo.svg';
import styles from '../css/LandingPage.module.css';

const LandingPage = () => {
  return (
    <div className={styles.main}>
      <div className={styles.logobox}>
        <img src={DaangnLogo} className={styles.daangnLogo} />
        <p className={styles.daangnMainText}>당신 근처의 당근</p>
        <p className={styles.daangnSubText}>
          동네라서 가능한 모든 것<br />
          지금 내 동네를 선택하고 시작해보세요!
        </p>
      </div>
      <div className={styles.toolbox}>
        <div className={styles.loginbox}>
          <NavLink to="/login" className={styles.loginbutton}>
            로그인
          </NavLink>
          <NavLink to="/register" className={styles.registertext}>
            회원가입
          </NavLink>
        </div>
        <div className={styles.snsbox}>
          <div className={styles.snstextbox}>
            <hr className={styles.snstextline}></hr>
            <div className={styles.snstext}>SNS 계정으로 계속하기</div>
            <hr className={styles.snstextline}></hr>
          </div>
          <div className={styles.snslogobox}>
            <img className={styles.Kakaologo} src={KakaoLogo}></img>
            <div className={styles.Googlelogobox}>
              <img className={styles.Googlelogo} src={GoogleLogo}></img>
            </div>
            <img className={styles.Naverlogo} src={NaverLogo}></img>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
