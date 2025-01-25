/*
  다른 이용자들의 판매 물품 페이지.
*/

import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';

import leftArrow from '../assets/leftarrow.svg';
import placeHolder from '../assets/placeholder_gray.png';
import Item from '../components/Item';
import Loader from '../components/Loader';
import styles from '../css/SellsPage.module.css';
import type { PreviewItem } from '../typings/item';
import type { ErrorResponseType, ProfileResponse } from '../typings/user';

const SellsPage = () => {
  const [activeTab, setActiveTab] = useState<'selling' | 'sold'>('selling');
  const [underlineLeft, setUnderlineLeft] = useState(0);
  const [sellingItems, setSellingItems] = useState<PreviewItem[]>([]);
  const [soldItems, setSoldItems] = useState<PreviewItem[]>([]);
  const [lastId, setLastId] = useState(2100000);
  const [nextRequestId, setNextRequestId] = useState(2100000);
  const [profile, setProfile] = useState<ProfileResponse>();
  const [isLoading, setIsLoading] = useState(true);
  const { nickname } = useParams<{ nickname: string }>();
  const navigate = useNavigate();

  if (nickname === undefined) {
    throw new Error('nickname is undefined');
  }

  useEffect(() => {
    const fetchProfileInfo = async () => {
      const token = localStorage.getItem('token');
      try {
        setIsLoading(true);
        if (token === null) throw new Error('No token found');
        const response = await fetch(
          `/api/profile/${encodeURIComponent(nickname)}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          const errorData = (await response.json()) as ErrorResponseType;
          throw new Error(`데이터 불러오기 실패: ${errorData.error}`);
        }

        const data = (await response.json()) as ProfileResponse;
        setProfile(data);
      } catch (error) {
        console.error('error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchProfileInfo();
  }, [nickname]);

  useEffect(() => {
    const fetchSellsInfo = async () => {
      const token = localStorage.getItem('token');
      try {
        if (token === null) throw new Error('No token found');
        const response = await fetch(
          `/api/profile/${nickname}/sells?articleId=${lastId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          const errorData = (await response.json()) as ErrorResponseType;
          throw new Error(`데이터 불러오기 실패: ${errorData.error}`);
        }

        const data = (await response.json()) as PreviewItem[];
        console.info(data);

        setNextRequestId(data[data.length - 1]?.id ?? 0);

        const selling = data.filter(
          (item) => item.status === 0 || item.status === 1,
        );
        const sold = data.filter((item) => item.status === 2);

        setSellingItems((prevItems) => [...prevItems, ...selling]); // 판매 중 or 예약 중
        setSoldItems((prevItems) => [...prevItems, ...sold]); // 거래완료
      } catch (error) {
        console.error('error:', error);
      }
    };

    void fetchSellsInfo();
  }, [lastId, nickname]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 500
      ) {
        setLastId(nextRequestId);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [nextRequestId]);

  return (
    <div className={styles.main}>
      <div className={styles.upperBar}>
        <img
          src={leftArrow}
          className={styles.upperIcon}
          onClick={() => {
            void navigate(-1);
          }}
        />
        <p className={styles.pageTitle}>{nickname}님 판매물품</p>
      </div>
      <div className={styles.profileBlock}>
        <div className={styles.profileBlockLeft}>
          <p className={styles.profileBlockText}>{nickname}님 판매물품</p>
          <div className={styles.profileBlockButtons}>
            <NavLink to="/temp" className={styles.orangeButton}>
              모아보기
            </NavLink>
            <NavLink to="/temp" className={styles.buyMoreButton}>
              한 번에 거래하기
            </NavLink>
          </div>
        </div>
        <img
          src={
            profile?.user.imagePresignedUrl === ''
              ? placeHolder
              : profile?.user.imagePresignedUrl
          }
          className={styles.profilePic}
        />
      </div>
      <div className={styles.tab}>
        <button
          className={
            activeTab === 'selling'
              ? styles.activeTabButton
              : styles.inactiveTabButton
          }
          onClick={() => {
            setActiveTab('selling');
            setUnderlineLeft(0);
          }}
        >
          판매중 {sellingItems.length}
        </button>
        <button
          className={
            activeTab === 'sold'
              ? styles.activeTabButton
              : styles.inactiveTabButton
          }
          onClick={() => {
            setActiveTab('sold');
            setUnderlineLeft(50);
          }}
        >
          거래완료 {soldItems.length}
        </button>
        <div
          className={styles.underline}
          style={{ left: `${underlineLeft}%` }}
        />
      </div>
      <div className={styles.contentBox}>
        {isLoading && <Loader marginTop="0" />}
        {!isLoading && activeTab === 'selling' && (
          <>
            {sellingItems.length === 0 ? (
              <p className={styles.noItemsText}>판매중인 게시글이 없어요.</p>
            ) : (
              <div>
                {sellingItems.map((item, index) => (
                  <Item key={index} ItemInfo={item} />
                ))}
              </div>
            )}
          </>
        )}
        {!isLoading && activeTab === 'sold' && (
          <>
            {soldItems.length === 0 ? (
              <p className={styles.noItemsText}>거래완료된 게시글이 없어요.</p>
            ) : (
              <div>
                {soldItems.map((item, index) => (
                  <Item key={index} ItemInfo={item} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SellsPage;
