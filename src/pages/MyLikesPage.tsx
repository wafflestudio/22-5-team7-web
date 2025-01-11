/*
  나의 관심목록 페이지.
*/
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import leftArrow from '../assets/leftarrow.svg';
import Item from '../components/Item';
import styles from '../css/MyLikesPage.module.css';
import type { PreviewItem } from '../typings/item';
import type { ErrorResponseType } from '../typings/user';

const MyLikesPage = () => {
  const [items, setItems] = useState<PreviewItem[]>([]);
  const [lastId, setLastId] = useState(2100000);

  useEffect(() => {
    const fetchMyLikesInfo = async () => {
      const token = localStorage.getItem('token');
      try {
        if (token === null) throw new Error('No token found');
        const response = await fetch(
          `http://localhost:5173/api/mypage/likes?articleId=${lastId}`,
          //`https://eab7f8a7-4889-4c27-8a86-0305c4e85524.mock.pstmn.io/api/home?articleId=${lastId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`, // token 어떻게 전달하는지 얘기해봐야 함
            },
          },
        );

        if (!response.ok) {
          const errorData = (await response.json()) as ErrorResponseType;
          throw new Error(`데이터 불러오기 실패: ${errorData.error}`);
        }

        const data = (await response.json()) as PreviewItem[];
        console.info(data);
        setItems((prevItems) => [...prevItems, ...data]);
      } catch (error) {
        console.error('error:', error);
      }
    };

    void fetchMyLikesInfo();
  }, [lastId]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 500
      ) {
        setLastId(items[items.length - 1]?.id ?? 2100000);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [items]);

  return (
    <div className={styles.main}>
      <div className={styles.upperBar}>
        <NavLink to="/mypage">
          <img src={leftArrow} className={styles.upperIcon} />
        </NavLink>
        <p className={styles.pageTitle}>관심목록</p>
      </div>
      <div>
        {items.map((item, index) => (
          <Item key={index} ItemInfo={item} />
        ))}
      </div>
    </div>
  );
};

export default MyLikesPage;
