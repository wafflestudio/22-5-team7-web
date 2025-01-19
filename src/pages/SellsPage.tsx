/*
  다른 이용자들의 판매 물품 페이지.
*/

import { useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';

import leftArrow from '../assets/leftarrow.svg';
import placeHolder from '../assets/placeholder_gray.png';
import styles from '../css/SellsPage.module.css';

const SellsPage = () => {
  const [activeTab, setActiveTab] = useState<'selling' | 'sold'>('selling');
  const sellingItems: string[] = [];
  const soldItems = ['Item A', 'Item B'];
  const { nickname } = useParams<{ nickname: string }>();
  const navigate = useNavigate();

  if (nickname === undefined) {
    throw new Error('nickname is undefined');
  }

  return (
    <div className={styles.main}>
      <div className={styles.upperBar}>
        <img
          src={leftArrow}
          className={styles.upperIcon}
          onClick={() => {
            void navigate(-1);
          }}
        />
        <p className={styles.pageTitle}>이룸이님 판매물품</p>
      </div>
      <div className={styles.profileBlock}>
        <div className={styles.profileBlockLeft}>
          <p className={styles.profileBlockText}>이룸이님 판매물품</p>
          <div className={styles.profileBlockButtons}>
            <NavLink to="/temp" className={styles.orangeButton}>
              모아보기
            </NavLink>
            <NavLink to="/temp" className={styles.buyMoreButton}>
              한 번에 거래하기
            </NavLink>
          </div>
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

export default SellsPage;
