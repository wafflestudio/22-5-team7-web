/*
  각 채팅방에 해당하는 페이지.
*/
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import callIcon from '../assets/callicon.svg';
import leftarrow from '../assets/leftarrow.svg';
import sendIconGray from '../assets/send-gray.svg';
import sendIconOrange from '../assets/send-orange.svg';
import etcIcon from '../assets/three_dots_black.svg';
//import UpperBar from '../components/UpperBar';
import styles from '../css/ChatRoomPage.module.css';

type message = {
  sender: string;
  text: string;
  time: number;
};

const ChatRoomPage = () => {
  const [currentInput, setCurrentInput] = useState<string>('');
  const [messages, setMessages] = useState<message[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const profileImage = 'https://via.placeholder.com/100';
  const price = 1200000;
  const formattedPrice = new Intl.NumberFormat('ko-KR').format(price);
  //const [inputMessage, setInputMessage] = useState<string>('');
  const socketRef = useRef<WebSocket | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // WebSocket 연결 설정
    socketRef.current = new WebSocket('ws://your-websocket-url'); // 실제 WebSocket URL로 변경하세요

    socketRef.current.onopen = () => {
      console.info('WebSocket 연결이 열렸습니다.');
    };

    socketRef.current.onmessage = (event) => {
      const data: message = JSON.parse(event.data as string) as message;
      const newMessage: message = {
        sender: data.sender,
        text: data.text,
        time: data.time,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    socketRef.current.onclose = () => {
      console.info('WebSocket 연결이 닫혔습니다.');
    };

    return () => {
      if (socketRef.current !== null) {
        socketRef.current.close();
      }
    };
  }, []);

  /*const sendMessage = () => {
    if (socketRef.current !== null && inputMessage.trim() !== '') {
      socketRef.current.send(inputMessage);
      setInputMessage('');
    }
  };*/

  const handleBackClick = () => {
    void navigate(-1);
  };

  const handleSendClick = () => {
    if (currentInput.trim() !== '') {
      const newMessage: message = {
        sender: 'User2',
        text: currentInput,
        time: Date.now(),
      };
      setMessages([...messages, newMessage]);
      setCurrentInput('');
      if (textareaRef.current !== null) {
        textareaRef.current.style.height = 'auto'; // 높이를 초기화
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentInput(e.target.value);
    if (textareaRef.current != null) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // 높이를 초기화
    }
  };

  const formatDate = (timestamp: number) => {
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
          onClick={() => void navigate(-1)}

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
        <img
          src="https://via.placeholder.com/100"
          className={styles.itemimage}
        ></img>
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
            new Date(nextMessage.time).toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
            }) !==
              new Date(message.time).toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
              }) ||
            nextMessage.sender !== message.sender;

          const isFirstOpponentMessage =
            message.sender !== 'User' &&
            (index === 0 ||
              (index > 0 && messages[index - 1]?.sender === 'User'));

          return (
            <div
              key={index}
              className={
                message.sender === 'User'
                  ? styles.mymessage
                  : styles.opponentmessage
              }
            >
              {message.sender !== 'User' &&
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
                  message.sender === 'User'
                    ? styles.mymessagetext
                    : styles.opponentmessagetext
                }
              >
                {message.text}
              </p>
              <p className={styles.messagetime}>
                {showTime ? formatDate(message.time) : ''}
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
          onClick={handleSendClick}
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
