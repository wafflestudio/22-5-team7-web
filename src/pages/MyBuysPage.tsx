/*
  나의 구매내역 페이지.
*/
import { NavLink } from 'react-router-dom';

import leftArrow from '../assets/leftarrow.svg';
import Item from '../components/Item';
import styles from '../css/MyBuysPage.module.css';

const MyBuysPage = () => {
  return (
    <div className={styles.main}>
      <div className={styles.upperBar}>
        <NavLink to="/mypage">
          <img src={leftArrow} className={styles.upperIcon} />
        </NavLink>
        <p className={styles.pageTitle}>나의 구매내역</p>
      </div>
      <div>
        <Item id="1" />
        <Item id="2" />
      </div>
    </div>
  );
};

export default MyBuysPage;
