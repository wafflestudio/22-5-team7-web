import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

//import peopleIcon from '../assets/people-gray.svg';
import heartIcon from '../assets/heart_filled_gray.svg';
import placeHolder from '../assets/placeholder_gray.png';
import styles from '../css/ParticipatingAuctionItem.module.css';
import type { PreviewAuctionItem } from '../typings/auctionitem';
import { calculateTimeLeft } from '../utils/utils';

type ItemProps = {
  ItemInfo: PreviewAuctionItem;
};

const ParticipatingAuctionItem = ({ ItemInfo }: ItemProps) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isHighestBidder, setIsHighestBidder] = useState(true);

  useEffect(() => {
    const interval = calculateTimeLeft(ItemInfo.endTime, setTimeLeft);
    setIsHighestBidder(true);

    return () => {
      clearInterval(interval);
    };
  }, [ItemInfo.endTime]);

  return (
    <NavLink to={`/auctions/${ItemInfo.id}`} className={styles.navLink}>
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
            <div className={styles.actionContainer}>
              {timeLeft !== '경매 종료' ? (
                isHighestBidder ? (
                  <span className={styles.statusText}>현재 상위 입찰</span>
                ) : (
                  <span className={styles.statusText}>더 높은 입찰 존재</span>
                )
              ) : isHighestBidder ? (
                <div className={styles.successContainer}>
                  <span className={styles.successText}>낙찰 성공!</span>
                  <button className={styles.chatButton}>채팅하기</button>
                </div>
              ) : (
                <span className={styles.failureText}>낙찰 실패</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default ParticipatingAuctionItem;
