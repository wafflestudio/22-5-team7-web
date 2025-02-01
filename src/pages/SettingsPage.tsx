/*
  앱 설정을 위한 페이지.
  로그아웃 기능만 구현할 예정
  나중에는 계정 삭제 기능도 추가할 예정
*/
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import leftArrow from '../assets/leftarrow.svg';
import styles from '../css/SettingsPage.module.css';

const SettingsPage = () => {
  const [isLogoutPopupVisible, setIsLogoutPopupVisible] = useState(false);
  const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setIsLogoutPopupVisible(true);
  };

  const handleDeleteClick = () => {
    setIsDeletePopupVisible(true);
  };

  const handleConfirmLogout = () => {
    setIsLogoutPopupVisible(false);
    localStorage.clear();
    void navigate('/');
    console.info('로그아웃 성공!');
  };

  const handleConfirmDelete = () => {
    void handleAuthDelete();
    setIsDeletePopupVisible(false);
    localStorage.clear();
    void navigate('/');
    console.info('계정 탈퇴에 성공했습니다.');
  };

  const handleClosePopup = () => {
    setIsLogoutPopupVisible(false);
    setIsDeletePopupVisible(false);
  };

  const handleAuthDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token === null) {
        throw new Error('토큰이 없습니다.');
      }
      const response = await fetch(`/api/auth/delete`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('삭제 요청에 실패했습니다.');
      }
    } catch (error) {
      console.error('삭제 중 에러 발생:', error);
    }
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
        <button className={styles.button} onClick={handleDeleteClick}>
          탈퇴하기
        </button>
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
      {isDeletePopupVisible && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <p className={styles.popupMainText}>탈퇴하기</p>
            <p className={styles.popupSubText}>
              정말 탈퇴하시겠습니까? 계정정보는 즉시 삭제되며 복구할 수
              없습니다.
            </p>
            <button
              className={styles.popupLogoutButton}
              onClick={handleConfirmDelete}
            >
              탈퇴하기
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
