export type PreviewItem = {
  id: number;
  title: string;
  price: number;
  status: '판매 중' | '예약 중' | '거래완료';
  location: string;
  image_url: string | undefined;
  createdAt: string;
  likeCount: number;
};

interface Seller {
  id: string;
  nickname: string;
  location: string;
  temperature: number;
  email: string;
}

export interface Item {
  id: string;
  seller: Seller;
  title: string;
  content: string;
  price: number;
  status: string;
  location: string;
  image_url: string[];
  createdAt: string;
  likeCount: number;
  viewCount: number;
}

export type ArticleResponse = {
  id: number;
  imagePresignedUrl: string[];
};
