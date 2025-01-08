/*
  나의 구매내역 페이지.
*/
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import leftArrow from '../assets/leftarrow.svg';
import Item from '../components/Item';
import styles from '../css/MyBuysPage.module.css';
import type { PreviewItem } from '../typings/item';
import type { ErrorResponseType } from '../typings/user';

const MyBuysPage = () => {
  const [items, setItems] = useState<PreviewItem[]>([]);

  useEffect(() => {
    const fetchMyBuysInfo = async () => {
      const token = localStorage.getItem('token');
      try {
        if (token === null) throw new Error('No token found');
        const response = await fetch('http://localhost:5173/api/mypage/likes', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // token 어떻게 전달하는지 얘기해봐야 함
          },
        });

        if (!response.ok) {
          const errorData = (await response.json()) as ErrorResponseType;
          throw new Error(`데이터 불러오기 실패: ${errorData.error}`);
        }

        const data = (await response.json()) as PreviewItem[];
        console.info(data);
        setItems(data);
      } catch (error) {
        console.error('error:', error);
      }
    };

    void fetchMyBuysInfo();
  }, []);
  return (
    <div className={styles.main}>
      <div className={styles.upperBar}>
        <NavLink to="/mypage">
          <img src={leftArrow} className={styles.upperIcon} />
        </NavLink>
        <p className={styles.pageTitle}>나의 구매내역</p>
      </div>
      <div>
        {items.map((item, index) => (
          <Item key={index} ItemInfo={item} />
        ))}
      </div>
    </div>
  );
};

export default MyBuysPage;
