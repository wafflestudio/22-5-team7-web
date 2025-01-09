type User = {
  id: string;
  nickname: string;
  location: string;
  temperature: number;
  email: string;
};

export type SignupUser = {
  user: User;
};

export type SigninResponse = {
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
