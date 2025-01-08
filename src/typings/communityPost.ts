export type CommunityPostItemType = {
  id: string;
  tag: string;
  title: string;
  body: string;
  location: string;
  time: string;
  views: number;
  likes: number;
  comments: Comment[];
};

export type CommunityPost = {
  id: string; // 게시글 id
  user_id: string; // 게시자 id
  tag: string;
  title: string;
  body: string;
  time: string; // 2025-01-02T13:05:26:00z (ISO 8601 형식식)
  views: number; // 조회수
  likes: number;
  comments: Comment[]; // 댓글에 답글은 없는걸로
  users: {
    // user_id가 key인 dictionary
    [key: string]: {
      id: number;
      nickname: string;
      location: string;
      profile_picture: string;
    };
  };
};

type Comment = {
  id: number;
  user_id: string;
  time: string;
  likes: number;
  body: string; // 댓글 내용
};

export type CommentProps = {
  CommentInfo: Comment;
  userInfo:
    | {
        id: number;
        nickname: string;
        location: string;
        profile_picture: string;
      }
    | undefined;
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
