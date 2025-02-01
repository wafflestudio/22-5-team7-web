/*
  검색 결과를 보여주는 페이지.
  중고거래 / 동네생활 / 경매 선택 가능한 upper navbar가 필요하고
  선택한 분야에 따라 다른 component들을 띄워야 함
*/

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import leftArrow from '../assets/leftarrow.svg';
import styles from '../css/SearchResultPage.module.css';
//import Item from '../components/Item';
import type { PreviewItem as ItemType } from '../typings/item';

const tempLocation = '대학동';

const SearchResultPage = () => {
  const [activeTab, setActiveTab] = useState<'items' | 'posts'>('items');
  const { query } = useParams<{ query: string }>();
  const [items, setItems] = useState<ItemType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  if (query === undefined) throw new Error('query is undefined');

  const handleSearch = (newQuery: string) => {
    if (newQuery.trim() !== '')
      void navigate(`/search/${encodeURIComponent(newQuery.trim())}`);
  };

  useEffect(() => {
    const fetchItemList = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (token === null) {
          throw new Error('토큰이 없습니다.');
        }
        const response = await fetch(
          `/api/item/search/{articleId}`,
          //`https://b866fe16-c4c5-4989-bdc9-5a783448ec03.mock.pstmn.io/api/home?articleId=${lastId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error('서버에서 데이터를 받아오지 못했습니다.');
        }

        const data: ItemType[] = (await response.json()) as ItemType[];
        setItems((prevItems) => [...prevItems, ...data]);
        console.info(data);
        console.info(items);
        console.info(loading);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    void fetchItemList();
  }, [items, loading]);

  return (
    <div className={styles.main}>
      <div className={styles.upperBar}>
        <img
          src={leftArrow}
          className={styles.upperIcon}
          onClick={() => void navigate(-2)}
        />
        <input
          type="search"
          className={styles.searchBar}
          placeholder={`${tempLocation} 근처에서 검색`}
          defaultValue={query}
          onClick={() =>
            void navigate('/search', {
              state: { focusSearchBar: true, query },
            })
          }
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value.trim() !== '')
              handleSearch(e.currentTarget.value);
          }}
        />
        <p className={styles.closeButton} onClick={() => void navigate(-1)}>
          닫기
        </p>
      </div>
      <div className={styles.tab}>
        <button
          className={
            activeTab === 'items'
              ? styles.activeTabButton
              : styles.inactiveTabButton
          }
          onClick={() => {
            setActiveTab('items');
          }}
        >
          중고거래
        </button>
        <button
          className={
            activeTab === 'posts'
              ? styles.activeTabButton
              : styles.inactiveTabButton
          }
          onClick={() => {
            setActiveTab('posts');
          }}
        >
          동네생활
        </button>
      </div>
      <div className={styles.contentBox}>
        {activeTab === 'items' ? <div></div> : <div></div>}
      </div>
    </div>
  );
};

export default SearchResultPage;
