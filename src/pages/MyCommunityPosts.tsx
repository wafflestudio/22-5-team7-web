/* 
  내 동네생활 글 페이지. 저장한 글 기능은 공감한 글로 대체함.
*/
import { useEffect, useState } from 'react';
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
  const [lastId, setLastId] = useState(2100000);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const handleTabClick = (index: number) => {
    const percentage = (index / tabs.length) * 100;
    setActiveTabIndex(index);
    setUnderlineLeft(percentage);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (token === null) throw new Error('토큰이 없습니다.');

        const response = await fetch(`/api/myfeed/my?feedId=${lastId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch my posts: ${response.statusText}`);
        }
        const data = (await response.json()) as CommunityPostItemType[];
        setMyPosts((prevMyPosts) => [...prevMyPosts, ...data]);
      } catch (err) {
        console.error(err);
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
        document.body.offsetHeight - 500
      ) {
        setLastId(myPosts[myPosts.length - 1]?.id ?? 2100000);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [myPosts]);

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
          {activeTabIndex === 1 && (
            <div className={styles.noContentBox}>
              <p>댓글단 글을 확인할 수 있어요.</p>
              <NavLink to="/community" className={styles.navButton}>
                동네생활 둘러보기
              </NavLink>
            </div>
          )}
          {activeTabIndex === 2 && (
            <div className={styles.noContentBox}>
              <p>
                다시보고 싶은 글을 공감하세요. <br /> 공감한 글은 나만 볼 수
                있어요.
              </p>
              <NavLink to="/community" className={styles.navButton}>
                동네생활 둘러보기
              </NavLink>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyCommunityPosts;
