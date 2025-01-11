/*
  앱 설정을 위한 페이지.
  로그아웃 기능만 구현할 예정정
*/
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import leftArrow from '../assets/leftarrow.svg';
import styles from '../css/SettingsPage.module.css';

const SettingsPage = () => {
  const [isLogoutPopupVisible, setIsLogoutPopupVisible] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setIsLogoutPopupVisible(true);
  };

  const handleConfirmLogout = () => {
    setIsLogoutPopupVisible(false);
    localStorage.clear();
    void navigate('/');
    console.info('로그아웃 성공!');
  };

  const handleClosePopup = () => {
    setIsLogoutPopupVisible(false);
  };

  return (
    <div className={styles.main}>
      <div className={styles.upperBar}>
        <NavLink to="/mypage">
          <img src={leftArrow} className={styles.upperIcon} />
        </NavLink>
        <p className={styles.pageTitle}>설정</p>
      </div>
      <div className={styles.block}>
        <p className={styles.blockTitle}>기타</p>
        <button className={styles.button} onClick={handleLogoutClick}>
          로그아웃
        </button>
        <button className={styles.button}>탈퇴하기</button>
      </div>
      {isLogoutPopupVisible && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <p className={styles.popupMainText}>로그아웃</p>
            <p className={styles.popupSubText}>정말 로그아웃할까요?</p>
            <button
              className={styles.popupLogoutButton}
              onClick={handleConfirmLogout}
            >
              로그아웃
            </button>
            <button
              className={styles.popupCloseButton}
              onClick={handleClosePopup}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
