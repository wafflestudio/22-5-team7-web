/*
  '동네생활' 에 해당하는 페이지.
*/
import { useEffect, useState } from 'react';
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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [communityPageToolBarInfo, setCommunityPageToolBarInfo] =
    useState<toolBarInfo>(communityPageToolBarInfoTemplate);
  const [lastId, setLastId] = useState(2100000);
  const [nextRequestId, setNextRequestId] = useState(2100000);

  useEffect(() => {
    const location = localStorage.getItem('location') ?? 'error';
    setCommunityPageToolBarInfo((prevInfo) => ({
      ...prevInfo,
      mainText: location,
    }));
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (token === null) throw new Error('토큰이 없습니다.');

        const response = await fetch(`/api/feed?feedId=${lastId}`, {
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
        setPosts((prevPosts) => [...prevPosts, ...data]);
        if (data.length > 0) {
          const lastPost = data[data.length - 1];
          if (lastPost !== undefined) setNextRequestId(lastPost.id);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    void fetchPosts();
  }, [lastId]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 100
      ) {
        setLastId(nextRequestId);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [posts, nextRequestId]);

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
          posts
            .sort((a, b) => {
              if (activeTab === 'feed')
                return a.createdAt > b.createdAt
                  ? -1
                  : a.createdAt < b.createdAt
                    ? 1
                    : 0;
              return b.likeCount - a.likeCount;
            })
            .map((post) => (
              <CommunityPostItem key={post.id} CommunityPostInfo={post} />
            ))
        )}
        {loading && <Loader marginTop="0" />}
      </div>
    </div>
  );
};

export default CommunityPage;
