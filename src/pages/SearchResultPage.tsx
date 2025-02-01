/*
  검색 결과를 보여주는 페이지.
  중고거래 / 동네생활 / 경매 선택 가능한 upper navbar가 필요하고
  선택한 분야에 따라 다른 component들을 띄워야 함
*/

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import leftArrow from '../assets/leftarrow.svg';
import CommunityPostItem from '../components/CommunityPostItem';
import Item from '../components/Item';
import Loader from '../components/Loader';
import styles from '../css/SearchResultPage.module.css';
import type { CommunityPostItemType } from '../typings/communityPost';
import type { PreviewItem } from '../typings/item';

const tempLocation = '대학동';

const SearchResultPage = () => {
  const [activeTab, setActiveTab] = useState<'items' | 'feed'>('items');
  const [underlineLeft, setUnderlineLeft] = useState(0);
  const [items, setItems] = useState<PreviewItem[]>([]);
  const [posts, setPosts] = useState<CommunityPostItemType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastItemId, setLastItemId] = useState(2100000);
  const [nextRequestItemId, setNextRequestItemId] = useState(2100000);
  const [lastCommunityId, setLastCommunityId] = useState(2100000);
  const [nextRequestCommunityId, setNextRequestCommunityId] = useState(2100000);
  const { query } = useParams<{ query: string }>();
  const navigate = useNavigate();

  if (query === undefined) throw new Error('query is undefined');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (token === null) throw new Error('토큰이 없습니다.');

        const itemResponse = await fetch(
          `/api/item/search/${lastItemId}?text=${query}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!itemResponse.ok) {
          throw new Error(`Failed to fetch items: ${itemResponse.statusText}`);
        }

        const itemData = (await itemResponse.json()) as PreviewItem[];
        console.info(itemData);
        setItems((prevPosts) => [...prevPosts, ...itemData]);
        if (itemData.length > 0) {
          const lastItem = itemData[itemData.length - 1];
          if (lastItem !== undefined) setNextRequestItemId(lastItem.id);
        }

        const communityResponse = await fetch(
          `/api/feed/search/${lastCommunityId}?text=${query}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        if (!communityResponse.ok) {
          throw new Error(
            `Failed to fetch posts: ${communityResponse.statusText}`,
          );
        }
        const postData =
          (await communityResponse.json()) as CommunityPostItemType[];
        console.info(postData);
        setPosts((prevPosts) => [...prevPosts, ...postData]);
        if (postData.length > 0) {
          const lastPost = postData[postData.length - 1];
          if (lastPost !== undefined) setNextRequestCommunityId(lastPost.id);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    void fetchPosts();
  }, [query, lastItemId, lastCommunityId]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200
      ) {
        if (activeTab === 'items') {
          setLastItemId(nextRequestItemId);
        } else {
          setLastCommunityId(nextRequestCommunityId);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeTab, nextRequestCommunityId, nextRequestItemId]);

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
            setUnderlineLeft(0);
          }}
        >
          중고거래
        </button>
        <button
          className={
            activeTab === 'feed'
              ? styles.activeTabButton
              : styles.inactiveTabButton
          }
          onClick={() => {
            setActiveTab('feed');
            setUnderlineLeft(50);
          }}
        >
          동네생활
        </button>
        <div
          className={styles.underline}
          style={{ left: `${underlineLeft}%` }}
        />
      </div>
      <div className={styles.contentBox}>
        {error !== null && <p>Error: {error}</p>}
        {error === null && !loading && activeTab === 'items' && (
          <>
            {items.length === 0 ? (
              <p className={styles.noResultsText}>검색결과가 없어요.</p>
            ) : (
              <div>
                {items.map((item, index) => (
                  <Item key={index} ItemInfo={item} />
                ))}
              </div>
            )}
          </>
        )}
        {error === null && !loading && activeTab === 'feed' && (
          <>
            {posts.length === 0 ? (
              <p className={styles.noResultsText}>검색결과가 없어요.</p>
            ) : (
              <div>
                {posts.map((post, index) => (
                  <CommunityPostItem key={index} CommunityPostInfo={post} />
                ))}
              </div>
            )}
          </>
        )}
        {loading && <Loader marginTop="0" />}
      </div>
    </div>
  );
};

export default SearchResultPage;
