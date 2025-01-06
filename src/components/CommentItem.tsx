import likeIcon from '../assets/like-gray.svg';
import placeHolder from '../assets/placeholder_gray.png';
import styles from '../css/CommentItem.module.css';
import type { CommentProps } from '../typings/communityPost';
import { getTimeAgo } from '../utils/utils';

const Comment = ({ CommentInfo, userInfo }: CommentProps) => {
  const handleLikeClick = () => {
    console.info('comment like + 1');
  };

  return (
    <div className={styles.main}>
      <img
        src={userInfo?.profile_picture ?? placeHolder}
        className={styles.profilePic}
      />
      <div className={styles.contentBox}>
        <p className={styles.nickname}>{userInfo?.nickname}</p>
        <p className={styles.commentInfo}>
          {userInfo?.location} · {getTimeAgo(CommentInfo.time)}
        </p>
        <p className={styles.commentBody}>{CommentInfo.body}</p>
        <div className={styles.buttonBox}>
          <div className={styles.likeButton} onClick={handleLikeClick}>
            <img src={likeIcon} style={{ height: '16px' }} />
            좋아요
            <span>{CommentInfo.likes === 0 ? '' : CommentInfo.likes}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
