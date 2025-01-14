/* 
  내 동네생활 글 페이지.
*/
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import leftArrow from '../assets/leftarrow.svg';
import styles from '../css/MyCommunityPosts.module.css';

const tabs = ['작성한 글', '댓글단 글', '저장한 글'];

const MyCommunityPosts = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [underlineLeft, setUnderlineLeft] = useState(0);

  const handleTabClick = (index: number) => {
    const percentage = (index / tabs.length) * 100;
    setActiveTabIndex(index);
    setUnderlineLeft(percentage);
  };

  return (
    <div className={styles.main}>
      <div className={styles.upperBar}>
        <NavLink to="/mypage">
          <img src={leftArrow} className={styles.upperIcon} />
        </NavLink>
        <p className={styles.pageTitle}>동네생활 활동</p>
      </div>
      <div className={styles.tab}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={
              activeTabIndex === index
                ? styles.activeTabButton
                : styles.inactiveTabButton
            }
            onClick={() => {
              handleTabClick(index);
            }}
          >
            {tab}
          </button>
        ))}
        <div
          className={styles.underline}
          style={{ left: `${underlineLeft}%` }}
        />
      </div>
      <div className={styles.contentBox}>
        {activeTabIndex === 0 && (
          <div className={styles.noContentBox}>
            <p>첫 동네 이야기를 이웃에게 알려주세요.</p>
            <NavLink to="/community/post" className={styles.navButton}>
              동네생활 글쓰기
            </NavLink>
          </div>
        )}
        {activeTabIndex === 1 && (
          <div className={styles.noContentBox}>
            <p>댓글단 글을 확인할 수 있어요.</p>
            <NavLink to="/community" className={styles.navButton}>
              동네생활 둘러보기
            </NavLink>
          </div>
        )}
        {activeTabIndex === 2 && (
          <div className={styles.noContentBox}>
            <p>
              다시보고 싶은 글을 저장하세요. <br /> 저장한 글은 나만 볼 수
              있어요.
            </p>
            <NavLink to="/community" className={styles.navButton}>
              동네생활 둘러보기
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCommunityPosts;
