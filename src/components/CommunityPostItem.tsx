import { NavLink } from 'react-router';

import commentIcon from '../assets/comment-gray.svg';
import likeIcon from '../assets/like-gray.svg';
import styles from '../css/CommunityPostItem.module.css';
import type { CommunityPostItemType } from '../typings/communityPost';
import { getTimeAgo } from '../utils/utils';

type CommunityPostItemProps = {
  CommunityPostInfo: CommunityPostItemType;
};

const CommunityPostItem = ({ CommunityPostInfo }: CommunityPostItemProps) => {
  return (
    <NavLink to={`/community/${CommunityPostInfo.id}`} className={styles.main}>
      <div className={styles.contentBox}>
        <div className={styles.upperBox}>
          <div className={styles.upperBoxLeft}>
            <p className={styles.postTag}>{CommunityPostInfo.tag}</p>
            <p className={styles.postTitle}>{CommunityPostInfo.title}</p>
            <p className={styles.postPreview}>{CommunityPostInfo.content}</p>
          </div>
          {CommunityPostInfo.imagePresignedUrl !== '' && (
            <img
              src={CommunityPostInfo.imagePresignedUrl}
              className={styles.previewImage}
            />
          )}
        </div>
        <div className={styles.bottomLine}>
          <p className={styles.postInfo}>
            {CommunityPostInfo.authorLocation} ·{' '}
            {getTimeAgo(CommunityPostInfo.createdAt)} · 조회{' '}
            {CommunityPostInfo.viewCount}
          </p>
          <div className={styles.iconBox}>
            {CommunityPostInfo.likeCount !== 0 && (
              <>
                <img src={likeIcon} style={{ height: '18px' }} />
                <span>{CommunityPostInfo.likeCount}</span>
              </>
            )}
            {CommunityPostInfo.commentCount !== 0 && (
              <>
                <img src={commentIcon} style={{ height: '18px' }} />
                <span>{CommunityPostInfo.commentCount}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default CommunityPostItem;
