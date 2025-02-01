/*
  각 채팅방에 해당하는 페이지.
*/
import { Stomp } from '@stomp/stompjs';
import { Client } from '@stomp/stompjs';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';

import callIcon from '../assets/callicon.svg';
import downarrow from '../assets/down_arrow.svg';
import leftarrow from '../assets/leftarrow.svg';
import baseImage from '../assets/placeholder_gray.png';
import sendIconGray from '../assets/send-gray.svg';
import sendIconOrange from '../assets/send-orange.svg';
import etcIcon from '../assets/three_dots_black.svg';
import Overlay from '../components/Overlay';
//import UpperBar from '../components/UpperBar';
import styles from '../css/ChatRoomPage.module.css';
import type { message } from '../typings/chat';
import type { chatRoomResponse } from '../typings/chat';
import type { Article } from '../typings/item';

const ChatRoomPage = () => {
  const { chatRoomId } = useParams<{ chatRoomId: string }>();
  const [currentInput, setCurrentInput] = useState<string>('');
  const [instant, setInstant] = useState(
    new Date('2030-01-01T00:00:00Z').toISOString(),
  );
  const [messages, setMessages] = useState<message[]>([]);
  const [messageLoading, setMessageLoading] = useState<boolean>(true);
  const [myNickname, setMyNickname] = useState<string | null>('');
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [amIseller, setAmIseller] = useState<boolean>(false);
  const [isInit, setIsInit] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  //const [isFirst, setIsFirst] = useState(false);
  const [rcvdMessage, setRcvdMessage] = useState<message | null>(null);
  const [chatRoomInfo, setChatRoomInfo] = useState<chatRoomResponse | null>(
    null,
  );
  const [itemInfo, setItemInfo] = useState<Article | null>(null);
  const [profileImage, setProfileImage] = useState<string>(
    'https://placehold.co/100',
  );
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const price = 1200000;
  const [formattedPrice, setFormattedPrice] = useState<string>(
    new Intl.NumberFormat('ko-KR').format(price),
  );
  //const [inputMessage, setInputMessage] = useState<string>('');
  const socketRef = useRef<Client | null>(null);
  //const observer = useRef<IntersectionObserver | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  //const myNickname = localStorage.getItem('nickname');
  const navigate = useNavigate();

  /*const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };*/

  const scrollToBottom = (smooth: boolean = true) => {
    if (messagesEndRef.current !== null) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  };

  useEffect(() => {
    if (
      messageContainerRef.current !== null &&
      messagesEndRef.current !== null &&
      !messageLoading
    ) {
      console.info('스크롤을 맨 아래로 이동합니다.');
      setIsInit(true);
      scrollToBottom(false);
    }
  }, [messageLoading]);

  useEffect(() => {
    if (rcvdMessage !== null) {
      scrollToBottom();
    }
  }, [rcvdMessage]);

  const fetchMessages = useCallback(
    async (innerInstant: string) => {
      try {
        if (chatRoomId === undefined) {
          console.error('채팅방 ID가 없습니다.');
          return;
        }
        const token = localStorage.getItem('token');
        if (token === null) {
          throw new Error('토큰이 없습니다.');
        }
        const storedNickname = localStorage.getItem('nickname');
        if (storedNickname === null) {
          throw new Error('닉네임이 없습니다.');
        }

        const response = await fetch(
          `/api/chat/${chatRoomId}?createdAt=${innerInstant}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!response.ok) {
          throw new Error('메시지 가져오기 오류');
        }
        const data = (await response.json()) as chatRoomResponse;
        if (data.chatRoom.article.seller.nickname === storedNickname) {
          setAmIseller(true);
        }
        if (data.chatRoom.article.seller.nickname === storedNickname) {
          if (data.chatRoom.seller.imagePresignedUrl === '') {
            setProfileImage(baseImage);
          } else {
            setProfileImage(data.chatRoom.buyer.imagePresignedUrl);
          }
        } else {
          if (data.chatRoom.buyer.imagePresignedUrl === '') {
            setProfileImage(baseImage);
          } else {
            setProfileImage(data.chatRoom.seller.imagePresignedUrl);
          }
        }
        //console.info('왜 두번 도는거냐고!');
        setChatRoomInfo(data);
        setItemInfo(data.chatRoom.article);
        setFormattedPrice(
          new Intl.NumberFormat('ko-KR').format(data.chatRoom.article.price),
        );
        const sortedData = data.messages.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        setMessages((prevMessages) => [...sortedData, ...prevMessages]);
        setMessageLoading(false);

        if (sortedData[0] !== undefined) {
          setInstant(sortedData[0].createdAt);
        }
      } catch (error) {
        console.error('메시지 가져오기 오류:', error);
      }
    },
    [chatRoomId],
  );

  useEffect(() => {
    void fetchMessages(new Date('2030-01-01T00:00:00Z').toISOString());

    setMyNickname(localStorage.getItem('nickname'));

    const setupWebSocket = () => {
      if (chatRoomId === undefined) {
        console.error('채팅방 ID가 없습니다.');
        return;
      }
      // SockJS 및 Stomp 설정
      //const socket = new SockJS(`http://${window.location.host}/ws`);
      const socket = new SockJS(`https://toykarrot.shop/ws`);
      const stompClient: Client = Stomp.over(() => socket);
      socketRef.current = stompClient;

      socketRef.current.onConnect = () => {
        console.info('WebSocket 연결이 열렸습니다.');

        // 구독 설정
        socketRef.current?.subscribe(`/topic/chat/${chatRoomId}`, (message) => {
          const data: message = JSON.parse(message.body) as message;
          const newMessage: message = {
            ...data,
          };
          setMessages((prevMessages) => [...prevMessages, newMessage]);
          setRcvdMessage(newMessage);
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
  }, [chatRoomId, fetchMessages]);

  const handleSendMessage = (event?: React.FormEvent | React.MouseEvent) => {
    if (event !== undefined) {
      event.preventDefault(); // 기본 동작을 막습니다.
    }

    if (chatRoomId === undefined) {
      console.error('채팅방 ID가 없습니다.');
      return;
    }
    if (
      socketRef.current !== null &&
      currentInput.trim() !== '' &&
      myNickname !== null
    ) {
      const newMessage: message = {
        chatRoomId: Number(chatRoomId), // chatRoomId 추가
        senderNickname: myNickname,
        content: currentInput,
        createdAt: new Date().toISOString(),
      };
      console.info('보낼 메시지:', newMessage);
      setCurrentInput('');
      socketRef.current.publish({
        destination: `/app/chat/sendMessage`,
        body: JSON.stringify(newMessage),
      });
    }
  };

  const handleBackClick = () => {
    void navigate(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentInput(e.target.value);
    if (textareaRef.current != null) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // 높이를 초기화
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  /*const lastMessageRef = useCallback(
    (node: HTMLElement | null) => {
      if (observer.current !== null) observer.current.disconnect();

      if (isInit === 1 && messages.length >= 30) {
        observer.current = new IntersectionObserver((entries) => {
          if (entries[0] !== undefined && entries[0].isIntersecting) {
            if (instant !== '2030-01-01T00:00:00Z') {
              void fetchMessages(instant);
            }
          }
        });
        if (node !== null) observer.current.observe(node);
      }
    },
    [instant, messages.length, fetchMessages, isInit],
  );*/

  const handleScroll = async () => {
    if (isInit && messageContainerRef.current !== null) {
      const { scrollTop } = messageContainerRef.current;
      if (scrollTop === 0) {
        // 스크롤이 맨 위에 도달했을 때 추가 데이터를 로드합니다.
        //console.info('스크롤이 맨 위에 도달했습니다.');
        if (instant !== '2030-01-01T00:00:00Z') {
          const previousScrollHeight = messageContainerRef.current.scrollHeight;
          await fetchMessages(instant);
          setTimeout(() => {
            if (messageContainerRef.current !== null) {
              messageContainerRef.current.scrollTop =
                messageContainerRef.current.scrollHeight - previousScrollHeight;
            }
          }, 0);
        }
      }
    }
  };

  const handelScrollWrapper = () => {
    void handleScroll();
  };

  const handleSendReviewClick = () => {
    if (itemInfo === null) throw new Error('Item is null');
    void navigate(`/sendreview/${itemInfo.id}`);
  };

  const handleStatusClick = () => {
    setIsOverlayOpen(true);
  };

  const handleChangeStatus = (Status: number) => {
    const changeStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token === null) {
          throw new Error('토큰이 없습니다.');
        }
        if (itemInfo === null) {
          throw new Error('아이템 정보가 없습니다.');
        }
        const response = await fetch(`/api/item/status/${itemInfo.id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: Status }),
        });

        if (!response.ok) {
          throw new Error('상태 변경 요청에 실패했습니다.');
        }
      } catch (error) {
        console.error('에러 발생:', error);
      } finally {
        setIsOverlayOpen(false);
      }
    };

    void changeStatus();
  };

  const handleBuyerSelect = async () => {
    if (itemInfo === null) {
      alert('아이템 정보가 없습니다.');
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
          articleId: itemInfo.id,
          buyerId: chatRoomInfo?.chatRoom.buyer.id,
        }),
      });

      if (!response.ok) {
        throw new Error('구매자 정보를 업데이트하지 못했습니다.');
      }

      void navigate(`/sendreview/${itemInfo.id}`);
      //void navigate('/sendreview', { state: { selectedUser } });
    } catch (error) {
      console.error(error);
    }
  };

  const overlayInfo = {
    isOpen: isOverlayOpen,
    closeOverlayFunction: () => {
      setIsOverlayOpen(false);
    },
    overlayButtons: [
      {
        color: 'black',
        text: '판매중',
        function: () => {
          handleChangeStatus(0);
        },
      },
      {
        color: 'black',
        text: '예약중',
        function: () => {
          handleChangeStatus(1);
        },
      },
      {
        color: 'black',
        text: '판매완료',
        function: () => {
          handleChangeStatus(2);
          if (itemInfo === null) throw new Error('Item is null');
          void handleBuyerSelect();
        },
      },
    ],
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
          <p className={styles.opponentnickname}>
            {amIseller
              ? chatRoomInfo?.chatRoom.buyer.nickname
              : chatRoomInfo?.chatRoom.seller.nickname}
          </p>
          <p className={styles.opponenttemp}>
            {amIseller
              ? chatRoomInfo?.chatRoom.buyer.temperature
              : chatRoomInfo?.chatRoom.seller.temperature}
          </p>
        </div>
        <div className={styles.upperbaricons}>
          <img src={callIcon} className={styles.othericons}></img>
          <img src={etcIcon} className={styles.othericons}></img>
        </div>
      </div>
      <div className={styles.iteminfoBox}>
        <div className={styles.iteminfo}>
          <img
            src={
              itemInfo !== null && itemInfo.imagePresignedUrl[0] === ''
                ? itemInfo.imagePresignedUrl[0]
                : 'https://placehold.co/100'
            }
            className={styles.itemimage}
          ></img>
          <div className={styles.itemnameandprice}>
            <div className={styles.itemname}>
              <div
                className={styles.itemstatus}
                onClick={amIseller ? handleStatusClick : undefined}
              >
                <p>
                  {itemInfo?.status === 0
                    ? '판매중'
                    : itemInfo?.status === 1
                      ? '예약중'
                      : itemInfo?.status === 2
                        ? '판매완료'
                        : ''}
                </p>
                {amIseller && (
                  <img src={downarrow} className={styles.downarrow}></img>
                )}
              </div>
              <p>{itemInfo?.title}</p>
            </div>
            <div className={styles.itemprice}>{`${formattedPrice}원`}</div>
          </div>
        </div>
        <div className={styles.buttons}>
          {itemInfo?.status === 0 && (
            <>
              <button className={styles.iteminfoButton}>약속잡기</button>
              <button className={styles.iteminfoButton}>송금요청</button>
              <button className={styles.iteminfoButton}>용달찾기</button>
            </>
          )}
          {itemInfo?.status === 1 && (
            <>
              <button className={styles.iteminfoButton}>약속잡기</button>
              <button className={styles.iteminfoButton}>송금요청</button>
              <button className={styles.iteminfoButton}>용달찾기</button>
              <button
                className={styles.iteminfoButton}
                onClick={handleSendReviewClick}
              >
                후기 보내기
              </button>
            </>
          )}
          {itemInfo?.status === 2 &&
            // 판매완료 상태에서는 아무 버튼도 나타나지 않음
            null}
        </div>
      </div>
      <div
        className={styles.messages}
        ref={messageContainerRef}
        onScroll={handelScrollWrapper}
      >
        {messages.map((message, index) => {
          const nextMessage = messages[index + 1];
          const showTime =
            nextMessage === undefined ||
            new Date(nextMessage.createdAt).toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
            }) !==
              new Date(message.createdAt).toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
              }) ||
            nextMessage.senderNickname !== message.senderNickname;

          const isFirstOpponentMessage =
            message.senderNickname !== myNickname &&
            (index === 0 ||
              (index > 0 && messages[index - 1]?.senderNickname === 'User'));

          return (
            <div
              key={index}
              className={
                message.senderNickname === myNickname
                  ? styles.mymessage
                  : styles.opponentmessage
              }
            >
              {message.senderNickname !== myNickname &&
                (isFirstOpponentMessage ? (
                  <img
                    src={profileImage}
                    className={styles.profileImage}
                    alt="Profile"
                  />
                ) : (
                  <div className={styles.profileImagePlaceholder} />
                ))}
              <p
                className={
                  message.senderNickname === myNickname
                    ? styles.mymessagetext
                    : styles.opponentmessagetext
                }
              >
                {message.content}
              </p>
              <p className={styles.messagetime}>
                {showTime ? formatDate(message.createdAt) : ''}
              </p>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <Overlay overlayInfo={overlayInfo} />
      <form onSubmit={handleSendMessage} className={styles.inputBox}>
        <textarea
          ref={textareaRef}
          className={styles.chatInput}
          placeholder="메시지 보내기"
          value={currentInput}
          onChange={handleInputChange}
          onCompositionStart={() => {
            setIsComposing(true);
          }}
          onCompositionEnd={() => {
            setIsComposing(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          rows={1}
        />
        <button
          type="submit"
          className={styles.sendButton}
          disabled={currentInput.trim() === ''}
        >
          <img
            src={currentInput.trim() === '' ? sendIconGray : sendIconOrange}
            style={{ height: '24px' }}
          />
        </button>
      </form>
    </div>
  );
};

export default ChatRoomPage;
