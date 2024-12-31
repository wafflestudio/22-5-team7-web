/*
  나의 관심목록 페이지.
*/
import { NavLink } from 'react-router-dom';

import leftArrow from '../assets/leftarrow.svg';
import Item from '../components/Item';
import styles from '../css/MyLikesPage.module.css';

const MyLikesPage = () => {
  return (
    <div className={styles.main}>
      <div className={styles.upperBar}>
        <NavLink to="/mypage">
          <img src={leftArrow} className={styles.upperIcon} />
        </NavLink>
        <p className={styles.pageTitle}>관심목록</p>
      </div>
      <div>
        <Item />
        <Item />
      </div>
    </div>
  );
};

export default MyLikesPage;
