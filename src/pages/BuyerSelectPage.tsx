/*
  각 채팅방에 해당하는 페이지.
*/
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import leftarrow from '../assets/leftarrow.svg';
//import UpperBar from '../components/UpperBar';
import styles from '../css/BuyerSelectPage.module.css';
import type { Article } from '../typings/item';
import type { Item } from '../typings/item';
import type { LocationState } from '../typings/toolBar';

const BuyerSelectPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState<Item | null>(null);
  const [itemInfo, setItemInfo] = useState<Article | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const price = 1200000;
  const [formattedPrice, setFormattedPrice] = useState<string>(
    new Intl.NumberFormat('ko-KR').format(price),
  );
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackClick = () => {
    const locationState = location.state as LocationState;

    if (locationState !== null && locationState.from === 'mysells') {
      void navigate(-2);
    } else {
      void navigate(-1);
    }
  };

  useEffect(() => {
    const fetchIteminfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token === null) {
          throw new Error('토큰이 없습니다.');
        }
        if (id === undefined) {
          throw new Error('아이템 정보가 없습니다.');
        }
        const response = await fetch(`/api/item/get/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`서버에 데이터를 전송하지 못했습니다`);
        }

        const data: Item = (await response.json()) as Item;
        setItem(data);
        setItemInfo(data.article);
        setFormattedPrice(
          new Intl.NumberFormat('ko-KR').format(data.article.price),
        );
      } catch (error) {
        console.error(error);
      }
    };

    void fetchIteminfo();
  }, [id]);

  const handleUserSelect = (userId: string) => {
    setSelectedUser((prevSelectedUser) =>
      prevSelectedUser === userId ? null : userId,
    );
  };

  const handleBuyerSelect = async () => {
    if (item === null || selectedUser === null) {
      alert('아이템 또는 구매자가 선택되지 않았습니다.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (token === null) {
        throw new Error('토큰이 없습니다.');
      }
      const response = await fetch('/api/item/update/buyer', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articleId: item.article.id,
          buyerId: selectedUser,
        }),
      });

      if (!response.ok) {
        throw new Error('구매자 정보를 업데이트하지 못했습니다.');
      }

      void navigate(-1);
      //void navigate('/sendreview', { state: { selectedUser } });
    } catch (error) {
      console.error(error);
    }
  };

  const handleBuyerSelectWrapper = () => {
    void handleBuyerSelect();
  };

  return (
    <div className={styles.main}>
      <div className={styles.upperbar}>
        <img
          src={leftarrow}
          className={styles.icon}
          onClick={handleBackClick}
        ></img>
        <div className={styles.opponentinfo}>
          <p>구매자 선택</p>
        </div>
      </div>
      <div className={styles.iteminfoBox}>
        <div className={styles.iteminfo}>
          <img
            src={
              itemInfo !== null && itemInfo.imagePresignedUrl[0] !== ''
                ? itemInfo.imagePresignedUrl[0]
                : 'https://placehold.co/100'
            }
            className={styles.itemimage}
          ></img>
          <div className={styles.itemnameandprice}>
            <div className={styles.itemname}>
              <div className={styles.itemstatus}>
                <p>
                  {itemInfo?.status === 0
                    ? '판매중'
                    : itemInfo?.status === 1
                      ? '예약중'
                      : itemInfo?.status === 2
                        ? '거래완료'
                        : ''}
                </p>
              </div>
              <p>{itemInfo?.title}</p>
            </div>
            <div className={styles.itemprice}>{`${formattedPrice}원`}</div>
          </div>
        </div>
      </div>
      {item !== null && (
        <div className={styles.userList}>
          {item.chattingUsers.map((user) => (
            <div key={user.id} className={styles.userItem}>
              <input
                type="checkbox"
                checked={selectedUser === user.id}
                onChange={() => {
                  handleUserSelect(user.id);
                }}
              />
              <div className={styles.userInfobox}>
                <img
                  src={
                    user.imagePresignedUrl === ''
                      ? 'https://placehold.co/100'
                      : user.imagePresignedUrl
                  }
                  className={styles.userimage}
                ></img>
                <div className={styles.userInfotext}>
                  <p>{user.nickname}</p>
                  <p className={styles.userInfolocation}>{user.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className={styles.selectbuttonbox}>
        <button
          className={styles.selectbutton}
          onClick={handleBuyerSelectWrapper}
        >
          구매자 선택
        </button>
        <p onClick={() => void navigate(-2)} className={styles.noselecttext}>
          선택하지 않을래요
        </p>
      </div>
    </div>
  );
};

export default BuyerSelectPage;
