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

export type Article = {
  id: string;
  seller: User;
  title: string;
  content: string;
  tag: string;
  price: number;
  status: number;
  location: string;
  imagePresignedUrl: string[];
  createdAt: string;
  likeCount: number;
  viewCount: number;
  isLiked: boolean;
};

export interface Item {
  article: Article;
  chattingUsers: User[];
}

export const categories = [
  '디지털기기',
  '생활가전',
  '가구/인테리어',
  '생활/주방',
  '유아동',
  '유아도서',
  '여성의류',
  '여성잡화',
  '남성패션/잡화',
  '뷰티/미용',
  '스포츠/레저',
  '취미/게임/음반',
  '도서',
  '티켓/교환권',
  '가공식품',
  '건강기능식품',
  '반려동물용품',
  '식물',
  '기타 중고물품',
  '삽니다',
  '나눔',
  '전시/행사',
  '기타',
];
