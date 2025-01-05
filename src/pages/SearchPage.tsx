/*
  MainPage에서 검색 버튼을 눌렀을 때 연결되는 페이지.
  검색창이 메인이고, 추천 검색은 필요 없음.
  필요하면 최근 검색은 localstorage에 저장해서 사용하는 방식으로
*/
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import leftArrow from '../assets/leftarrow.svg';
import styles from '../css/SearchPage.module.css';

const tempLocation = '대학동';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim() !== '') void navigate(encodeURIComponent(query.trim()));
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
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
        />
        <p className={styles.closeButton} onClick={() => void navigate(-1)}>
          닫기
        </p>
      </div>
      <div></div>
    </div>
  );
};

export default SearchPage;
