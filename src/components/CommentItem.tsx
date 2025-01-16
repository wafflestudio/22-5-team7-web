/*
  각 댓글 item을 나타내는 component.
*/
import likeGrayIcon from '../assets/like-gray.svg';
import likeOrangeIcon from '../assets/like-orange.svg';
import placeHolder from '../assets/placeholder_gray.png';
import styles from '../css/CommentItem.module.css';
import type { CommentProps } from '../typings/communityPost';
import { getTimeAgo } from '../utils/utils';

const Comment = ({ CommentInfo }: CommentProps) => {
  const tempLiked = Math.random() < 0.5; // 임시로 설정, 추후에는 user가 댓글에 좋아요 했는지 확인해서 설정

  const handleLikeClick = () => {
    const likeComment = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token === null) throw new Error('No token found');

        const response = await fetch(
          tempLiked
            ? `/api/comment/like/${CommentInfo.id}`
            : `/api/comment/unlike/${CommentInfo.id}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error('댓글 좋아요/싫어요에 실패하였습니다.');
        }
      } catch (err) {
        console.error('에러 발생:', err);
      }
    };

    void likeComment();
  };

  return (
    <div className={styles.main}>
      <img
        src={
          CommentInfo.user.imagePresignedUrl === ''
            ? placeHolder
            : CommentInfo.user.imagePresignedUrl
        }
        className={styles.profilePic}
      />
      <div className={styles.contentBox}>
        <p className={styles.nickname}>{CommentInfo.user.nickname}</p>
        <p className={styles.commentInfo}>
          {CommentInfo.user.location} · {getTimeAgo(CommentInfo.createdAt)}
        </p>
        <p className={styles.commentBody}>{CommentInfo.content}</p>
        <div className={styles.buttonBox}>
          <div className={styles.likeButton} onClick={handleLikeClick}>
            <img
              src={tempLiked ? likeOrangeIcon : likeGrayIcon}
              style={{ height: '16px' }}
            />
            좋아요
            <span>
              {CommentInfo.commentLikesCount === 0
                ? ''
                : CommentInfo.commentLikesCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
