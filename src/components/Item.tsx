/*
  홈 화면에서 보이는 아이템을 나타내는 컴포넌트.
*/
import { NavLink } from 'react-router-dom';

import heartIcon from '../assets/heart_filled_gray.svg';
import chatIcon from '../assets/navbar/navbar-chat-gray.svg';
import placeHolder from '../assets/placeholder_gray.png';
import styles from '../css/Item.module.css';
import type { PreviewItem } from '../typings/item';
import { getTimeAgo } from '../utils/utils';

type ItemProps = {
  ItemInfo: PreviewItem;
};

const Item = ({ ItemInfo }: ItemProps) => {
  return (
    <NavLink to={`/item/${ItemInfo.id}`} className={styles.navLink}>
      <div className={styles.main}>
        <div className={styles.upperBox}>
          <img
            src={
              ItemInfo.imagePresignedUrl === ''
                ? placeHolder
                : ItemInfo.imagePresignedUrl
            }
            className={styles.image}
          />
          <div className={styles.contentBox}>
            <div className={styles.textBox}>
              <p className={styles.itemName}>{ItemInfo.title}</p>
              <p
                className={styles.itemInfo}
              >{`${ItemInfo.location} · ${getTimeAgo(ItemInfo.createdAt)}`}</p>
              <p className={styles.itemPrice}>
                {ItemInfo.status === '판매 중' ? (
                  ''
                ) : (
                  <span className={styles.itemStatus}>{ItemInfo.status}</span>
                )}

                {`${Intl.NumberFormat('ko-KR').format(ItemInfo.price)}원`}
              </p>
            </div>
            <div className={styles.subBox}>
              <div className={styles.iconBox}>
                <img src={chatIcon} className={styles.smallIcon} />
                {14}
              </div>
              {ItemInfo.likeCount > 0 && (
                <div className={styles.iconBox}>
                  <img src={heartIcon} className={styles.smallIcon} />
                  {ItemInfo.likeCount}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default Item;
