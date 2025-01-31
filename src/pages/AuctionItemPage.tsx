/* 
  MainPage나 SearchResultPage에서 특정 item을 클릭했을 때 연결되는 페이지.
  아이템 정보, 판매자 정보 등 띄워야 함
*/
import { Stomp } from '@stomp/stompjs';
import { Client } from '@stomp/stompjs';
import { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import SockJS from 'sockjs-client';

import filledhearticon from '../assets/heart_filled_orange.svg';
import emptyhearticon from '../assets/heart_gray.svg';
import homeblack from '../assets/home.svg';
import homeicon from '../assets/home_white.svg';
import leftarrowblack from '../assets/leftarrow.svg';
import leftarrowicon from '../assets/leftarrow_white.svg';
import shareblack from '../assets/share.svg';
import shareicon from '../assets/share_white.svg';
import dotsblack from '../assets/three_dots_black.svg';
import dotsicon from '../assets/three_dots_white.svg';
import TemperatureGaugeSmall from '../components/TemperatureGaugeSmall';
import styles from '../css/AuctionItemPage.module.css';
import type { AuctionItem, AuctionMessage } from '../typings/auctionitem';
import type { LocationState } from '../typings/toolBar';
import { handleShareClick } from '../utils/eventhandlers';
import { calculateTimeLeft } from '../utils/utils';

const ItemPage = () => {
  const { id } = useParams<{ id: string }>();
  const [isLiked, setIsLiked] = useState(false);
  //const [isFirstClick, setIsFirstClick] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  //const [currentInput, setCurrentInput] = useState<string>('');
  const [item, setItem] = useState<AuctionItem>();
  const userId = localStorage.getItem('userId');
  const [isMyItem, setIsMyItem] = useState(false);
  const [isHighestBid, setIsHighestBid] = useState(false);
  const [myNickname, setMyNickname] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState('');
  const [price, setPrice] = useState(0);
  //const [imagesLoaded, setImagesLoaded] = useState(false);
  const [profileimage, setProfileimage] = useState<string>(
    'https://placehold.co/100',
  );
  const socketRef = useRef<Client | null>(null);
  const baseimage = 'https://placehold.co/100';
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (item?.endTime === undefined) {
      return;
    }
    const interval = calculateTimeLeft(item.endTime, setTimeLeft);

    return () => {
      clearInterval(interval);
    };
  }, [item?.endTime]);

  const updateAuctionEndTime = useCallback(async () => {
    if (id === undefined) {
      console.error('경매 ID가 없습니다.');
      return;
    }
    const token = localStorage.getItem('token');
    if (token === null) {
      throw new Error('토큰이 없습니다.');
    }
    const response = await fetch(`/api/auction/get/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('아이템 정보를 가져오는 데 실패했습니다.');
    }
    const updatedItem = (await response.json()) as AuctionItem;
    setItem(updatedItem);
  }, [id]);

  useEffect(() => {
    if (price !== 0) {
      void updateAuctionEndTime();
    }
  }, [price, updateAuctionEndTime]);

  const handleLikeClick = async () => {
    if (!isLiked) {
      try {
        const token = localStorage.getItem('token');
        if (token === null) {
          throw new Error('토큰이 없습니다.');
        }
        if (id === undefined) {
          throw new Error('아이템 정보가 없습니다.');
        }
        const response = await fetch(`/api/auction/like/${id}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('관심 요청에 실패했습니다.');
        }
      } catch (error) {
        console.error('관심 중 에러 발생:', error);
      }
    } else {
      try {
        const token = localStorage.getItem('token');
        if (token === null) {
          throw new Error('토큰이 없습니다.');
        }
        if (id === undefined) {
          throw new Error('아이템 정보가 없습니다.');
        }
        const response = await fetch(`/api/auction/unlike/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('관심 요청에 실패했습니다.');
        }
      } catch (error) {
        console.error('관심 중 에러 발생:', error);
      }
    }
    setIsLiked(!isLiked);
  };

  const handleBackClick = () => {
    const locationState = location.state as LocationState;

    if (locationState !== null && locationState.from === 'itempost') {
      void navigate(-2);
    } else {
      void navigate(-1);
    }
  };

  const handleHomeClick = () => {
    void navigate('/main');
  };

  const handleDotsClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleReportClick = () => {
    void navigate('/main');
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
      const response = await fetch(`/api/item/delete/${id}`, {
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

  const handleLikeClickWrappper = () => {
    void handleLikeClick();
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
        const response = await fetch(`/api/auction/get/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`서버에 데이터를 전송하지 못했습니다`);
        }

        const data: AuctionItem = (await response.json()) as AuctionItem;
        setItem(data);
        setPrice(data.currentPrice);
        setMyNickname(localStorage.getItem('nickname') ?? '');
        setImages(data.imagePresignedUrl);
        setIsLiked(data.isLiked);
        setProfileimage(data.seller.imagePresignedUrl);
      } catch (error) {
        console.error(error);
      }
    };

    void fetchIteminfo();
  }, [id]);

  useEffect(() => {
    setIsMyItem(item?.seller.id === userId);
  }, [item, userId]);

  useEffect(() => {
    console.info('useEffect 실행됨');

    const setupWebSocket = () => {
      if (id === undefined) {
        console.error('경매 ID가 없습니다.');
        return;
      }
      // SockJS 및 Stomp 설정
      //const socket = new SockJS(`http://${window.location.host}/ws`);
      const socket = new SockJS(`https://toykarrot.shop/ws`);
      const stompClient: Client = Stomp.over(() => socket);
      const storedNickname = localStorage.getItem('nickname');
      socketRef.current = stompClient;

      socketRef.current.onConnect = () => {
        console.info('WebSocket 연결이 열렸습니다.');

        // 구독 설정
        socketRef.current?.subscribe(`/topic/auction/${id}`, (message) => {
          const data: AuctionMessage = JSON.parse(
            message.body,
          ) as AuctionMessage;
          setPrice(data.price);

          if (data.senderNickname === storedNickname) {
            setIsHighestBid(true);
          } else {
            setIsHighestBid(false);
          }
        });
      };

      socketRef.current.onStompError = (frame) => {
        console.error('STOMP 오류:', frame.headers['message']);
        console.error('상세 정보:', frame.body);
      };

      socketRef.current.onWebSocketError = (event) => {
        console.error('WebSocket 오류:', event);
      };

      socketRef.current.onWebSocketClose = (event) => {
        console.info('WebSocket 연결이 닫혔습니다:', event);
      };

      socketRef.current.activate();
    };

    setupWebSocket();

    return () => {
      if (socketRef.current !== null) {
        void socketRef.current.deactivate();
      }
    };
  }, [id]);

  const handleSendBid = () => {
    if (id === undefined) {
      console.error('경매 ID가 없습니다.');
      return;
    }
    if (item === undefined) {
      console.error('아이템 정보가 없습니다.');
      return;
    }
    const currentTime = new Date().getTime();
    const endTime = new Date(item.endTime).getTime();
    if (currentTime >= endTime) {
      alert('경매가 종료되었습니다.');
      return;
    }
    const confirmBid = window.confirm(
      `입찰가 ${Math.round(
        Number(price) + item.startingPrice * 0.05,
      )}원으로 입찰하시겠습니까?`,
    );
    if (!confirmBid) {
      return;
    }
    if (socketRef.current !== null) {
      const increasedPrice = Math.round(
        Number(price) + item.startingPrice * 0.05,
      );
      setPrice(increasedPrice);
      const newMessage: AuctionMessage = {
        auctionId: Number(id),
        senderNickname: myNickname,
        price: increasedPrice,
        createdAt: new Date().toISOString(),
      };
      socketRef.current.publish({
        destination: `/app/chat/sendPrice`,
        body: JSON.stringify(newMessage),
      });
    }
  };

  return (
    <div className={styles.main}>
      {item?.seller.nickname === undefined ? (
        <div className={styles.loadingScreen}>
          <div className={styles.loadingBox}></div>
          <div className={styles.profileloading}>
            <div className={styles.loadingcircle}></div>
            <div className={styles.loadingLines}>
              <div className={styles.loadingLine0}></div>
              <div className={styles.loadingLine05}></div>
            </div>
          </div>
          <div className={styles.loadingLine1}></div>
          <div className={styles.loadingLine2}></div>
          <div className={styles.loadingLine3}></div>
        </div>
      ) : (
        <>
          {images.length > 0 && (
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
                <img
                  src={shareicon}
                  className={styles.shareicon}
                  onClick={handleShareClick}
                ></img>
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
                          {isMyItem ? (
                            <>
                              <button
                                onClick={handleDeleteClickWrappper}
                                className={styles.deletebutton}
                              >
                                삭제
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={handleReportClick}
                              className={styles.reportbutton}
                            >
                              신고
                            </button>
                          )}
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
          )}
          <>
            {images.length > 0 ? (
              <div className={styles.imagecontainer} {...handlers}>
                <div
                  className={styles.imagewrapper}
                  style={{
                    transform: `translateX(calc(-${currentImageIndex * 100}vw + ${(images.length - 1) * 50}vw))`,
                    display: 'flex',
                  }}
                >
                  {images.map((src, index) => (
                    <div key={index} className={styles.imageOverlayContainer}>
                      <img
                        src={src}
                        className={
                          styles.image === undefined ? '' : styles.image
                        }
                        alt={`item ${index}`}
                      />
                      <div className={styles.gradientOverlay}></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className={styles.noimageupperbar}>
                <div className={styles.navicons}>
                  <img
                    src={leftarrowblack}
                    className={styles.leftarrowicon}
                    onClick={handleBackClick}
                  ></img>
                  <img
                    src={homeblack}
                    className={styles.homeicon}
                    onClick={handleHomeClick}
                  ></img>
                </div>
                <div className={styles.etcicons}>
                  <img
                    src={shareblack}
                    className={styles.shareicon}
                    onClick={handleShareClick}
                  ></img>
                  <div className={styles.dropdownContainer}>
                    <img
                      src={dotsblack}
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
                            {isMyItem ? (
                              <>
                                <button
                                  onClick={handleDeleteClickWrappper}
                                  className={styles.deletebutton}
                                >
                                  삭제
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={handleReportClick}
                                className={styles.reportbutton}
                              >
                                신고
                              </button>
                            )}
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
            )}
          </>
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
                to={`/profile/${encodeURIComponent(item.seller.nickname)}`}
                className={styles.profile}
              >
                <img
                  src={profileimage === '' ? baseimage : profileimage}
                  className={styles.profileimage}
                ></img>
                <div className={styles.profiletext}>
                  <p className={styles.nickname}>{item.seller.nickname}</p>
                  <p className={styles.address}>{item.seller.location}</p>
                </div>
              </NavLink>

              <div className={styles.mannertempbox}>
                <TemperatureGaugeSmall temperature={item.seller.temperature} />
                <NavLink to={`/temp`} className={styles.temptext}>
                  매너온도
                </NavLink>
              </div>
            </div>
            <div className={styles.itemInfo}>
              <p className={styles.titletext}>{item.title}</p>
              <p
                className={styles.categoryanddate}
              >{`${item.tag} · ${timeLeft}`}</p>
              <p className={styles.article}>
                {item.content.split('\n').map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
              <div className={styles.locationbox}>
                <p className={styles.locationtitle}>거래 희망 장소</p>
                <p className={styles.location}>{item.location}</p>
              </div>
              <p className={styles.chatlikeview}>{`조회 ${item.viewCount}`}</p>
              <NavLink to={`/reportitem`} className={styles.reporttext}>
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
                onClick={handleLikeClickWrappper}
              />
            </div>
            <div className={styles.priceandchat}>
              <div className={styles.pricebox}>
                <div className={styles.currentPrice}>
                  <p>시작 가격: </p>
                  <p className={styles.price}>
                    {`${Intl.NumberFormat('ko-KR').format(item.startingPrice)}원`}
                  </p>
                </div>
                <div className={styles.bidbox}>
                  <p>현재 가격: </p>
                  <p className={styles.price}>
                    {`${Intl.NumberFormat('ko-KR').format(price)}원`}
                  </p>
                  {isHighestBid && (
                    <p className={styles.highestBidText}>현재 최고 입찰!</p>
                  )}
                </div>
              </div>
              <button className={styles.chatbutton} onClick={handleSendBid}>
                입찰하기
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ItemPage;
