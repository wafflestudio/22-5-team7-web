/*
  나의 판매내역 페이지.
  '판매중', '거래완료' 로만 구분함
*/
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import leftArrow from '../assets/leftarrow.svg';
import placeHolder from '../assets/placeholder_gray.png';
import styles from '../css/SellsPage.module.css';

const MySellsPage = () => {
  const [activeTab, setActiveTab] = useState<'selling' | 'sold'>('selling');
  const sellingItems: string[] = [];
  const soldItems = ['Item A', 'Item B'];

  return (
    <div className={styles.main}>
      <div className={styles.upperBar}>
        <NavLink to="/mypage">
          <img src={leftArrow} className={styles.upperIcon} />
        </NavLink>
        <p className={styles.pageTitle}>나의 판매내역</p>
      </div>
      <div className={styles.profileBlock}>
        <div className={styles.profileBlockLeft}>
          <p className={styles.profileBlockText}>나의 판매내역</p>
          <NavLink to="/itempost" className={styles.orangeButton}>
            글쓰기
          </NavLink>
        </div>
        <img src={placeHolder} className={styles.profilePic} />
      </div>
      <div className={styles.tab}>
        <button
          className={
            activeTab === 'selling'
              ? styles.activeTabButton
              : styles.inactiveTabButton
          }
          onClick={() => {
            setActiveTab('selling');
          }}
        >
          판매중 {sellingItems.length}
        </button>
        <button
          className={
            activeTab === 'sold'
              ? styles.activeTabButton
              : styles.inactiveTabButton
          }
          onClick={() => {
            setActiveTab('sold');
          }}
        >
          거래완료 {soldItems.length}
        </button>
      </div>
      <div className={styles.contentBox}>
        {activeTab === 'selling' && (
          <>
            {sellingItems.length === 0 ? (
              <p className={styles.noItemsText}>판매중인 게시글이 없어요.</p>
            ) : (
              <ul>
                {sellingItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          </>
        )}
        {activeTab === 'sold' && (
          <>
            {soldItems.length === 0 ? (
              <p className={styles.noItemsText}>거래완료된 게시글이 없어요.</p>
            ) : (
              <ul>
                {soldItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MySellsPage;
