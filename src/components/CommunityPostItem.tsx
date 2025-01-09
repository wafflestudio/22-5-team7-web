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
        <p className={styles.postTag}>{CommunityPostInfo.tag}</p>
        <p className={styles.postTitle}>{CommunityPostInfo.title}</p>
        <p className={styles.postPreview}>{CommunityPostInfo.body}</p>
        <div className={styles.bottomLine}>
          <p className={styles.postInfo}>
            {CommunityPostInfo.location} · {getTimeAgo(CommunityPostInfo.time)}{' '}
            · 조회 {CommunityPostInfo.views}
          </p>
          <div className={styles.iconBox}>
            <img src={likeIcon} style={{ height: '18px' }} />
            <span>{CommunityPostInfo.likes}</span>
            <img src={commentIcon} style={{ height: '18px' }} />
            <span>{CommunityPostInfo.comments.length}</span>
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default CommunityPostItem;
