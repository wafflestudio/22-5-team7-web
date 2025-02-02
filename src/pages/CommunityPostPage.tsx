/*
  동네생활의 각 게시글 페이지.
*/
import { useCallback, useEffect, useState } from 'react';
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
import { handleShareClick } from '../utils/eventhandlers';
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
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);
  const myNickname = localStorage.getItem('nickname');

  const fetchPost = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (token === null) throw new Error('토큰이 없습니다.');
      if (id === undefined) throw new Error('id is undefined!');

      const response = await fetch(
        `/api/feed/get/${id}`,
        //`https://b866fe16-c4c5-4989-bdc9-5a783448ec03.mock.pstmn.io/community/${id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch post: ${response.statusText}`);
      }

      const data = (await response.json()) as CommunityPost;
      setPost(data);
      setIsLiked(data.isLiked);
      setLikeCount(data.likeCount);
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchPost();
  }, [fetchPost]);

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
    overlayButtons:
      post?.author.nickname === myNickname
        ? [
            {
              color: 'black',
              text: '수정',
              function: () => {
                setIsOverlayOpen(false);
                if (id !== undefined) void navigate(`/community/edit/${id}`);
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
          ]
        : [
            {
              color: 'red',
              text: '신고',
              function: () => {
                setIsOverlayOpen(false);
              },
            },
          ],
  };

  const handleDotsClick = () => {
    setIsOverlayOpen(true);
  };

  const handleLikeClick = () => {
    const likePost = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token === null) throw new Error('No token found');
        if (id === undefined) throw new Error('게시글 정보가 없습니다.');

        if (isLiked) {
          const response = await fetch(`/api/feed/unlike/${id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('좋아요 취소 요청에 실패하였습니다.');
          }

          setIsLiked(false);
          setLikeCount(likeCount - 1);
        } else {
          const response = await fetch(`/api/feed/like/${id}`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('좋아요 요청에 실패하였습니다.');
          }

          setIsLiked(true);
          setLikeCount(likeCount + 1);
        }
      } catch (err) {
        console.error('에러 발생:', err);
      }
    };

    void likePost();
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

        await fetchPost();
        setCurrentInput('');
      } catch (err) {
        console.error('에러 발생:', err);
      }
    };

    void postComment();
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
          <img
            src={shareIcon}
            className={styles.upperIcon}
            onClick={handleShareClick}
          />
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
        <p style={{ marginTop: '40vh' }}>Error: {error}</p>
      ) : post === null ? (
        <p>해당 글을 찾을 수 없습니다.</p>
      ) : (
        <div className={styles.contentBox}>
          <div className={styles.postBox}>
            <div className={styles.postTag}>
              <img src={communityIcon} style={{ height: '14px' }} />
              {post.tag}
            </div>
            <div
              className={styles.profileBox}
              onClick={() =>
                void navigate(
                  `/profile/${encodeURIComponent(post.author.nickname)}`,
                )
              }
            >
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
              <p>{post.viewCount}</p>
            </div>
            <button
              className={isLiked ? styles.likeButton_liked : styles.likeButton}
              onClick={handleLikeClick}
            >
              <img src={likeIcon} style={{ height: '16px' }} />
              {likeCount === 0 ? (
                <span>공감하기</span>
              ) : (
                <span>{likeCount}</span>
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
              <CommentItem
                key={index}
                CommentInfo={Comment}
                onCommentEdit={() => {
                  void fetchPost();
                }}
              />
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
