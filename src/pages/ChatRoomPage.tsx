/*
  각 채팅방에 해당하는 페이지.
*/
import { Stomp } from '@stomp/stompjs';
import { Client } from '@stomp/stompjs';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';

import callIcon from '../assets/callicon.svg';
import leftarrow from '../assets/leftarrow.svg';
import sendIconGray from '../assets/send-gray.svg';
import sendIconOrange from '../assets/send-orange.svg';
import etcIcon from '../assets/three_dots_black.svg';
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
  const [myNickname, setMyNickname] = useState<string>('');
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
  const observer = useRef<IntersectionObserver | null>(null);
  const navigate = useNavigate();

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
        setProfileImage(data.article.seller.imagePresignedUrl);
        setItemInfo(data.article);
        setFormattedPrice(
          new Intl.NumberFormat('ko-KR').format(data.article.price),
        );
        const sortedData = data.messages.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        setMessages((prevMessages) => [...sortedData, ...prevMessages]);

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
    const storedNickname = localStorage.getItem('nickname');
    if (storedNickname !== null) {
      setMyNickname(storedNickname);
    }

    void fetchMessages(new Date('2030-01-01T00:00:00Z').toISOString());

    /*const fetchMessages = async () => {
      if (chatRoomId === undefined) {
        console.error('채팅방 ID가 없습니다.');
        return;
      }
      console.info('채팅방 ID:', chatRoomId);

      try {
        const token = localStorage.getItem('token');
        if (token === null) {
          throw new Error('토큰이 없습니다.');
        }

        const response = await fetch(
          `/api/chat/${chatRoomId}?createdAt=${instant}`,
          {
            //const response = await fetch(`/api/chat/${chatRoomId}`, {
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
        const data = (await response.json()) as message[];
        const sortedData = data.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        setMessages((prevMessages) => [...sortedData, ...prevMessages]);

        if (sortedData[0] !== undefined) {
          setInstant(sortedData[0].createdAt);
        }
      } catch (error) {
        console.error('메시지 가져오기 오류:', error);
      }
    };*/

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

  const handleSendMessage = () => {
    if (chatRoomId === undefined) {
      console.error('채팅방 ID가 없습니다.');
      return;
    }
    if (socketRef.current !== null && currentInput.trim() !== '') {
      const newMessage: message = {
        chatRoomId: Number(chatRoomId), // chatRoomId 추가
        senderNickname: myNickname,
        content: currentInput,
        createdAt: new Date().toISOString(),
      };
      console.info('보낼 메시지:', newMessage);
      socketRef.current.publish({
        destination: `/app/chat/sendMessage`,
        body: JSON.stringify(newMessage),
      });
      setCurrentInput('');
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

  const lastMessageRef = useCallback(
    (node: HTMLElement | null) => {
      if (observer.current !== null) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0] !== undefined && entries[0].isIntersecting) {
          void fetchMessages(instant);
        }
      });
      if (node !== null) observer.current.observe(node);
    },
    [instant, fetchMessages],
  );

  return (
    <div className={styles.main}>
      <div className={styles.upperbar}>
        <img
          src={leftarrow}
          className={styles.icon}
          onClick={handleBackClick}
        ></img>
        <div className={styles.opponentinfo}>
          <p className={styles.opponentnickname}>{itemInfo?.seller.nickname}</p>
          <p className={styles.opponenttemp}>{itemInfo?.seller.temperature}</p>
        </div>
        <div className={styles.upperbaricons}>
          <img src={callIcon} className={styles.othericons}></img>
          <img src={etcIcon} className={styles.othericons}></img>
        </div>
      </div>
      <div className={styles.iteminfo}>
        <img
          src={
            itemInfo === null
              ? 'https://placehold.co/100'
              : itemInfo.imagePresignedUrl[0]
          }
          className={styles.itemimage}
        ></img>
        <div className={styles.itemnameandprice}>
          <div className={styles.itemname}>
            <p className={styles.itemstatus}>
              {itemInfo?.status === 0 ? (
                ''
              ) : (
                <span
                  className={
                    itemInfo?.status === 1
                      ? styles.reserveStatus
                      : styles.soldStatus
                  }
                >
                  {itemInfo?.status === 1 ? '예약중' : '거래완료'}
                </span>
              )}
            </p>
            <p>{itemInfo?.title}</p>
          </div>
          <div className={styles.itemprice}>{`${formattedPrice}원`}</div>
        </div>
      </div>
      <div className={styles.messages}>
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
              ref={index === 0 ? lastMessageRef : null}
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
      </div>
      <div className={styles.inputBox}>
        <div className={styles.inputtext}>
          <textarea
            ref={textareaRef}
            className={styles.chatInput}
            placeholder="메시지 보내기"
            value={currentInput}
            onChange={handleInputChange}
            rows={1}
          />
        </div>
        <button
          className={styles.sendButton}
          onClick={handleSendMessage}
          disabled={currentInput.trim() === ''}
        >
          <img
            src={currentInput.trim() === '' ? sendIconGray : sendIconOrange}
            style={{ height: '24px' }}
          />
        </button>
      </div>
    </div>
  );
};

export default ChatRoomPage;
