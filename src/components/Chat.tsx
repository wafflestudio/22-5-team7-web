import { useNavigate } from 'react-router-dom';

import placeholder from '../assets/placeholder_gray.png';
import styles from '../css/Chat.module.css';
import type { chatItem } from '../typings/chat';
import { getTimeAgo } from '../utils/utils';

interface ChatProps {
  chatItem: chatItem;
}

const Chat: React.FC<ChatProps> = ({ chatItem }) => {
  const navigate = useNavigate();
  const myNickname = localStorage.getItem('nickname');

  const handleClick = () => {
    void navigate(`/chat/${chatItem.id}`);
  };

  return (
    <div className={styles.main} onClick={handleClick}>
      <div className={styles.chatimage}>
        <img
          src={
            chatItem.seller.imagePresignedUrl === ''
              ? placeholder
              : chatItem.seller.imagePresignedUrl
          }
          className={styles.profileimage}
        ></img>
        <img
          src={
            chatItem.article.imagePresignedUrl.length === 0
              ? placeholder
              : chatItem.article.imagePresignedUrl[0]
          }
          className={styles.itemimage}
        ></img>
      </div>
      <div className={styles.chatinfo}>
        <div className={styles.basicinfo}>
          <p className={styles.nickname}>
            {chatItem.buyer.nickname === myNickname
              ? chatItem.seller.nickname
              : chatItem.buyer.nickname}
          </p>
          <p className={styles.placeanddate}>{`${
            chatItem.buyer.nickname === myNickname
              ? chatItem.seller.location
              : chatItem.buyer.location
          } · ${getTimeAgo(chatItem.updatedAt)}`}</p>
        </div>
        <div className={styles.chatmessage}>{chatItem.chatMessage}</div>
      </div>
    </div>
  );
};

export default Chat;
