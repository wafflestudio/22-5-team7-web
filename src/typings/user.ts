export type User = {
  id: string;
  nickname: string;
  userId: string;
  location: string;
  temperature: number;
  sellingItems: number;
  manners: manner[];
  reviews: review[];
};

export type SignupUser = {
  user: {
    id: string;
    nickname: string;
    location: string;
    temperature: number;
    email: string;
  };
};

export type SigninResponse = {
  accessToken: string;
};

type manner = {
  label: string; // 매너 글귀 (친절하고 매너가 좋아요, 시간 약속을 잘 지켜요 등등)
  number: number; // 몇 명이 해당 매너 평가를 남겼는지
};

type review = {
  // 리뷰 남긴 사람의 정보
  profilePic: string;
  nickname: string;
  type: string;
  location: string;
  time: number; //며칠전에 작성된 리뷰인지
  text: string;
};

export type MyPageResponse = {
  nickname: string;
  temperature: number;
};

export type ErrorResponseType = {
  error: string;
  errorCode: number;
};
