import './reset.css';

//import { useNavigate } from 'react-router-dom';
import DaangnLogo from './assets/DaangnMarket_Logo.png';
import GoogleLogo from './assets/GoogleLogo.png';
import KakaoLogo from './assets/Kakaosmall.png';
import styles from './css/LandingPage.module.css';

const LandingPage = () => {
  return (
    <div className={styles.main}>
      <div className={styles.logobox}>
        <img src={DaangnLogo} className={styles.wafflelogo} />
      </div>
      <div className={styles.toolbox}>
        <div className={styles.loginbox}>
          <button className={styles.loginbutton}>로그인</button>
          <h5 className={styles.registertext}>회원가입</h5>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
