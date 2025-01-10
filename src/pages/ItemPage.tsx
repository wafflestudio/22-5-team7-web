/* 
  MainPage나 SearchResultPage에서 특정 item을 클릭했을 때 연결되는 페이지.
  아이템 정보, 판매자 정보 등 띄워야 함
*/

import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { useNavigate, useParams } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';

import filledhearticon from '../assets/heart_filled_orange.svg';
import emptyhearticon from '../assets/heart_gray.svg';
import homeicon from '../assets/home_white.svg';
import leftarrowicon from '../assets/leftarrow_white.svg';
import shareicon from '../assets/share_white.svg';
import dotsicon from '../assets/three_dots_white.svg';
import TemperatureGaugeSmall from '../components/TemperatureGaugeSmall';
import styles from '../css/ItemPage.module.css';
import type { Item } from '../typings/item';
import { getTimeAgo } from '../utils/utils';

const ItemPage = () => {
  const { id } = useParams<{ id: string }>();
  const [isLiked, setIsLiked] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [item, setItem] = useState<Item>();
  const images = [
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/400',
    'https://via.placeholder.com/500',
    'https://via.placeholder.com/600',
  ];
  const profileimage = 'https://via.placeholder.com/100';
  const navigate = useNavigate();

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
  };

  const handleBackClick = () => {
    void navigate(-1);
  };

  const handleHomeClick = () => {
    void navigate('/main');
  };

  const handleDotsClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleEditClick = () => {
    if (id === undefined) {
      throw new Error('아이템 정보가 없습니다.');
    }
    void navigate(`/itemedit/${id}`);
  };

  const handleDeleteClick = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token === null) {
        throw new Error('토큰이 없습니다.');
      }
      if (id === undefined) {
        throw new Error('아이템 정보가 없습니다.');
      }
      const response = await fetch(
        `http://localhost:5173/api/item/delete/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error('삭제 요청에 실패했습니다.');
      }

      void navigate('/main');
    } catch (error) {
      console.error('삭제 중 에러 발생:', error);
    }
  };

  const handleDeleteClickWrappper = () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      void handleDeleteClick();
    }
  };

  const handleCancelClick = () => {
    setIsDropdownOpen(false);
  };

  const handlePrevSwipe = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? prevIndex : prevIndex - 1,
    );
  };

  const handleNextSwipe = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? prevIndex : prevIndex + 1,
    );
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleNextSwipe,
    onSwipedRight: handlePrevSwipe,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

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
          `http://localhost:5173/api/item/get/${id}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error('서버에서 데이터를 받아오지 못했습니다.');
        }

        const data: Item = (await response.json()) as Item;
        setItem(data);
      } catch (error) {
        console.error(error);
      }
    };

    void fetchIteminfo();
  }, [id]);

  return (
    <div className={styles.main}>
      <div className={styles.upperbar}>
        <div className={styles.navicons}>
          <img
            src={leftarrowicon}
            className={styles.leftarrowicon}
            onClick={handleBackClick}
          ></img>
          <img
            src={homeicon}
            className={styles.homeicon}
            onClick={handleHomeClick}
          ></img>
        </div>
        <div className={styles.etcicons}>
          <img src={shareicon} className={styles.shareicon}></img>
          <div className={styles.dropdownContainer}>
            <img
              src={dotsicon}
              className={styles.dotsicon}
              onClick={handleDotsClick}
            />
            {isDropdownOpen && (
              <>
                <div
                  className={styles.overlay}
                  onClick={handleCancelClick}
                ></div>
                <div className={styles.actionSheet}>
                  <div className={styles.actionSheetContent}>
                    <button
                      onClick={handleEditClick}
                      className={styles.editbutton}
                    >
                      게시글 수정
                    </button>
                    <button
                      onClick={handleDeleteClickWrappper}
                      className={styles.deletebutton}
                    >
                      삭제
                    </button>
                  </div>
                  <button
                    onClick={handleCancelClick}
                    className={styles.cancelbutton}
                  >
                    취소
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className={styles.imagecontainer} {...handlers}>
        <div
          className={styles.imagewrapper}
          style={{
            transform: `translateX(calc(-${currentImageIndex * 100}vw + ${(images.length - 1) * 50}vw))`,
          }}
        >
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              className={`${styles.image === undefined ? '' : styles.image} ${styles.gradientOverlay === undefined ? '' : styles.gradientOverlay}`}
              alt={`item ${index}`}
            />
          ))}
        </div>
      </div>
      <div className={styles.dots}>
        {images.map((_, index) => (
          <div
            key={index}
            className={`${styles.dot === undefined ? '' : styles.dot} ${currentImageIndex === index ? (styles.active === undefined ? '' : styles.active) : ''}`}
          />
        ))}
      </div>
      <div className={styles.contentBox}>
        <div className={styles.profilebar}>
          <NavLink
            to={`/profile/${item?.seller.id === undefined ? '' : item.seller.id}`}
            className={styles.profile}
          >
            <img src={profileimage} className={styles.profileimage}></img>
            <div className={styles.profiletext}>
              <p className={styles.nickname}>{item?.seller.nickname}</p>
              <p className={styles.address}>{item?.seller.location}</p>
            </div>
          </NavLink>

          <div className={styles.mannertempbox}>
            <TemperatureGaugeSmall
              temperature={
                item?.seller.temperature === undefined
                  ? 0
                  : item.seller.temperature
              }
            />
            <NavLink to={`/temp`} className={styles.temptext}>
              매너온도
            </NavLink>
          </div>
        </div>
        <div className={styles.itemInfo}>
          <p className={styles.titletext}>{item?.title}</p>
          <p
            className={styles.categoryanddate}
          >{`디지털기기 · ${getTimeAgo(item?.createdAt === undefined ? '' : item.createdAt)}`}</p>
          <p className={styles.article}>{item?.content}</p>
          <div className={styles.locationbox}>
            <p className={styles.locationtitle}>거래 희망 장소</p>
            <p className={styles.location}>{item?.location}</p>
          </div>
          <p
            className={styles.chatlikeview}
          >{`채팅3 · 관심 ${item?.likeCount === undefined ? '' : item.likeCount} · 조회 3342`}</p>
          <NavLink to={`/reportitem`} className={styles.reportbutton}>
            이 게시글 신고하기
          </NavLink>
        </div>
      </div>
      <div className={styles.bottombar}>
        <div className={styles.likebutton}>
          <img
            src={isLiked ? filledhearticon : emptyhearticon}
            className={styles.likeicon}
            alt="like"
            onClick={handleLikeClick}
          />
        </div>
        <div className={styles.priceandchat}>
          <div className={styles.pricebox}>
            <p className={styles.price}>
              {item?.price !== undefined
                ? `${Intl.NumberFormat('ko-KR').format(item.price)}원`
                : '가격 정보 없음'}
            </p>
            <p className={styles.offerstatus}>{`가격 제안 불가`}</p>
          </div>
          <button className={styles.chatbutton}>채팅하기</button>
        </div>
      </div>
    </div>
  );
};

export default ItemPage;
