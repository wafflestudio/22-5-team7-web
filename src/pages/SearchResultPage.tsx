/*
  검색 결과를 보여주는 페이지.
  중고거래 / 동네생활 / 경매 선택 가능한 upper navbar가 필요하고
  선택한 분야에 따라 다른 component들을 띄워야 함
*/

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import leftArrow from '../assets/leftarrow.svg';
import CommunityPostItem from '../components/CommunityPostItem';
import Item from '../components/Item';
import styles from '../css/SearchResultPage.module.css';
import { tempCommunityPostInfo } from '../utils/mocks';

const tempLocation = '대학동';

const SearchResultPage = () => {
  const [activeTab, setActiveTab] = useState<'items' | 'posts'>('items');
  const { query } = useParams<{ query: string }>();
  const navigate = useNavigate();

  if (query === undefined) throw new Error('query is undefined');

  const handleSearch = (newQuery: string) => {
    if (newQuery.trim() !== '')
      void navigate(`/search/${encodeURIComponent(newQuery.trim())}`);
  };

  return (
    <div className={styles.main}>
      <div className={styles.upperBar}>
        <img
          src={leftArrow}
          className={styles.upperIcon}
          onClick={() => void navigate(-1)}
        />
        <input
          type="search"
          className={styles.searchBar}
          placeholder={`${tempLocation} 근처에서 검색`}
          defaultValue={query}
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
        {activeTab === 'items' ? (
          <div>
            <Item id="1" />
            <Item id="2" />
            <Item id="3" />
            <Item id="4" />
            <Item id="5" />
            <Item id="6" />
            <Item id="7" />
            <Item id="8" />
          </div>
        ) : (
          <div>
            <CommunityPostItem CommunityPostInfo={tempCommunityPostInfo} />
            <CommunityPostItem CommunityPostInfo={tempCommunityPostInfo} />
            <CommunityPostItem CommunityPostInfo={tempCommunityPostInfo} />
            <CommunityPostItem CommunityPostInfo={tempCommunityPostInfo} />
            <CommunityPostItem CommunityPostInfo={tempCommunityPostInfo} />
            <CommunityPostItem CommunityPostInfo={tempCommunityPostInfo} />
            <CommunityPostItem CommunityPostInfo={tempCommunityPostInfo} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultPage;
