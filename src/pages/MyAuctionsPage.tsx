/*
  나의 경매내역 페이지.
  '판매중', '거래완료' 로만 구분함
*/
import { useCallback, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import leftArrow from '../assets/leftarrow.svg';
import placeHolder from '../assets/placeholder_gray.png';
//import AuctionItem from '../components/AuctionItem';
import Loader from '../components/Loader';
import ParticipatingAuctionItem from '../components/ParticipatingAuctionItem';
import SellingItem from '../components/SellingItem';
import styles from '../css/SellsPage.module.css';
import type { PreviewAuctionItem } from '../typings/auctionitem';
import type { PreviewItem } from '../typings/item';
import type { ErrorResponseType, MyPageResponse } from '../typings/user';

const MyAuctionsPage = () => {
  const [activeTab, setActiveTab] = useState<'selling' | 'participating'>(
    'selling',
  );
  const [underlineLeft, setUnderlineLeft] = useState(0);
  const [sellingItems, setSellingItems] = useState<PreviewItem[]>([]);
  const [soldItems, setSoldItems] = useState<PreviewItem[]>([]);
  const [lastId, setLastId] = useState(2100000);
  const [nextRequestId, setNextRequestId] = useState(2100000);
  const [myPageInfo, setMyPageInfo] = useState<MyPageResponse>();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const dummyPreviewAuctionItem: PreviewAuctionItem = {
    id: 1,
    title: '예시 경매 아이템',
    startingPrice: 10000,
    currentPrice: 15000,
    status: 1,
    location: '서울특별시',
    imagePresignedUrl: 'https://example.com/image.jpg',
    endTime: '2025-02-03T23:59:59Z',
    likeCount: 10,
  };

  const fetchMySellsInfo = useCallback(
    async (fetchType: 'both' | 'selling' | 'participating') => {
      const token = localStorage.getItem('token');
      try {
        if (token === null) throw new Error('No token found');
        const response = await fetch(`/api/mypage/auctions/${lastId}}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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

        if (fetchType === 'both' || fetchType === 'selling') {
          setSellingItems((prevItems) => [...prevItems, ...selling]); // 판매 중 or 예약 중
        }
        if (fetchType === 'both' || fetchType === 'participating') {
          setSoldItems((prevItems) => [...prevItems, ...sold]); // 거래완료
        }
      } catch (error) {
        console.error('error:', error);
      }
    },
    [lastId],
  );

  useEffect(() => {
    void fetchMySellsInfo('both');
  }, [fetchMySellsInfo]);

  useEffect(() => {
    const fetchMyPageInfo = async () => {
      const token = localStorage.getItem('token');
      try {
        setIsLoading(true);
        if (token === null) throw new Error('No token found');
        const response = await fetch('/api/mypage', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = (await response.json()) as ErrorResponseType;
          throw new Error(`데이터 불러오기 실패: ${errorData.error}`);
        }

        const data = (await response.json()) as MyPageResponse;
        setMyPageInfo(data);
        console.info('url:', data.imagePresignedUrl);
      } catch (error) {
        console.error('error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchMyPageInfo();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200
      ) {
        setLastId(nextRequestId);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [nextRequestId]);

  const handleStatusChange = (updatedItem: PreviewItem) => {
    if (activeTab === 'selling') {
      //setSellingItems((prev) =>
      //  prev.filter((item) => item.id !== updatedItem.id),
      //);
      //setSoldItems([]);
      //void fetchMySellsInfo('sold');
      void navigate(`/sendreview/${updatedItem.id}`);
      void navigate(`/item/buyerselect/${updatedItem.id}`, {
        state: { from: 'mysells' },
      });
    } else {
      setSoldItems((prev) => prev.filter((item) => item.id !== updatedItem.id));
      setSellingItems([]);
      void fetchMySellsInfo('selling');
    }
  };

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
        <p className={styles.pageTitle}>나의 경매내역</p>
      </div>
      <div className={styles.profileBlock}>
        <div className={styles.profileBlockLeft}>
          <p className={styles.profileBlockText}>나의 경매내역</p>
          <NavLink to="/auctions/post" className={styles.orangeButton}>
            글쓰기
          </NavLink>
        </div>
        <img
          src={
            myPageInfo?.imagePresignedUrl === ''
              ? placeHolder
              : myPageInfo?.imagePresignedUrl
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
          내 경매 물건 {sellingItems.length}
        </button>
        <button
          className={
            activeTab === 'participating'
              ? styles.activeTabButton
              : styles.inactiveTabButton
          }
          onClick={() => {
            setActiveTab('participating');
            setUnderlineLeft(50);
          }}
        >
          참가 중인 경매 {soldItems.length}
        </button>
        <div
          className={styles.underline}
          style={{ left: `${underlineLeft}%` }}
        />
      </div>
      <div className={styles.contentBox}>
        {!isLoading && activeTab === 'selling' && (
          <>
            {sellingItems.length === 0 ? (
              <p className={styles.noItemsText}>경매 중인 물건이 없어요.</p>
            ) : (
              <div>
                {sellingItems.map((item, index) => (
                  <SellingItem
                    key={index}
                    ItemInfo={item}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            )}
          </>
        )}
        {!isLoading && activeTab === 'participating' && (
          <>
            <ParticipatingAuctionItem
              ItemInfo={dummyPreviewAuctionItem}
            ></ParticipatingAuctionItem>
            {soldItems.length === 0 ? (
              <p className={styles.noItemsText}>참가 중인 경매가 없어요.</p>
            ) : (
              <div>
                {soldItems.map((item, index) => (
                  <SellingItem
                    key={index}
                    ItemInfo={item}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            )}
          </>
        )}
        {isLoading && <Loader marginTop="0" />}
      </div>
    </div>
  );
};

export default MyAuctionsPage;
