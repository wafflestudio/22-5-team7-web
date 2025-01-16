import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import peopleIcon from '../assets/people-gray.svg';
import placeHolder from '../assets/placeholder_gray.png';
import styles from '../css/AuctionItem.module.css';
import type { PreviewAuctionItem } from '../typings/auctionitem';

type ItemProps = {
  ItemInfo: PreviewAuctionItem;
};

const AuctionItem = ({ ItemInfo }: ItemProps) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const end = new Date(ItemInfo.createdAt);
      const timeDiff = end.getTime() - now.getTime();

      if (timeDiff <= 0) {
        clearInterval(interval);
        setTimeLeft('경매 종료');
      } else {
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        if (hours > 0) {
          setTimeLeft(`${hours}시간 ${minutes}분 ${seconds}초 남음`);
        } else if (minutes > 0) {
          setTimeLeft(`${minutes}분 ${seconds}초 남음`);
        } else {
          setTimeLeft(`${seconds}초 남음`);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [ItemInfo.createdAt]);

  return (
    <NavLink to={`${ItemInfo.id}`} className={styles.navLink}>
      <div className={styles.main}>
        <div className={styles.upperBox}>
          <img
            src={ItemInfo.image_url ?? placeHolder}
            className={styles.image}
          />
          <div className={styles.contentBox}>
            <div className={styles.textBox}>
              <p className={styles.itemName}>{ItemInfo.title}</p>
              <p
                className={styles.itemInfo}
              >{`${ItemInfo.location} · ${timeLeft}`}</p>
              <p className={styles.initPrice}>
                {`시작가:  ${Intl.NumberFormat('ko-KR').format(ItemInfo.price)}원`}
              </p>
              <p className={styles.presentPrice}>
                {`현재 입찰가:  ${Intl.NumberFormat('ko-KR').format(ItemInfo.price)}원`}
              </p>
            </div>
            <div className={styles.subBox}>
              <div className={styles.iconBox}>
                <img src={peopleIcon} className={styles.smallIcon} />
                {14}
              </div>
            </div>
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default AuctionItem;
