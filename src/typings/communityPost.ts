import type { User } from './user';

export type CommunityPostItemType = {
  id: number;
  authorLocation: string;
  title: string;
  content: string;
  imagePresignedUrl: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  viewCount: number;
};

export type CommunityPost = {
  id: number;
  author: User;
  tag: string;
  title: string;
  content: string;
  imagePresignedUrl: string[];
  likeCount: number;
  commentList: Comment[];
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  isLiked: boolean;
};

type Comment = {
  id: number;
  user: User;
  content: string;
  commentLikesCount: number;
  createdAt: string;
  updatedAt: string;
};

export type CommentProps = {
  CommentInfo: Comment;
};

export type CommentEditWindowProps = {
  CommentInfo: Comment;
  closeWindow: () => void;
};

export const TagsArray = [
  {
    category: '🏠동네정보',
    tags: [
      '맛집',
      '생활/편의',
      '병원/약국',
      '이사/시공',
      '주거/부동산',
      '교육',
      '미용',
    ],
  },
  {
    category: '🧑‍🤝‍🧑이웃과 함께',
    tags: [
      '반려동물',
      '운동',
      '고민/사연',
      '동네친구',
      '취미',
      '동네풍경',
      '임신/육아',
    ],
  },
  {
    category: '📢소식',
    tags: ['분실/실종', '동네사건사고'],
  },
  {
    category: '⚇기타',
    tags: ['일반'],
  },
];

export type FeedResponse = {
  id: number;
  imagePresignedUrl: string[];
};
