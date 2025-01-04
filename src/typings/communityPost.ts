export type CommunityPost = {
  id: string; // 게시글 id
  tag: string;
  title: string;
  body: string;
  user_id: string;
  nickname: string;
  location: string;
  time: string; // 2025-01-02T13:05:26 이런 형식인듯?
  views: number; // 조회수
  likes: number;
  comments: Comment[]; // 댓글에 답글은 없는걸로
};

type Comment = {
  nickname: string;
  location: string;
  time: string;
  likes: number;
  body: string; // 댓글 내용
};
