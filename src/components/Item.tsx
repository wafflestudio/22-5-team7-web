/*
  홈 화면에서 보이는 아이템을 나타내는 컴포넌트.
*/
import { NavLink } from 'react-router-dom';

import heartIcon from '../assets/heart_filled_gray.svg';
import chatIcon from '../assets/navbar/navbar-chat-gray.svg';
import placeHolder from '../assets/placeholder_gray.png';
import styles from '../css/Item.module.css';

interface ItemProps {
  id: string;
}

const Item: React.FC<ItemProps> = ({ id }) => {
  return (
    <NavLink to={`/item/${id}`} className={styles.main}>
      <img src={placeHolder} className={styles.image} />
      <div className={styles.contentBox}>
        <div className={styles.textBox}>
          <p className={styles.itemName}>
            맨체스터 유나이티드 (맨유) 홈 유니폼 저지 24/25 선수 마킹 패치
          </p>
          <p className={styles.itemInfo}>대학동 · 5분 전</p>
          <p className={styles.itemPrice}>100,000원</p>
        </div>
        <div className={styles.subBox}>
          <div className={styles.iconBox}>
            <img src={chatIcon} className={styles.smallIcon} /> 7
          </div>
          <div className={styles.iconBox}>
            <img src={heartIcon} className={styles.smallIcon} /> 14
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default Item;
