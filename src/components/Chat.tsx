import { useNavigate } from 'react-router-dom';

import styles from '../css/Chat.module.css';
import type { chatItem } from '../typings/chat';
import { getTimeAgo } from '../utils/utils';

interface ChatProps {
  chatItem: chatItem;
}

const Chat: React.FC<ChatProps> = ({ chatItem }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    void navigate(`/chat/${chatItem.id}`);
  };

  return (
    <div className={styles.main} onClick={handleClick}>
      <div className={styles.chatimage}>
        <img
          src={chatItem.seller.imagePresignedUrl}
          className={styles.profileimage}
        ></img>
        <img
          src={chatItem.article.imagePresignedUrl[0]}
          className={styles.itemimage}
        ></img>
      </div>
      <div className={styles.chatinfo}>
        <div className={styles.basicinfo}>
          <p className={styles.nickname}>{chatItem.buyer.nickname}</p>
          <p
            className={styles.placeanddate}
          >{`${chatItem.seller.location} · ${getTimeAgo(chatItem.updatedAt)}`}</p>
        </div>
        <div className={styles.chatmessage}>{chatItem.chatMessage}</div>
      </div>
    </div>
  );
};

export default Chat;
