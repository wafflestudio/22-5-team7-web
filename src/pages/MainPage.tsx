/* 
  당근마켓 앱의 '홈' 에 해당하는 메인 페이지.
*/
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import bellIcon from '../assets/upperbar-bell.svg';
import menuIcon from '../assets/upperbar-menu.svg';
import searchIcon from '../assets/upperbar-search.svg';
import Item from '../components/Item';
import Loader from '../components/Loader';
import UpperBar from '../components/UpperBar';
import styles from '../css/MainPage.module.css';
import type { PreviewItem as ItemType } from '../typings/item'; // 인터페이스 불러오기
import type { toolBarInfo } from '../typings/toolBar';

const mainPageToolBarInfoTemplate: toolBarInfo = {
  path: '/main',
  mainText: '',
  toolBarItems: [
    {
      pathTo: '/temp',
      alt: 'menu',
      icon: menuIcon,
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

const MainPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<ItemType[]>([]);
  const [mainPageToolBarInfo, setMainPageToolBarInfo] = useState<toolBarInfo>(
    mainPageToolBarInfoTemplate,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [lastId, setLastId] = useState(2100000);

  const handlePostClick = () => {
    void navigate('/itempost');
  };

  useEffect(() => {
    const location = localStorage.getItem('location') ?? 'error';
    setMainPageToolBarInfo((prevInfo) => ({
      ...prevInfo,
      mainText: location,
    }));
  }, []);

  useEffect(() => {
    const fetchItemList = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (token === null) {
          throw new Error('토큰이 없습니다.');
        }
        const response = await fetch(
          `/api/home?articleId=${lastId}`,
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

        const data: ItemType[] = (await response.json()) as ItemType[];
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
      <UpperBar toolBarInfo={mainPageToolBarInfo} />
      <button className={styles.postbutton} onClick={handlePostClick}>
        + 글쓰기
      </button>
      <div className={styles.contentBox}>
        {items.map((item, index) => (
          <Item key={index} ItemInfo={item} />
        ))}
        {loading && <Loader marginTop="0" />}
      </div>
    </div>
  );
};

export default MainPage;
