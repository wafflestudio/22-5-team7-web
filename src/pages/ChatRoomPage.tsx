/*
  각 채팅방에 해당하는 페이지.
*/
import { Stomp } from '@stomp/stompjs';
import { Client } from '@stomp/stompjs';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';

import callIcon from '../assets/callicon.svg';
import leftarrow from '../assets/leftarrow.svg';
import sendIconGray from '../assets/send-gray.svg';
import sendIconOrange from '../assets/send-orange.svg';
import etcIcon from '../assets/three_dots_black.svg';
//import UpperBar from '../components/UpperBar';
import styles from '../css/ChatRoomPage.module.css';

type message = {
  chatRoomId: number;
  senderNickname: string;
  content: string;
  createdAt: string;
};

const ChatRoomPage = () => {
  const { chatRoomId } = useParams<{ chatRoomId: string }>();
  const [currentInput, setCurrentInput] = useState<string>('');
  const [messages, setMessages] = useState<message[]>([]);
  const [myNickname, setMyNickname] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const profileImage = 'https://placehold.co/100';
  const price = 1200000;
  const formattedPrice = new Intl.NumberFormat('ko-KR').format(price);
  //const [inputMessage, setInputMessage] = useState<string>('');
  const socketRef = useRef<Client | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedNickname = localStorage.getItem('nickname');
    if (storedNickname !== null) {
      setMyNickname(storedNickname);
    }

    const fetchMessages = async () => {
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
        const response = await fetch(`/api/chat/${chatRoomId}`, {
          //const response = await fetch(`/api/chat/${chatRoomId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('메시지 가져오기 오류');
        }
        const data = (await response.json()) as message[];
        setMessages(data);
      } catch (error) {
        console.error('메시지 가져오기 오류:', error);
      }
    };

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

    void fetchMessages().then(setupWebSocket);

    return () => {
      if (socketRef.current !== null) {
        void socketRef.current.deactivate();
      }
    };
  }, [chatRoomId]);

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

  return (
    <div className={styles.main}>
      <div className={styles.upperbar}>
        <img
          src={leftarrow}
          className={styles.icon}
          onClick={handleBackClick}
        ></img>
        <div className={styles.opponentinfo}>
          <p className={styles.opponentnickname}>이룸이</p>
          <p className={styles.opponenttemp}>47.9°C</p>
        </div>
        <div className={styles.upperbaricons}>
          <img src={callIcon} className={styles.othericons}></img>
          <img src={etcIcon} className={styles.othericons}></img>
        </div>
      </div>
      <div className={styles.iteminfo}>
        <img src="https://placehold.co/100" className={styles.itemimage}></img>
        <div className={styles.itemnameandprice}>
          <div className={styles.itemname}>
            <p className={styles.itemstatus}>예약중</p>
            <p>AA 배터리</p>
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
