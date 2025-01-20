/* 
  내 동네생활 글 페이지. 저장한 글 기능은 공감한 글로 대체함.
*/
import { useCallback, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import leftArrow from '../assets/leftarrow.svg';
import CommunityPostItem from '../components/CommunityPostItem';
import Loader from '../components/Loader';
import styles from '../css/MyCommunityPosts.module.css';
import type { CommunityPostItemType } from '../typings/communityPost';

const tabs = ['작성한 글', '댓글단 글', '공감한 글'];

const MyCommunityPosts = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [underlineLeft, setUnderlineLeft] = useState(0);
  const [myPosts, setMyPosts] = useState<CommunityPostItemType[]>([]);
  const [myComments, setMyComments] = useState<CommunityPostItemType[]>([]);
  const [myLikes, setMyLikes] = useState<CommunityPostItemType[]>([]);
  const [lastPostId, setLastPostId] = useState(2100000);
  const [lastCommentId, setLastCommentId] = useState(2100000);
  const [lastLikeId, setLastLikeId] = useState(2100000);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const handleTabClick = (index: number) => {
    const percentage = (index / tabs.length) * 100;
    setActiveTabIndex(index);
    setUnderlineLeft(percentage);
  };

  const fetchPosts = useCallback(
    async (tab: 'myposts' | 'mycomments' | 'mylikes') => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (token === null) throw new Error('토큰이 없습니다.');

        let url = '';
        if (tab === 'myposts') url = `/api/myfeed/my?feedId=${lastPostId}`;
        else if (tab === 'mycomments')
          url = `/api/myfeed/comment?feedId=${lastCommentId}`;
        else url = `/api/myfeed/like?feedId=${lastLikeId}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch ${tab}: ${response.statusText}`);
        }

        const data = (await response.json()) as CommunityPostItemType[];
        if (tab === 'myposts') {
          setMyPosts((prev) => [...prev, ...data]);
        } else if (tab === 'mycomments') {
          setMyComments((prev) => [...prev, ...data]);
        } else {
          setMyLikes((prev) => [...prev, ...data]);
        }
        setError(null);
      } catch (err) {
        console.error(err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    },
    [lastPostId, lastCommentId, lastLikeId],
  );

  useEffect(() => {
    void fetchPosts('myposts');
    void fetchPosts('mycomments');
    void fetchPosts('mylikes');
  }, [fetchPosts]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200
      ) {
        if (activeTabIndex === 0) {
          setLastPostId(myPosts[myPosts.length - 1]?.id ?? 2100000);
        } else if (activeTabIndex === 1) {
          setLastCommentId(myComments[myComments.length - 1]?.id ?? 2100000);
        } else if (activeTabIndex === 2) {
          setLastLikeId(myLikes[myLikes.length - 1]?.id ?? 2100000);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeTabIndex, myComments, myLikes, myPosts]);

  return (
    <div className={styles.main}>
      <div className={styles.upperBar}>
        <NavLink to="/mypage">
          <img src={leftArrow} className={styles.upperIcon} />
        </NavLink>
        <p className={styles.pageTitle}>동네생활 활동</p>
      </div>
      <div className={styles.tab}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={
              activeTabIndex === index
                ? styles.activeTabButton
                : styles.inactiveTabButton
            }
            onClick={() => {
              handleTabClick(index);
            }}
          >
            {tab}
          </button>
        ))}
        <div
          className={styles.underline}
          style={{ left: `${underlineLeft}%` }}
        />
      </div>
      {loading && <Loader marginTop="40vh" />}
      {error !== null ? (
        <p>{error}</p>
      ) : (
        <div className={styles.contentBox}>
          {activeTabIndex === 0 &&
            (myPosts.length === 0 ? (
              <div className={styles.noContentBox}>
                <p>첫 동네 이야기를 이웃에게 알려주세요.</p>
                <NavLink to="/community/post" className={styles.navButton}>
                  동네생활 글쓰기
                </NavLink>
              </div>
            ) : (
              myPosts.map((post) => (
                <CommunityPostItem key={post.id} CommunityPostInfo={post} />
              ))
            ))}
          {activeTabIndex === 1 &&
            (myComments.length === 0 ? (
              <div className={styles.noContentBox}>
                <p>댓글단 글을 확인할 수 있어요.</p>
                <NavLink to="/community" className={styles.navButton}>
                  동네생활 둘러보기
                </NavLink>
              </div>
            ) : (
              myComments.map((post) => (
                <CommunityPostItem key={post.id} CommunityPostInfo={post} />
              ))
            ))}
          {activeTabIndex === 2 &&
            (myLikes.length === 0 ? (
              <div className={styles.noContentBox}>
                <p>공감한 글이 없습니다. 글을 공감해보세요.</p>
                <NavLink to="/community" className={styles.navButton}>
                  동네생활 둘러보기
                </NavLink>
              </div>
            ) : (
              myLikes.map((post) => (
                <CommunityPostItem key={post.id} CommunityPostInfo={post} />
              ))
            ))}
        </div>
      )}
    </div>
  );
};

export default MyCommunityPosts;
