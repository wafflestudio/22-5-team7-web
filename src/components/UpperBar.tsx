import { NavLink, useLocation } from 'react-router-dom';

import styles from '../css/UpperBar.module.css';
import type { UpperBarProps } from '../typings/toolBar';

const UpperBar = ({ toolBarInfo }: UpperBarProps) => {
  const location = useLocation();

  const isOnMyPage = location.pathname === '/mypage';

  return (
    <div
      className={styles.upperBar}
      style={{ backgroundColor: isOnMyPage ? '#f0f0f0' : 'white' }}
    >
      <p className={styles.mainText}>{toolBarInfo.mainText}</p>
      <div className={styles.upperBarIconDiv}>
        {toolBarInfo.toolBarItems.map((item) => (
          <NavLink key={item.alt} to={item.pathTo}>
            <img src={item.icon} alt={item.alt} className={styles.icon} />
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default UpperBar;
