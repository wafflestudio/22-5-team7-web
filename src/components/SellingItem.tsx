/*
  홈 화면에서 보이는 아이템을 나타내는 컴포넌트.
*/
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import heartIcon from '../assets/heart_filled_gray.svg';
import chatIcon from '../assets/navbar/navbar-chat-gray.svg';
import placeHolder from '../assets/placeholder_gray.png';
import dotsIcon from '../assets/three_dots_black.svg';
import styles from '../css/SellingItem.module.css';
import type { PreviewItem } from '../typings/item';
import { getTimeAgo } from '../utils/utils';

type SellingItemProps = {
  ItemInfo: PreviewItem;
};

const SellingItem = ({ ItemInfo }: SellingItemProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLeftButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    void navigate('/temp');
  };

  const handleDotsButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCancelClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDropdownOpen(false);
  };

  const handleReserveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // 로직 추가
    setIsDropdownOpen(false);
  };

  const handleSoldClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // 로직 추가
    setIsDropdownOpen(false);
  };

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    void navigate(`/itemedit/${ItemInfo.id}`);
  };

  const handleDeleteClick = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token === null) {
        throw new Error('토큰이 없습니다.');
      }
      const response = await fetch(`/api/item/delete/${ItemInfo.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('삭제 요청에 실패했습니다.');
      }

      void navigate('/main');
    } catch (error) {
      console.error('삭제 중 에러 발생:', error);
    }
  };

  const handleDeleteClickWrapper = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDropdownOpen(false);
    if (window.confirm('정말 삭제하시겠습니까?')) {
      void handleDeleteClick();
    }
  };

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
        <div className={styles.lowerBox}>
          <button
            className={styles.button}
            style={{ flex: '1' }}
            onClick={handleLeftButtonClick}
          >
            {ItemInfo.status !== '거래완료' ? '끌어올리기' : '보낸 후기 보기'}
          </button>
          <div className={styles.dropdownContainer}>
            <button className={styles.button} onClick={handleDotsButtonClick}>
              <img src={dotsIcon} className={styles.dotsIcon} />
            </button>
          </div>
        </div>
      </div>
      {isDropdownOpen && (
        <>
          <div className={styles.overlay} onClick={handleCancelClick}></div>
          <div className={styles.actionSheet}>
            <div className={styles.actionSheetContent}>
              <button
                className={styles.bluebutton}
                onClick={handleReserveClick}
              >
                예약중
              </button>
              <button className={styles.bluebutton} onClick={handleSoldClick}>
                거래완료
              </button>
              <button className={styles.bluebutton} onClick={handleEditClick}>
                게시글 수정
              </button>
              <button
                className={styles.redbutton}
                onClick={handleDeleteClickWrapper}
              >
                삭제
              </button>
            </div>
            <button onClick={handleCancelClick} className={styles.cancelbutton}>
              취소
            </button>
          </div>
        </>
      )}
    </NavLink>
  );
};

export default SellingItem;
