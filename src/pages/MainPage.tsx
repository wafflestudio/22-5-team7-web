/* 
  당근마켓 앱의 '홈' 에 해당하는 메인 페이지.
*/

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

  return (
    <div className={styles.main}>
      <UpperBar toolBarInfo={mainPageToolBarInfo} />
      <button className={styles.postbutton} onClick={handlePostClick}>
        + 글쓰기
      </button>
      <div>
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
      </div>
    </div>
  );
};

export default MainPage;
