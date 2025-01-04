/*
  '동네생활' 에 해당하는 페이지.
*/
import { useState } from 'react';

import bellIcon from '../assets/upperbar-bell.svg';
import profileIcon from '../assets/upperbar-profile.svg';
import searchIcon from '../assets/upperbar-search.svg';
import CommunityPostItem from '../components/CommunityPostItem';
import UpperBar from '../components/UpperBar';
import styles from '../css/CommunityPage.module.css';
import type { toolBarInfo } from '../typings/toolBar';

const tempCommunityPostInfo = {
  id: '1',
  tag: '동네친구',
  title: '저녁 같이 드실 분?',
  body: `저는 대학동 사는데 오늘 저녁 같이 드실 분 구해요~!!!
  햄버거 생각중이에요 ㅎㅎ`,
  user_id: 'hobak123',
  nickname: '단호한 호박',
  location: '대학동',
  time: '2024-12-21T10:00:00Z',
  views: 9,
  likes: 2,
  comments: [
    {
      nickname: '배고픈사람',
      location: '청룡동',
      time: '2024-12-28T12:00:00Z',
      likes: 2,
      body: '저요!',
    },
    {
      nickname: '댓글알바',
      location: '대학동',
      time: '2024-12-28T11:30:00Z',
      likes: 0,
      body: '전 바빠서 ㅜㅜ 아쉬워요',
    },
    {
      nickname: '아령하세연',
      location: '행운동',
      time: '2024-12-29T12:05:00Z',
      likes: 0,
      body: '맛있게 드세요~',
    },
    {
      nickname: '토이플젝 7조',
      location: '신림동',
      time: '2025-01-03T19:00:00Z',
      likes: 3,
      body: '이것은 테스트입니다 댓글을 길게 쓰면 어떻게 되는지 확인하려고 이렇게 쓴거에요',
    },
  ],
};

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
        <CommunityPostItem CommunityPostInfo={tempCommunityPostInfo} />
        <CommunityPostItem CommunityPostInfo={tempCommunityPostInfo} />
        <CommunityPostItem CommunityPostInfo={tempCommunityPostInfo} />
        <CommunityPostItem CommunityPostInfo={tempCommunityPostInfo} />
        <CommunityPostItem CommunityPostInfo={tempCommunityPostInfo} />
        <CommunityPostItem CommunityPostInfo={tempCommunityPostInfo} />
      </div>
    </div>
  );
};

export default CommunityPage;
