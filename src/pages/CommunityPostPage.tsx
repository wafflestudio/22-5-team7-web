/*
  동네생활의 각 게시글 페이지.
*/
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';

import eyeIcon from '../assets/eye-gray.svg';
import leftArrow from '../assets/leftarrow.svg';
import likeIcon from '../assets/like-gray.svg';
import communityIcon from '../assets/navbar/navbar-community-gray.svg';
import placeHolder from '../assets/placeholder_gray.png';
import sendIconGray from '../assets/send-gray.svg';
import sendIconOrange from '../assets/send-orange.svg';
import shareIcon from '../assets/share.svg';
import dotsIcon from '../assets/three_dots_black.svg';
import disabledBell from '../assets/upperbar-bell-disabled.svg';
import CommentItem from '../components/CommentItem';
import Loader from '../components/Loader';
import Overlay from '../components/Overlay';
import styles from '../css/CommunityPostPage.module.css';
import type { CommunityPost } from '../typings/communityPost';
import type { LocationState } from '../typings/toolBar';
import { getTimeAgo } from '../utils/utils';

const CommunityPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [post, setPost] = useState<CommunityPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortComment, setSortComment] = useState<'old' | 'new'>('old');
  const [currentInput, setCurrentInput] = useState<string>('');
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const isLiked = Math.random() < 0.5; // 임시로 설정, 추후에는 user id와 게시글에 like한 아이디를 대조해서 설정

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (token === null) throw new Error('토큰이 없습니다.');
        if (id === undefined) throw new Error('id is undefined!');

        const response = await fetch(`/api/feed/get/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch post: ${response.statusText}`);
        }

        const data = (await response.json()) as CommunityPost;
        setPost(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    void fetchPost();
  }, [id]);

  const handleBackClick = () => {
    const locationState = location.state as LocationState;

    if (locationState !== null && locationState.from === 'communitypost') {
      void navigate(-2);
    } else {
      void navigate(-1);
    }
  };

  const deletePost = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token === null) throw new Error('토큰이 없습니다.');
      if (id === undefined) throw new Error('게시글 정보가 없습니다.');

      const response = await fetch(`/api/feed/delete/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('삭제 요청에 실패했습니다.');
      }

      console.info('삭제 성공!');
      void navigate('/community');
    } catch (err) {
      console.error('삭제 중 에러 발생:', err);
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
        text: '수정',
        function: () => {
          console.info('수정하기');
        },
      },
      {
        color: 'red',
        text: '삭제',
        function: () => {
          setIsOverlayOpen(false);
          if (window.confirm('정말 삭제하시겠습니까?')) {
            void deletePost();
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
        if (id === undefined) throw new Error('게시글 정보가 없습니다.');

        const response = await fetch(
          isLiked ? `/api/feed/like/${id}` : `/api/feed/unlike/${id}`,
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

  const handleSendClick = () => {
    const postComment = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token === null) throw new Error('No token found');

        if (id === undefined) throw new Error('id is undefined!');
        const response = await fetch(`/api/comment/post/${id}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: currentInput.trim(),
          }),
        });

        if (!response.ok) {
          throw new Error('댓글 작성 중 오류가 발생했습니다.');
        }
      } catch (err) {
        console.error('에러 발생:', err);
      }
    };

    void postComment();
    setCurrentInput('');
  };

  return (
    <div className={styles.main}>
      <div className={styles.upperBar}>
        <img
          src={leftArrow}
          className={styles.upperIcon}
          onClick={handleBackClick}
        />
        <div className={styles.upperBarIcons}>
          <img src={disabledBell} className={styles.upperIcon} />
          <img src={shareIcon} className={styles.upperIcon} />
          <img
            src={dotsIcon}
            className={styles.upperIcon}
            onClick={handleDotsClick}
          />
        </div>
      </div>
      {loading ? (
        <Loader marginTop="40vh" />
      ) : error !== null ? (
        <p>Error: {error}</p>
      ) : post === null ? (
        <p>해당 글을 찾을 수 없습니다.</p>
      ) : (
        <div className={styles.contentBox}>
          <div className={styles.postBox}>
            <div className={styles.postTag}>
              <img src={communityIcon} style={{ height: '14px' }} />
              맛집
            </div>
            <div className={styles.profileBox}>
              <img
                src={
                  post.author.imagePresignedUrl === ''
                    ? placeHolder
                    : post.author.imagePresignedUrl
                }
                className={styles.profilePic}
              />
              <div>
                <p className={styles.nickname}>{post.author.nickname}</p>
                <p className={styles.profileInfo}>
                  {post.author.location} · {getTimeAgo(post.createdAt)}
                </p>
              </div>
            </div>
            <p className={styles.postTitle}>{post.title}</p>
            <p className={styles.postBody}>
              {post.content.split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
            {post.imagePresignedUrl.map((url, index) => (
              <img key={index} src={url} className={styles.postImage} />
            ))}
            <div className={styles.viewBox}>
              <img src={eyeIcon} style={{ height: '20px' }} />
              <p>{post.viewCount}명이 봤어요</p>
            </div>
            <button
              className={isLiked ? styles.likeButton_liked : styles.likeButton}
              onClick={handleLikeClick}
            >
              <img src={likeIcon} style={{ height: '16px' }} />
              {post.likeCount === 0 ? (
                <span>공감하기</span>
              ) : (
                <span>{post.likeCount}</span>
              )}
            </button>
          </div>
          <div className={styles.separator} />
          <div className={styles.commentBox}>
            <p>댓글 {post.commentList.length}</p>
            <div className={styles.sortButtons}>
              <p
                className={
                  sortComment === 'old'
                    ? styles.activeSort
                    : styles.inactiveSort
                }
                onClick={() => {
                  setSortComment('old');
                }}
              >
                등록순
              </p>
              <p
                className={
                  sortComment === 'new'
                    ? styles.activeSort
                    : styles.inactiveSort
                }
                onClick={() => {
                  setSortComment('new');
                }}
              >
                최신순
              </p>
            </div>
          </div>
          {post.commentList
            .sort((a, b) => {
              if (sortComment === 'old')
                return a.createdAt < b.createdAt
                  ? -1
                  : a.createdAt > b.createdAt
                    ? 1
                    : 0;
              else
                return a.createdAt > b.createdAt
                  ? -1
                  : a.createdAt < b.createdAt
                    ? 1
                    : 0;
            })
            .map((Comment, index) => (
              <CommentItem key={index} CommentInfo={Comment} />
            ))}
        </div>
      )}
      <Overlay overlayInfo={overlayInfo} />
      <div className={styles.inputBox}>
        <input
          type="text"
          className={styles.commentInput}
          placeholder="댓글을 입력해주세요."
          value={currentInput}
          onChange={(e) => {
            setCurrentInput(e.target.value);
          }}
        />
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

export default CommunityPostPage;
