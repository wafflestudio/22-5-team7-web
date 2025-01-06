/*
  '나의 당근' 에 해당하는 마이페이지.
  - 내 프로필
  - 관심목록
  - 판매내역
  - 구매내역
  - 내 프로필 / 받은 매너 평가
  - 내 프로필 / 받은 거래 후기
  - 앱 설정
  정도만 구현할 예정
*/
import { NavLink } from 'react-router-dom';

import heartIcon from '../assets/heart.svg';
import placeHolder from '../assets/placeholder_gray.png';
import receiptIcon from '../assets/receipt.svg';
import rightArrow from '../assets/rightarrow_gray.svg';
import shoppingBagIcon from '../assets/shoppingbag.svg';
import settingsIcon from '../assets/upperbar-settings.svg';
import UpperBar from '../components/UpperBar';
import styles from '../css/MyPage.module.css';
import type { toolBarInfo } from '../typings/toolBar';

const myPageToolBarInfo: toolBarInfo = {
  path: '/mypage',
  mainText: '나의 당근',
  toolBarItems: [
    {
      pathTo: 'settings',
      alt: 'settings',
      icon: settingsIcon,
    },
  ],
};

const MyPage = () => {
  return (
    <div className={styles.main}>
      <UpperBar toolBarInfo={myPageToolBarInfo} />
      <div className={styles.contentBox}>
        <div className={styles.block}>
          <NavLink to="profile" className={styles.profile}>
            <img src={placeHolder} className={styles.profilePic} />
            <p className={styles.nickName}>닉네임</p>
            <div className={styles.temperature}>47.5°C</div>
            <img src={rightArrow} className={styles.arrow} />
          </NavLink>
        </div>
        <div className={styles.block}>
          <p className={styles.blockTitle}>나의 거래</p>
          <NavLink to="likes" className={styles.blockLine}>
            <img src={heartIcon} className={styles.icon} />
            관심목록
            <img src={rightArrow} className={styles.arrow} />
          </NavLink>
          <NavLink to="sells" className={styles.blockLine}>
            <img src={receiptIcon} className={styles.icon} />
            판매내역
            <img src={rightArrow} className={styles.arrow} />
          </NavLink>
          <NavLink to="buys" className={styles.blockLine}>
            <img src={shoppingBagIcon} className={styles.icon} />
            구매내역
            <img src={rightArrow} className={styles.arrow} />
          </NavLink>
        </div>
        <div className={styles.block}>
          <p className={styles.blockTitle}>설정</p>
          <NavLink to="settings" className={styles.blockLine}>
            <img src={settingsIcon} className={styles.icon} />앱 설정
            <img src={rightArrow} className={styles.arrow} />
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
