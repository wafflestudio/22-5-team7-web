/* 
  당근마켓 앱의 '홈' 에 해당하는 메인 페이지.
*/
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import bellIcon from '../assets/upperbar-bell.svg';
import menuIcon from '../assets/upperbar-menu.svg';
import searchIcon from '../assets/upperbar-search.svg';
import Item from '../components/Item';
import UpperBar from '../components/UpperBar';
import styles from '../css/MainPage.module.css';
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
  const handlePostClick = () => {
    void navigate('/itempost');
  };

  useEffect(() => {
    const fetchLectureList = async () => {
      try {
        const response = await fetch(`http://localhost:5173/api/test`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('서버에서 데이터를 받아오지 못했습니다.');
        }

        const data = (await response.json()) as string;
        console.info('data:', data);
      } catch (error) {
        console.error('error:', error);
      }
    };

    void fetchLectureList();
  });

  return (
    <div className={styles.main}>
      <UpperBar toolBarInfo={mainPageToolBarInfo} />
      <button className={styles.postbutton} onClick={handlePostClick}>
        + 글쓰기
      </button>
      <div>
        <Item id="1" />
        <Item id="2" />
        <Item id="3" />
        <Item id="4" />
        <Item id="5" />
        <Item id="6" />
        <Item id="7" />
        <Item id="8" />
      </div>
    </div>
  );
};

export default MainPage;
