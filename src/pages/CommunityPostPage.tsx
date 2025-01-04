/*
  동네생활의 각 게시글 페이지.
*/
import { useState } from 'react';
import { NavLink } from 'react-router';

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
import styles from '../css/CommunityPostPage.module.css';
import { getTimeAgo } from '../utils/utils';

const tempCommunityPostInfo = {
  id: '1',
  tag: '동네친구',
  title: '저녁 같이 드실 분?',
  body: `저는 대학동 사는데 오늘 저녁 같이 드실 분 구해요~!!!
  햄버거 생각중이에요 ㅎㅎ`,
  user_id: 'hobak123',
  nickname: '단호한 호박',
  location: '대학동',
  time: '2024-12-21T10:00:00Z',
  views: 9,
  likes: 2,
  comments: [
    {
      nickname: '배고픈사람',
      location: '청룡동',
      time: '2024-12-28T12:00:00Z',
      likes: 2,
      body: '저요!',
    },
    {
      nickname: '댓글알바',
      location: '대학동',
      time: '2024-12-28T11:30:00Z',
      likes: 0,
      body: '전 바빠서 ㅜㅜ 아쉬워요',
    },
    {
      nickname: '아령하세연',
      location: '행운동',
      time: '2024-12-29T12:05:00Z',
      likes: 0,
      body: '맛있게 드세요~',
    },
    {
      nickname: '토이플젝 7조',
      location: '신림동',
      time: '2025-01-03T19:00:00Z',
      likes: 3,
      body: '이것은 테스트입니다 댓글을 길게 쓰면 어떻게 되는지 확인하려고 이렇게 쓴거에요',
    },
  ],
};

const CommunityPostPage = () => {
  const [sortComment, setSortComment] = useState<'old' | 'new'>('old');
  const [currentInput, setCurrentInput] = useState<string>('');
  const isLiked = Math.random() < 0.5; // 임시로 설정, 추후에는 user id와 게시글에 like한 아이디를 대조해서 설정

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
        <NavLink to="/community">
          <img src={leftArrow} className={styles.upperIcon} />
        </NavLink>
        <div className={styles.upperBarIcons}>
          <img src={disabledBell} className={styles.upperIcon} />
          <img src={shareIcon} className={styles.upperIcon} />
          <img src={dotsIcon} className={styles.upperIcon} />
        </div>
      </div>
      <div className={styles.contentBox}>
        <div className={styles.postBox}>
          <div className={styles.postTag}>
            <img src={communityIcon} style={{ height: '14px' }} />
            맛집
          </div>
          <div className={styles.profileBox}>
            <img src={placeHolder} className={styles.profilePic} />
            <div>
              <p className={styles.nickname}>
                {tempCommunityPostInfo.nickname}
              </p>
              <p className={styles.profileInfo}>
                {tempCommunityPostInfo.location} ·{' '}
                {getTimeAgo(tempCommunityPostInfo.time)}
              </p>
            </div>
          </div>
          <p className={styles.postTitle}>{tempCommunityPostInfo.title}</p>
          <p className={styles.postBody}>{tempCommunityPostInfo.body}</p>
          <div className={styles.viewBox}>
            <img src={eyeIcon} style={{ height: '20px' }} />
            <p>{tempCommunityPostInfo.views}명이 봤어요</p>
          </div>
          <button
            className={isLiked ? styles.likeButton_liked : styles.likeButton}
            onClick={handleLikeClick}
          >
            <img src={likeIcon} style={{ height: '16px' }} />
            {tempCommunityPostInfo.likes === 0 ? (
              <span>공감하기</span>
            ) : (
              <span>{tempCommunityPostInfo.likes}</span>
            )}
          </button>
        </div>
        <div className={styles.separator} />
        <div className={styles.commentBox}>
          <p>댓글 {tempCommunityPostInfo.comments.length}</p>
          <div className={styles.sortButtons}>
            <p
              className={
                sortComment === 'old' ? styles.activeSort : styles.inactiveSort
              }
              onClick={() => {
                setSortComment('old');
              }}
            >
              등록순
            </p>
            <p
              className={
                sortComment === 'new' ? styles.activeSort : styles.inactiveSort
              }
              onClick={() => {
                setSortComment('new');
              }}
            >
              최신순
            </p>
          </div>
        </div>
        {tempCommunityPostInfo.comments
          .sort((a, b) => {
            if (sortComment === 'old')
              return a.time < b.time ? -1 : a.time > b.time ? 1 : 0;
            else return a.time > b.time ? -1 : a.time < b.time ? 1 : 0;
          })
          .map((Comment, index) => (
            <CommentItem key={index} CommentInfo={Comment} />
          ))}
      </div>
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
