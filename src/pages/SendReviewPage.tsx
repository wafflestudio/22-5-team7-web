/*
  거래 후기 보내기 페이지. 판매자는 구매자가 누구였는지 선택할 수 있고, 거래 후기를 해당 유저에게 보내면 거래가 완료된 것으로 처리.
*/
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import leftArrow from '../assets/leftarrow.svg';
import placeHolder from '../assets/placeholder_gray.png';
import styles from '../css/SendReviewPage.module.css';
import type { ArticleResponse } from '../typings/item';
import {
  mannerTypeLabels,
  negMannerTypeLabels,
  type User,
} from '../typings/user';

type MannerType =
  | keyof typeof mannerTypeLabels
  | keyof typeof negMannerTypeLabels;

const SendReviewPage = () => {
  const [activeMood, setActiveMood] = useState<'bad' | 'good' | 'great' | null>(
    null,
  );
  const [checkedItems, setCheckedItems] = useState<Record<MannerType, boolean>>(
    Object.fromEntries(
      Object.keys(
        activeMood !== 'bad' ? mannerTypeLabels : negMannerTypeLabels,
      ).map((type) => [type, false]),
    ) as Record<MannerType, boolean>,
  );
  const [isSeller, setIsSeller] = useState<boolean>(false); // 내가 판매자인지
  const [itemInfo, setItemInfo] = useState<ArticleResponse>();
  const [partner, setPartner] = useState<User>(); // 거래한 상대방이 누군지 (판매자/구매자 둘 다 가능)
  const [content, setContent] = useState<string>(''); // 리뷰 content
  const { id } = useParams<{ id: string }>(); // item id
  const myNickname = localStorage.getItem('nickname');
  const myId = localStorage.getItem('userId');
  const myLocation = localStorage.getItem('location');
  const navigate = useNavigate();

  const filteredMannerTypeLabels = isSeller
    ? Object.fromEntries(
        Object.entries(mannerTypeLabels).slice(0, 4), // 판매자 label로 변경
      )
    : mannerTypeLabels;

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
        const response = await fetch(
          `/api/item/get/${id}`,
          //'https://b866fe16-c4c5-4989-bdc9-5a783448ec03.mock.pstmn.io/item/get/1',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error(`서버에서 아이템 정보를 받아오지 못했습니다`);
        }

        const data = (await response.json()) as ArticleResponse;
        console.info(data);
        setItemInfo(data);
        setIsSeller(data.article.seller.nickname === myNickname);

        if (data.article.seller.nickname === myNickname) {
          const firstBuyer = data.chattingUsers[0]; // 내가 판매자일 경우 임시로 buyer 지정. 추후엔 location state 이용해서 buyer 정보 받아오기.
          if (firstBuyer === undefined)
            throw new Error('구매자 정보가 존재하지 않습니다');
          setPartner(firstBuyer);
        } else {
          setPartner(data.article.seller); // 내가 구매자일 경우 partner를 판매자로 설정
        }
      } catch (error) {
        console.error(error);
      }
    };

    void fetchIteminfo();
  }, [id, myNickname]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setCheckedItems((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleChangeBuyerClick = () => {
    if (itemInfo === undefined) return;

    const currentIndex = itemInfo.chattingUsers.findIndex(
      (user) => user.nickname === partner?.nickname,
    );

    const nextIndex = (currentIndex + 1) % itemInfo.chattingUsers.length;

    setPartner(itemInfo.chattingUsers[nextIndex]);
  };

  const handlePostClick = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token === null) throw new Error('No token found');
      if (partner === undefined) throw new Error('상대방 정보가 없습니다.');

      const selectedMannerTypes = Object.entries(checkedItems)
        .filter(([, checked]) => checked)
        .map(([key]) => key as MannerType);

      for (const mannerType of selectedMannerTypes) {
        const MannerRequest = {
          nickname: partner.nickname,
          mannerType: mannerType,
          articleId: id,
        };
        console.info(MannerRequest);
        const response = await fetch('/api/profile/praise', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(MannerRequest),
        });

        if (!response.ok) {
          throw new Error(`Failed to send praise for ${mannerType}`);
        }
      }

      if (content !== '') {
        const reviewCreateRequest = {
          content: content,
          location: myLocation,
          isWritedByBuyer: !isSeller,
          sellerId: itemInfo?.article.seller.id,
          buyerId: isSeller ? partner.id : myId,
          articleId: id,
        };
        console.info(reviewCreateRequest);
        const response = await fetch('/api/review/post', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reviewCreateRequest),
        });

        if (!response.ok) {
          throw new Error('Failed to send review');
        }
      }
      console.info('리뷰 보내기 성공!');
      void navigate(-1);
    } catch (error) {
      console.error('에러 발생:', error);
    }
  };

  const handlePostClickWrapper = () => {
    void handlePostClick();
  };

  const isAnyCheckboxChecked = Object.values(checkedItems).some(
    (isChecked) => isChecked,
  );

  return (
    <div className={styles.main}>
      <div className={styles.upperBar}>
        <img
          src={leftArrow}
          className={styles.upperIcon}
          onClick={() => {
            void navigate(-1);
          }}
        />
        <p className={styles.pageTitle}>거래 후기 보내기</p>
      </div>
      <div className={styles.contentBox}>
        <div className={styles.itemBox}>
          <img
            src={
              itemInfo?.article.imagePresignedUrl[0] === ''
                ? placeHolder
                : itemInfo?.article.imagePresignedUrl[0]
            }
            className={styles.itemPic}
          />
          <div className={styles.itemInfoBox}>
            <p className={styles.itemTitle}>{itemInfo?.article.title}</p>
            <p>
              거래한 이웃
              <span style={{ fontWeight: 'bold' }}> {partner?.nickname} </span>
              {isSeller && (
                <span
                  className={styles.changeBuyer}
                  onClick={handleChangeBuyerClick}
                >
                  변경
                </span>
              )}
            </p>
          </div>
        </div>
        <div className={styles.selectMoodBox}>
          <p className={styles.selectMoodMainText}>
            {myNickname}님,
            <br />
            {partner?.nickname}님과 거래가 어떠셨나요?
          </p>
          <p className={styles.selectMoodSubText}>
            거래 선호도는 나만 볼 수 있어요.
          </p>
          <div className={styles.selectMoodButtonBox}>
            <button
              className={
                activeMood === 'bad'
                  ? styles.activeBadMoodButton
                  : styles.unactiveMoodButton
              }
              onClick={() => {
                setActiveMood('bad');
              }}
            >
              <img
                src="https://r2.jjalbot.com/2023/03/KnlckNdRQW.jpeg"
                className={styles.buttonPic}
              />
              별로예요
            </button>
            <button
              className={
                activeMood === 'good'
                  ? styles.activeGoodMoodButton
                  : styles.unactiveMoodButton
              }
              onClick={() => {
                setActiveMood('good');
              }}
            >
              <img
                src="https://i.pinimg.com/736x/11/35/77/11357761454aa7e6c19b84f783e08409.jpg"
                className={styles.buttonPic}
              />
              좋아요!
            </button>
            <button
              className={
                activeMood === 'great'
                  ? styles.activeGreatMoodButton
                  : styles.unactiveMoodButton
              }
              onClick={() => {
                setActiveMood('great');
              }}
            >
              <img
                src="https://pds.joins.com/service/ssully/pd/2019/12/30/2019123014143167040.jpg"
                className={styles.buttonPic}
              />
              최고예요!
            </button>
          </div>
        </div>
        {activeMood !== null && (
          <div className={styles.checkboxContainer}>
            <p className={styles.checkboxMainText}>
              어떤 점이{' '}
              {activeMood === 'bad'
                ? '별로였나요?'
                : activeMood === 'good'
                  ? '좋았나요?'
                  : '최고였나요?'}
            </p>
            {activeMood === 'bad' &&
              Object.entries(negMannerTypeLabels).map(([key, label]) => (
                <label key={key} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name={key}
                    className={styles.checkbox}
                    checked={checkedItems[key as MannerType]}
                    onChange={handleCheckboxChange}
                  />
                  {label}
                </label>
              ))}
            {activeMood !== 'bad' &&
              Object.entries(filteredMannerTypeLabels).map(([key, label]) => (
                <label key={key} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name={key}
                    className={styles.checkbox}
                    checked={checkedItems[key as MannerType]}
                    onChange={handleCheckboxChange}
                  />
                  {label}
                </label>
              ))}
            <div className={styles.reviewBox}>
              <p className={styles.checkboxMainText}>
                {activeMood !== 'bad'
                  ? '따듯한 거래 경험을 알려주세요!'
                  : '아쉬웠던 점을 토이프로젝트 7조에게 알려주세요.'}
              </p>
              <p className={styles.reviewSubText}>
                {activeMood !== 'bad'
                  ? '남겨주신 거래 후기는 상대방의 프로필에 공개돼요.'
                  : '상대방에게 전달되지 않으니 안심하세요.'}
              </p>
              <textarea
                className={styles.articleBox}
                placeholder="여기에 적어주세요. (선택사항)"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                }}
              />
            </div>
            <button
              onClick={handlePostClickWrapper}
              className={styles.PostButton}
              disabled={!isAnyCheckboxChecked}
            >
              후기 보내기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SendReviewPage;
