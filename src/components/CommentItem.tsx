/*
  각 댓글 item을 나타내는 component.
*/
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import likeGrayIcon from '../assets/like-gray.svg';
import likeOrangeIcon from '../assets/like-orange.svg';
import placeHolder from '../assets/placeholder_gray.png';
import dotsIcon from '../assets/three_dots-gray.svg';
import styles from '../css/CommentItem.module.css';
import type { CommentProps } from '../typings/communityPost';
import { getTimeAgo } from '../utils/utils';
import CommentEditWindow from './CommentEditWindow';
import Overlay from './Overlay';

const Comment = ({ CommentInfo }: CommentProps) => {
  const [isOverlayOpen, setIsOverlayOpen] = useState<boolean>(false);
  const [isCommentEditOpen, setIsCommentEditOpen] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(CommentInfo.isLiked);
  const [likeCount, setLikeCount] = useState<number>(
    CommentInfo.commentLikesCount,
  );
  const navigate = useNavigate();

  const nickname = localStorage.getItem('nickname');

  const handleProfileNavigate = () => {
    void navigate(`/profile/${CommentInfo.user.nickname}`);
  };

  const deleteComment = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token === null) {
        throw new Error('토큰이 없습니다.');
      }
      const response = await fetch(`/api/comment/delete/${CommentInfo.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('삭제 요청에 실패했습니다.');
      }
    } catch (error) {
      console.error('삭제 중 에러 발생:', error);
    }
  };

  const overlayInfo = {
    isOpen: isOverlayOpen,
    closeOverlayFunction: () => {
      setIsOverlayOpen(false);
    },
    overlayButtons:
      nickname === CommentInfo.user.nickname
        ? [
            {
              color: 'black',
              text: '수정',
              function: () => {
                setIsOverlayOpen(false);
                setIsCommentEditOpen(true);
              },
            },
            {
              color: 'red',
              text: '삭제',
              function: () => {
                setIsOverlayOpen(false);
                if (window.confirm('정말 삭제하시겠습니까?')) {
                  void deleteComment();
                }
              },
            },
          ]
        : [
            {
              color: 'red',
              text: '신고',
              function: () => {
                setIsOverlayOpen(false);
                if (window.confirm('정말 신고하시겠습니까?')) {
                  console.info('아직 신고는 안돼요~');
                }
              },
            },
          ],
  };

  const handleDotsClick = () => {
    setIsOverlayOpen(true);
  };

  const handleLikeClick = () => {
    const likeComment = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token === null) throw new Error('No token found');

        if (isLiked) {
          const response = await fetch(
            `/api/comment/unlike/${CommentInfo.id}`,
            {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            },
          );

          if (!response.ok) {
            throw new Error('댓글 좋아요 취소 요청에 실패하였습니다.');
          }
          setLikeCount(likeCount - 1);
        } else {
          const response = await fetch(`/api/comment/like/${CommentInfo.id}`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('댓글 좋아요 요청에 실패하였습니다.');
          }
          setLikeCount(likeCount + 1);
        }

        setIsLiked(!isLiked);
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
        onClick={handleProfileNavigate}
      />
      <div className={styles.contentBox}>
        <div className={styles.upperBox}>
          <div className={styles.profileBox} onClick={handleProfileNavigate}>
            <p className={styles.nickname}>{CommentInfo.user.nickname}</p>
            <p className={styles.commentInfo}>
              {CommentInfo.user.location} · {getTimeAgo(CommentInfo.createdAt)}
            </p>
          </div>
          <img
            src={dotsIcon}
            className={styles.dotsIcon}
            onClick={handleDotsClick}
          />
        </div>
        <p className={styles.commentBody}>{CommentInfo.content}</p>
        <div className={styles.buttonBox}>
          <div className={styles.likeButton} onClick={handleLikeClick}>
            <img
              src={isLiked ? likeOrangeIcon : likeGrayIcon}
              style={{ height: '16px' }}
            />
            좋아요
            <span>{likeCount === 0 ? '' : likeCount}</span>
          </div>
        </div>
      </div>
      <Overlay overlayInfo={overlayInfo} />
      {isCommentEditOpen && (
        <CommentEditWindow
          CommentInfo={CommentInfo}
          closeWindow={() => {
            setIsCommentEditOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Comment;
