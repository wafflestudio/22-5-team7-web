import { useNavigate } from 'react-router-dom';

import styles from '../css/Chat.module.css';

interface ChatProps {
  id: string;
}

const Chat: React.FC<ChatProps> = ({ id }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    void navigate(`/chat/${id}`);
  };

  return (
    <div className={styles.main} onClick={handleClick}>
      <div className={styles.chatimage}>
        <img
          src="https://via.placeholder.com/100"
          className={styles.profileimage}
        ></img>
        <img
          src="https://via.placeholder.com/100"
          className={styles.itemimage}
        ></img>
      </div>
      <div className={styles.chatinfo}>
        <div className={styles.basicinfo}>
          <p className={styles.nickname}>안녕</p>
          <p className={styles.placeanddate}>{`대학동 · 2달전`}</p>
        </div>
        <div className={styles.chatmessage}>3번 출구 앞입니다</div>
      </div>
    </div>
  );
};

export default Chat;
