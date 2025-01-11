/*
  나의 판매내역 페이지.
  '판매중', '거래완료' 로만 구분함
*/
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import leftArrow from '../assets/leftarrow.svg';
import placeHolder from '../assets/placeholder_gray.png';
import SellingItem from '../components/SellingItem';
import styles from '../css/SellsPage.module.css';
import type { PreviewItem } from '../typings/item';
import type { ErrorResponseType } from '../typings/user';

const MySellsPage = () => {
  const [activeTab, setActiveTab] = useState<'selling' | 'sold'>('selling');
  const [sellingItems, setSellingItems] = useState<PreviewItem[]>([]);
  const [soldItems, setSoldItems] = useState<PreviewItem[]>([]);
  const [lastId, setLastId] = useState(2100000);
  const [nextRequestId, setNextRequestId] = useState(2100000);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMySellsInfo = async () => {
      const token = localStorage.getItem('token');
      try {
        if (token === null) throw new Error('No token found');
        const response = await fetch(`/api/mypage/sells?articleId=${lastId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // token 어떻게 전달하는지 얘기해봐야 함
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
          (item) => item.status === '판매 중' || item.status === '예약 중',
        );
        const sold = data.filter((item) => item.status === '거래완료');

        setSellingItems((prevItems) => [...prevItems, ...selling]); // 판매 중 or 예약 중
        setSoldItems((prevItems) => [...prevItems, ...sold]); // 거래완료
      } catch (error) {
        console.error('error:', error);
      }
    };

    void fetchMySellsInfo();
  }, [lastId]);

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
        <p className={styles.pageTitle}>나의 판매내역</p>
      </div>
      <div className={styles.profileBlock}>
        <div className={styles.profileBlockLeft}>
          <p className={styles.profileBlockText}>나의 판매내역</p>
          <NavLink to="/itempost" className={styles.orangeButton}>
            글쓰기
          </NavLink>
        </div>
        <img src={placeHolder} className={styles.profilePic} />
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
          }}
        >
          거래완료 {soldItems.length}
        </button>
      </div>
      <div className={styles.contentBox}>
        {activeTab === 'selling' && (
          <>
            {sellingItems.length === 0 ? (
              <p className={styles.noItemsText}>판매중인 게시글이 없어요.</p>
            ) : (
              <div>
                {sellingItems.map((item, index) => (
                  <SellingItem key={index} ItemInfo={item} />
                ))}
              </div>
            )}
          </>
        )}
        {activeTab === 'sold' && (
          <>
            {soldItems.length === 0 ? (
              <p className={styles.noItemsText}>거래완료된 게시글이 없어요.</p>
            ) : (
              <div>
                {soldItems.map((item, index) => (
                  <SellingItem key={index} ItemInfo={item} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MySellsPage;
