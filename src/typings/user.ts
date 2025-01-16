type User = {
  id: string;
  userId: string;
  nickname: string;
  location: string;
  temperature: number;
  email: string;
  imagePresignedUrl: string;
};

export type SignupUser = {
  user: User;
};

export type SigninResponse = {
  user: User;
  accessToken: string;
};

export type Manner = {
  mannerType: string; // 매너 글귀 (친절하고 매너가 좋아요, 시간 약속을 잘 지켜요 등등)
  count: number; // 몇 명이 해당 매너 평가를 남겼는지
};

export type Review = {
  id: number;
  content: string;
  seller: User;
  buyer: User;
  location: string;
  createdAt: string;
  updatedAt: string;
};

export type MyPageResponse = {
  nickname: string;
  temperature: number;
};

export type ErrorResponseType = {
  error: string;
  errorCode: number;
};

export type ProfileResponse = {
  id: number;
  user: User;
  manners: Manner[];
  reviews: Review[];
  mannerCount: number;
  reviewCount: number;
};

export const Regions = [
  '보라매동',
  '은천동',
  '성현동',
  '중앙동',
  '청림동',
  '행운동',
  '청룡동',
  '낙성대동',
  '인헌동',
  '남현동',
  '신림동',
  '신사동',
  '조원동',
  '미성동',
  '난곡동',
  '난향동',
  '서원동',
  '신원동',
  '서림동',
  '삼성동',
  '대학동',
];
