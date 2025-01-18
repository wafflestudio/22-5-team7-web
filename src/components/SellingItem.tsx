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

  const handleChangeStatus = (
    status: number,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    const changeStatus = async () => {
      e.preventDefault();
      try {
        const token = localStorage.getItem('token');
        if (token === null) {
          throw new Error('토큰이 없습니다.');
        }
        const response = await fetch(`/api/item/status/${ItemInfo.id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        });

        if (!response.ok) {
          throw new Error('상태 변경 요청에 실패했습니다.');
        }
      } catch (error) {
        console.error('에러 발생:', error);
      } finally {
        setIsDropdownOpen(false);
      }
    };

    void changeStatus();
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

  const statusButtons = {
    0: [
      { label: '예약중', status: 1, style: styles.bluebutton },
      { label: '거래완료', status: 2, style: styles.bluebutton },
      {
        label: '게시글 수정',
        action: handleEditClick,
        style: styles.bluebutton,
      },
      {
        label: '삭제',
        action: handleDeleteClickWrapper,
        style: styles.redbutton,
      },
    ],
    1: [
      { label: '판매중', status: 0, style: styles.bluebutton },
      {
        label: '게시글 수정',
        action: handleEditClick,
        style: styles.bluebutton,
      },
      {
        label: '삭제',
        action: handleDeleteClickWrapper,
        style: styles.redbutton,
      },
    ],
    2: [
      { label: '판매중', status: 0, style: styles.bluebutton },
      {
        label: '게시글 수정',
        action: handleEditClick,
        style: styles.bluebutton,
      },
      {
        label: '삭제',
        action: handleDeleteClickWrapper,
        style: styles.redbutton,
      },
    ],
  };

  const renderButtons = () => {
    const buttons = statusButtons[ItemInfo.status];
    return buttons.map((action, index) => (
      <button
        key={index}
        className={action.style}
        onClick={
          action.status !== undefined
            ? (e) => {
                handleChangeStatus(0, e);
              }
            : action.action
        }
      >
        {action.label}
      </button>
    ));
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
                {ItemInfo.status === 0 ? (
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
            {ItemInfo.status !== 2 ? '끌어올리기' : '보낸 후기 보기'}
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
            <div className={styles.actionSheetContent}>{renderButtons()}</div>
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
