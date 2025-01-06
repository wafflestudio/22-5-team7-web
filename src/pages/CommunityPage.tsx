/*
  '동네생활' 에 해당하는 페이지.
*/
import { useEffect, useState } from 'react';

import bellIcon from '../assets/upperbar-bell.svg';
import profileIcon from '../assets/upperbar-profile.svg';
import searchIcon from '../assets/upperbar-search.svg';
import CommunityPostItem from '../components/CommunityPostItem';
import Loader from '../components/Loader';
import UpperBar from '../components/UpperBar';
import styles from '../css/CommunityPage.module.css';
import type { CommunityPostItemType } from '../typings/communityPost';
import type { toolBarInfo } from '../typings/toolBar';

const communityPageToolBarInfo: toolBarInfo = {
  path: '/community',
  mainText: '대학동',
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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://eab7f8a7-4889-4c27-8a86-0305c4e85524.mock.pstmn.io/community',
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.statusText}`);
        }
        const data = (await response.json()) as CommunityPostItemType[];
        setPosts(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    void fetchPosts();
  }, []);

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
      <div className={styles.contentBox}>
        {loading ? (
          <Loader marginTop="40vh" />
        ) : error !== null ? (
          <p>Error: {error}</p>
        ) : (
          posts.map((post) => (
            <CommunityPostItem key={post.id} CommunityPostInfo={post} />
          ))
        )}
      </div>
    </div>
  );
};

export default CommunityPage;
