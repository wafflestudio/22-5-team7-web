export type PreviewItem = {
  id: number;
  title: string;
  price: number;
  status: 0 | 1 | 2;
  location: string;
  imagePresignedUrl: string | undefined;
  createdAt: string;
  likeCount: number;
};

type User = {
  id: string;
  userId: string;
  nickname: string;
  location: string;
  temperature: number;
  email: string;
  imagePresignedUrl: string;
};

export interface Item {
  id: string;
  seller: User;
  title: string;
  content: string;
  price: number;
  status: string;
  tag: string;
  location: string;
  imagePresignedUrl: string[];
  createdAt: string;
  likeCount: number;
  viewCount: number;
  isLiked: boolean;
}

export type ArticleResponse = {
  id: number;
  imagePresignedUrl: string[];
};
