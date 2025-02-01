/*
  댓글 수정하는 컴포넌트. 따로 페이지를 만들지 않고 컴포넌트 형식으로 처리했다.
*/

import { useState } from 'react';

import leftArrow from '../assets/leftarrow.svg';
import styles from '../css/CommentEditWindow.module.css';
import type { CommentEditWindowProps } from '../typings/communityPost';

const CommentEditWindow = ({
  CommentInfo,
  closeWindow,
  onCommentEdit,
}: CommentEditWindowProps) => {
  const [commentBody, setCommentBody] = useState<string>(CommentInfo.content);

  const handleEditComment = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token === null) {
        throw new Error('토큰이 없습니다.');
      }
      const response = await fetch(`/api/comment/edit/${CommentInfo.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: commentBody,
        }),
      });

      if (!response.ok) {
        throw new Error('수정 요청에 실패했습니다.');
      }

      closeWindow();
      onCommentEdit();
    } catch (error) {
      console.error('수정 중 에러 발생:', error);
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.upperBar}>
        <img
          src={leftArrow}
          style={{ height: '25px' }}
          onClick={() => {
            closeWindow();
          }}
        />
        <p className={styles.pageTitle}>댓글 수정</p>
        <p
          className={styles.registerButton}
          onClick={() => {
            void handleEditComment();
          }}
        >
          완료
        </p>
      </div>
      <textarea
        className={styles.commentContentBox}
        value={commentBody}
        onChange={(e) => {
          setCommentBody(e.target.value);
        }}
      />
    </div>
  );
};

export default CommentEditWindow;
