/*
  동네생활의 각 게시글 페이지.
*/
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

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
import styles from '../css/CommunityPostPage.module.css';
import type { CommunityPost } from '../typings/communityPost';
import { handleShareClick } from '../utils/eventhandlers';
import { getTimeAgo } from '../utils/utils';

const CommunityPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<CommunityPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortComment, setSortComment] = useState<'old' | 'new'>('old');
  const [currentInput, setCurrentInput] = useState<string>('');
  const isLiked = Math.random() < 0.5; // 임시로 설정, 추후에는 user id와 게시글에 like한 아이디를 대조해서 설정

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        if (id === undefined) throw new Error('id is undefined!');
        const response = await fetch(
          `https://b866fe16-c4c5-4989-bdc9-5a783448ec03.mock.pstmn.io/community/${id}`,
        );
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

  const postUser = useMemo(() => {
    if (post === null) return null;
    return post.users[post.user_id] ?? null;
  }, [post]);

  const commentsWithUserInfo = useMemo(() => {
    if (post === null) return [];
    return post.comments.map((comment) => ({
      ...comment,
      commentUser: post.users[comment.user_id],
    }));
  }, [post]);

  const handleLikeClick = () => {
    console.info('like + 1');
  };

  const handleSendClick = () => {
    console.info(currentInput.trim());
    setCurrentInput('');
  };

  return (
    <div className={styles.main}>
      <div className={styles.upperBar}>
        <img
          src={leftArrow}
          className={styles.upperIcon}
          onClick={() => {
            void navigate(-1);
          }}
        />
        <div className={styles.upperBarIcons}>
          <img src={disabledBell} className={styles.upperIcon} />
          <img
            src={shareIcon}
            className={styles.upperIcon}
            onClick={handleShareClick}
          />
          <img src={dotsIcon} className={styles.upperIcon} />
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
                src={postUser?.profile_picture ?? placeHolder}
                className={styles.profilePic}
              />
              <div>
                <p className={styles.nickname}>{postUser?.nickname}</p>
                <p className={styles.profileInfo}>
                  {postUser?.location} · {getTimeAgo(post.time)}
                </p>
              </div>
            </div>
            <p className={styles.postTitle}>{post.title}</p>
            <p className={styles.postBody}>
              {post.body.split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
            <div className={styles.viewBox}>
              <img src={eyeIcon} style={{ height: '20px' }} />
              <p>{post.views}명이 봤어요</p>
            </div>
            <button
              className={isLiked ? styles.likeButton_liked : styles.likeButton}
              onClick={handleLikeClick}
            >
              <img src={likeIcon} style={{ height: '16px' }} />
              {post.likes === 0 ? (
                <span>공감하기</span>
              ) : (
                <span>{post.likes}</span>
              )}
            </button>
          </div>
          <div className={styles.separator} />
          <div className={styles.commentBox}>
            <p>댓글 {commentsWithUserInfo.length}</p>
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
          {commentsWithUserInfo
            .sort((a, b) => {
              if (sortComment === 'old')
                return a.time < b.time ? -1 : a.time > b.time ? 1 : 0;
              else return a.time > b.time ? -1 : a.time < b.time ? 1 : 0;
            })
            .map((Comment, index) => (
              <CommentItem
                key={index}
                CommentInfo={Comment}
                userInfo={Comment.commentUser}
              />
            ))}
        </div>
      )}
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
