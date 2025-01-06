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
