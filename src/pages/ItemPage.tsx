/* 
  MainPage나 SearchResultPage에서 특정 item을 클릭했을 때 연결되는 페이지.
  아이템 정보, 판매자 정보 등 띄워야 함
*/
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';

import filledhearticon from '../assets/heart_filled_orange.svg';
import emptyhearticon from '../assets/heart_gray.svg';
import homeicon from '../assets/home_white.svg';
import leftarrowicon from '../assets/leftarrow_white.svg';
import shareicon from '../assets/share_white.svg';
import dotsicon from '../assets/three_dots_white.svg';
import TemperatureGaugeSmall from '../components/TemperatureGaugeSmall';
import styles from '../css/ItemPage.module.css';

interface Seller {
  id: string;
  nickname: string;
  location: string;
  temperature: number;
  email: string;
}

interface Item {
  id: string;
  seller: Seller;
  title: string;
  content: string;
  price: number;
  status: string;
  location: string;
  createdAt: string; // Instant 타입을 문자열로 처리
  likeCount: number;
}

const ItemPage = () => {
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
  const price = 1200000;
  const formattedPrice = new Intl.NumberFormat('ko-KR').format(price);
  const navigate = useNavigate();
  const id = 1;

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
    // 수정 로직
  };

  const handleDeleteClick = () => {
    // 삭제 로직
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
        const response = await fetch(
          `http://localhost:5173/api/item/get/${id}`,
          {
            method: 'GET',
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
  }, []);

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
                      onClick={handleDeleteClick}
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
              className={styles.image}
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
          <NavLink to={`/profile/${id}`} className={styles.profile}>
            <img src={profileimage} className={styles.profileimage}></img>
            <div className={styles.profiletext}>
              <p className={styles.nickname}>{item?.seller.nickname}</p>
              <p className={styles.address}>{item?.seller.location}</p>
            </div>
          </NavLink>

          <div className={styles.mannertempbox}>
            <TemperatureGaugeSmall temperature={48.6} />
            <NavLink to={`/temp`} className={styles.temptext}>
              매너온도
            </NavLink>
          </div>
        </div>
        <div className={styles.itemInfo}>
          <p className={styles.titletext}>{`[미개봉 새상품] AAAA건전지`}</p>
          <p className={styles.categoryanddate}>{`디지털기기 · ~분전`}</p>
          <p
            className={styles.article}
          >{`AAAA건전지 개당 1000원에 판매합니다.`}</p>
          <p className={styles.chatlikeview}>{`채팅3 · 관심 8 · 조회 3342`}</p>
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
            <p className={styles.price}>{`${formattedPrice}원`}</p>
            <p className={styles.offerstatus}>{`가격 제안 불가`}</p>
          </div>
          <button className={styles.chatbutton}>채팅하기</button>
        </div>
      </div>
    </div>
  );
};

export default ItemPage;
