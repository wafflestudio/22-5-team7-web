/* 
  당근마켓 앱의 '홈' 에 해당하는 메인 페이지.
*/
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import bellIcon from '../assets/upperbar-bell.svg';
import menuIcon from '../assets/upperbar-menu.svg';
import searchIcon from '../assets/upperbar-search.svg';
import Item from '../components/Item';
import UpperBar from '../components/UpperBar';
import styles from '../css/MainPage.module.css';
import type { Item as ItemType } from '../typings/item'; // 인터페이스 불러오기
import type { toolBarInfo } from '../typings/toolBar';

const mainPageToolBarInfo: toolBarInfo = {
  path: '/main',
  mainText: '대학동',
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
  const [lastId, setLastId] = useState(2100000);

  const handlePostClick = () => {
    void navigate('/itempost');
  };

  useEffect(() => {
    const fetchItemList = async () => {
      try {
        const response = await fetch(
          `http://localhost:5173/api/home?articleId=${lastId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error('서버에서 데이터를 받아오지 못했습니다.');
        }

        const data: ItemType[] = (await response.json()) as ItemType[];
        console.info(data);
        setItems((prevItems) => [...prevItems, ...data]);
      } catch (error) {
        console.error(error);
      }
    };

    void fetchItemList();
  }, [lastId]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 500
      ) {
        setLastId((prevLastId) => prevLastId - 10); // lastId 업데이트
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={styles.main}>
      <UpperBar toolBarInfo={mainPageToolBarInfo} />
      <button className={styles.postbutton} onClick={handlePostClick}>
        + 글쓰기
      </button>
      <div>
        {items.map((item, index) => (
          <Item
            key={index}
            title={item.title}
            price={item.price}
            status={item.status}
            location={item.location}
            createdAt={item.createdAt}
            likeCount={item.likeCount}
          />
        ))}
      </div>
    </div>
  );
};

export default MainPage;
