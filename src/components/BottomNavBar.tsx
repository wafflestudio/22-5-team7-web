import { NavLink } from 'react-router-dom';

import auctionIconOn from '../assets/navbar/navbar-auction-black.svg';
import auctionIconOff from '../assets/navbar/navbar-auction-gray.svg';
import chatIconOn from '../assets/navbar/navbar-chat-black.svg';
import chatIconOff from '../assets/navbar/navbar-chat-gray.svg';
import communityIconOn from '../assets/navbar/navbar-community-black.svg';
import communityIconOff from '../assets/navbar/navbar-community-gray.svg';
import homeIconOn from '../assets/navbar/navbar-home-black.svg';
import homeIconOff from '../assets/navbar/navbar-home-gray.svg';
import myPageIconOn from '../assets/navbar/navbar-mypage-black.svg';
import myPageIconOff from '../assets/navbar/navbar-mypage-gray.svg';
import styles from '../css/BottomNavBar.module.css';

const BottomNavBar = () => {
  const navItems = [
    {
      path: '/main',
      label: '홈',
      iconOn: homeIconOn,
      iconOff: homeIconOff,
    },
    {
      path: '/community',
      label: '동네생활',
      iconOn: communityIconOn,
      iconOff: communityIconOff,
    },
    {
      path: '/auctions',
      label: '경매',
      iconOn: auctionIconOn,
      iconOff: auctionIconOff,
    },
    {
      path: '/chat',
      label: '채팅',
      iconOn: chatIconOn,
      iconOff: chatIconOff,
    },
    {
      path: '/mypage',
      label: '나의 당근',
      iconOn: myPageIconOn,
      iconOff: myPageIconOff,
    },
  ];

  return (
    <nav className={styles.navBar}>
      {navItems.map((item) => (
        <NavLink key={item.path} to={item.path} className={styles.navBarLink}>
          {({ isActive }) => (
            <div className={styles.navBarItem}>
              <img
                src={isActive ? item.iconOn : item.iconOff}
                alt={item.label}
                className={styles.icon}
              />
              <p style={{ color: isActive ? '#000000' : '#999999' }}>
                {item.label}
              </p>
            </div>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNavBar;
