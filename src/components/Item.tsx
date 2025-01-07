/*
  홈 화면에서 보이는 아이템을 나타내는 컴포넌트.
*/
import { NavLink } from 'react-router-dom';

import heartIcon from '../assets/heart_filled_gray.svg';
import chatIcon from '../assets/navbar/navbar-chat-gray.svg';
import placeHolder from '../assets/placeholder_gray.png';
import styles from '../css/Item.module.css';

interface ItemProps {
  title: string;
  price: number;
  status: string;
  location: string;
  createdAt: string;
  likeCount: number;
}

const Item: React.FC<ItemProps> = ({
  title,
  price,
  status,
  location,
  createdAt,
  likeCount,
}) => {
  return (
    <NavLink to={`/item/2`} className={styles.navLink}>
      <div className={styles.main}>
        <img src={placeHolder} className={styles.image} />
        <div className={styles.contentBox}>
          <div className={styles.textBox}>
            <p className={styles.itemName}>{`${status} ${title}`}</p>
            <p className={styles.itemInfo}>{`${location} + ${createdAt}`}</p>
            <p className={styles.itemPrice}>
              {`${Intl.NumberFormat('ko-KR').format(price)}원`}
            </p>
          </div>
          <div className={styles.subBox}>
            <div className={styles.iconBox}>
              <img src={chatIcon} className={styles.smallIcon} /> {likeCount}
            </div>
            <div className={styles.iconBox}>
              <img src={heartIcon} className={styles.smallIcon} /> 14
            </div>
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default Item;
