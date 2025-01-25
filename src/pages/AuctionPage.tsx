/*
  기존에 없던 새로운 기능인 '경매'에에 해당하는 페이지.
*/
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import bellIcon from '../assets/upperbar-bell.svg';
import profileIcon from '../assets/upperbar-profile.svg';
import searchIcon from '../assets/upperbar-search.svg';
import AuctionItem from '../components/AuctionItem';
import Loader from '../components/Loader';
import UpperBar from '../components/UpperBar';
import styles from '../css/AuctionPage.module.css';
import type { PreviewAuctionItem } from '../typings/auctionitem';
import type { toolBarInfo } from '../typings/toolBar';

const auctionPageToolBarInfo: toolBarInfo = {
  path: '/auctions',
  mainText: '경매',
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

const AuctionPage = () => {
  const [items, setItems] = useState<PreviewAuctionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastId, setLastId] = useState(2100000);
  const navigate = useNavigate();

  const handlePostClick = () => {
    void navigate('/auctions/post');
  };

  useEffect(() => {
    const fetchItemList = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (token === null) {
          throw new Error('토큰이 없습니다.');
        }
        const response = await fetch(
          `/api/auctions?auctionId=${lastId}`,
          //`https://b866fe16-c4c5-4989-bdc9-5a783448ec03.mock.pstmn.io/api/home?articleId=${lastId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error('서버에서 데이터를 받아오지 못했습니다.');
        }

        const data: PreviewAuctionItem[] =
          (await response.json()) as PreviewAuctionItem[];
        setItems((prevItems) => [...prevItems, ...data]);
        console.info(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    void fetchItemList();
  }, [lastId]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 100
      ) {
        setLastId(items[items.length - 1]?.id ?? 2100000); // lastId 업데이트
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [items]);
  return (
    <div className={styles.main}>
      <UpperBar toolBarInfo={auctionPageToolBarInfo} />
      <button className={styles.postbutton} onClick={handlePostClick}>
        + 글쓰기
      </button>
      <div className={styles.contentBox}>
        {items.map((item, index) => (
          <AuctionItem key={index} ItemInfo={item} />
        ))}
        {loading && <Loader marginTop="0" />}
      </div>
    </div>
  );
};

export default AuctionPage;
