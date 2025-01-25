import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

//import peopleIcon from '../assets/people-gray.svg';
import heartIcon from '../assets/heart_filled_gray.svg';
import placeHolder from '../assets/placeholder_gray.png';
import styles from '../css/AuctionItem.module.css';
import type { PreviewAuctionItem } from '../typings/auctionitem';
import { calculateTimeLeft } from '../utils/utils';

type ItemProps = {
  ItemInfo: PreviewAuctionItem;
};

const AuctionItem = ({ ItemInfo }: ItemProps) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const interval = calculateTimeLeft(ItemInfo.endTime, setTimeLeft);

    return () => {
      clearInterval(interval);
    };
  }, [ItemInfo.endTime]);

  return (
    <NavLink to={`${ItemInfo.id}`} className={styles.navLink}>
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
              >{`${ItemInfo.location} · ${timeLeft}`}</p>
              <p className={styles.initPrice}>
                {`시작가:  ${Intl.NumberFormat('ko-KR').format(ItemInfo.startingPrice)}원`}
              </p>
              <p className={styles.presentPrice}>
                {`현재 입찰가:  ${Intl.NumberFormat('ko-KR').format(ItemInfo.currentPrice)}원`}
              </p>
            </div>
            <div className={styles.subBox}>
              <div className={styles.iconBox}>
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
      </div>
    </NavLink>
  );
};

export default AuctionItem;
