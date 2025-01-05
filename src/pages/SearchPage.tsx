/*
  MainPage에서 검색 버튼을 눌렀을 때 연결되는 페이지.
  검색창이 메인이고, 추천 검색은 필요 없음.
  필요하면 최근 검색은 localstorage에 저장해서 사용하는 방식으로
*/
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import clockIcon from '../assets/clock_gray.svg';
import leftArrow from '../assets/leftarrow.svg';
import styles from '../css/SearchPage.module.css';

const tempLocation = '대학동';

type stateProps = {
  focusSearchBar: boolean;
  query: string;
};

const SearchPage = () => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { focusSearchBar = false, query: initialQuery = '' } =
    location.state === null ? {} : (location.state as stateProps);

  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    const storedSearches = localStorage.getItem('recentSearches');
    if (storedSearches !== null)
      setRecentSearches(JSON.parse(storedSearches) as string[]);
  }, []);

  useEffect(() => {
    if (focusSearchBar && searchInputRef.current !== null) {
      searchInputRef.current.focus();
    }
  }, [focusSearchBar]);

  const saveRecentSearch = (searchQuery: string) => {
    const updatedSearches = [
      searchQuery,
      ...recentSearches.filter((q) => q !== searchQuery),
    ].slice(0, 10);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    setRecentSearches(updatedSearches);
  };

  const handleSearch = () => {
    if (query.trim() !== '') {
      saveRecentSearch(query.trim());
      void navigate(`/search/${encodeURIComponent(query.trim())}`);
    }
  };

  const removeRecentSearch = (searchQuery: string) => {
    const updatedSearches = recentSearches.filter((q) => q !== searchQuery);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    setRecentSearches(updatedSearches);
  };

  const handleRecentSearchClick = (searchQuery: string) => {
    void navigate(`/search/${encodeURIComponent(searchQuery)}`);
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
          ref={searchInputRef}
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
      <div className={styles.recentSearches}>
        <p className={styles.recentSearch}>최근 검색</p>
        {recentSearches.map((search, index) => (
          <div key={index} className={styles.recentSearchItem}>
            <img src={clockIcon} style={{ height: '20px' }} />
            <p
              className={styles.recentSearchText}
              onClick={() => {
                handleRecentSearchClick(search);
              }}
            >
              {search}
            </p>
            <button
              className={styles.removeButton}
              onClick={() => {
                removeRecentSearch(search);
              }}
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
