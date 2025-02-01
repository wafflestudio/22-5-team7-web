/*
  '동네생활' 에 해당하는 페이지.
*/
import { useCallback, useEffect, useState } from 'react';
import { NavLink } from 'react-router';

import bellIcon from '../assets/upperbar-bell.svg';
import profileIcon from '../assets/upperbar-profile.svg';
import searchIcon from '../assets/upperbar-search.svg';
import CommunityPostItem from '../components/CommunityPostItem';
import Loader from '../components/Loader';
import UpperBar from '../components/UpperBar';
import styles from '../css/CommunityPage.module.css';
import type { CommunityPostItemType } from '../typings/communityPost';
import type { toolBarInfo } from '../typings/toolBar';

const communityPageToolBarInfoTemplate: toolBarInfo = {
  path: '/community',
  mainText: '',
  toolBarItems: [
    {
      pathTo: '/temp',
      alt: 'community profile',
      icon: profileIcon,
    },
    {
      pathTo: '/search',
      alt: 'search',
      icon: searchIcon,
    },
    {
      pathTo: '/temp',
      alt: 'notification',
      icon: bellIcon,
    },
  ],
};

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'popular'>('feed');
  const [posts, setPosts] = useState<CommunityPostItemType[]>([]);
  const [popularPosts, setPopularPosts] = useState<CommunityPostItemType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [communityPageToolBarInfo, setCommunityPageToolBarInfo] =
    useState<toolBarInfo>(communityPageToolBarInfoTemplate);
  const [lastId, setLastId] = useState(2100000);
  const [lastPopularId, setLastPopularId] = useState(2100000);
  const [nextRequestId, setNextRequestId] = useState(2100000);
  const [nextRequestPopularId, setNextRequestPopularId] = useState(2100000);

  useEffect(() => {
    const location = localStorage.getItem('location') ?? 'error';
    setCommunityPageToolBarInfo((prevInfo) => ({
      ...prevInfo,
      mainText: location,
    }));
  }, []);

  const fetchPosts = useCallback(
    async (tab: 'feed' | 'popular') => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (token === null) throw new Error('토큰이 없습니다.');

        let url = '';
        if (tab === 'feed') url = `/api/feed?feedId=${lastId}`;
        else url = `/api/feed/popular?feedId=${lastPopularId}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.statusText}`);
        }
        const data = (await response.json()) as CommunityPostItemType[];
        console.info(data);

        if (tab === 'feed') {
          setPosts((prevPosts) => [...prevPosts, ...data]);
          if (data.length > 0) {
            const lastPost = data[data.length - 1];
            if (lastPost !== undefined) setNextRequestId(lastPost.id);
          }
        } else {
          setPopularPosts((prevPosts) => [...prevPosts, ...data]);
          if (data.length > 0) {
            const lastPopularPost = data[data.length - 1];
            if (lastPopularPost !== undefined)
              setNextRequestPopularId(lastPopularPost.id);
          }
        }
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    },
    [lastId, lastPopularId],
  );

  useEffect(() => {
    void fetchPosts('feed');
    void fetchPosts('popular');
  }, [fetchPosts]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 100
      ) {
        if (activeTab === 'feed') {
          setLastId(nextRequestId);
        } else {
          setLastPopularId(nextRequestPopularId);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [posts, activeTab, nextRequestId, nextRequestPopularId]);

  return (
    <div>
      <UpperBar toolBarInfo={communityPageToolBarInfo} />
      <div className={styles.tab}>
        <button
          className={
            activeTab === 'feed'
              ? styles.activeTabButton
              : styles.inactiveTabButton
          }
          onClick={() => {
            setActiveTab('feed');
          }}
        >
          피드
        </button>
        <button
          className={
            activeTab === 'popular'
              ? styles.activeTabButton
              : styles.inactiveTabButton
          }
          onClick={() => {
            setActiveTab('popular');
          }}
        >
          인기
        </button>
      </div>
      <NavLink to="/community/post" className={styles.postbutton}>
        + 글쓰기
      </NavLink>
      <div className={styles.contentBox}>
        {error !== null ? (
          <p>Error: {error}</p>
        ) : (
          <div>
            {activeTab === 'feed' &&
              posts.map((post) => (
                <CommunityPostItem key={post.id} CommunityPostInfo={post} />
              ))}
            {activeTab === 'popular' &&
              popularPosts.map((post) => (
                <CommunityPostItem key={post.id} CommunityPostInfo={post} />
              ))}
          </div>
        )}
        {loading && <Loader marginTop="0" />}
      </div>
    </div>
  );
};

export default CommunityPage;
