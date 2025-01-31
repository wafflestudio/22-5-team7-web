export type User = {
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
  imagePresignedUrl: string;
};

export type ErrorResponseType = {
  error: string;
  errorCode: number;
};

export type ProfileResponse = {
  id: number;
  user: User;
  itemCount: number;
  manners: Manner[];
  reviews: Review[];
  reviewCount: number;
};

export const mannerTypeLabels = {
  KINDNESS: '친절하고 매너가 좋아요.',
  PUNCTUALITY: '시간 약속을 잘 지켜요.',
  QUICK_RESPONSE: '응답이 빨라요.',
  DELIVERY: '제가 있는 곳까지 와서 거래했어요.',
  ACCURATE_DESCRIPTION: '물품상태가 설명한 것과 같아요.',
  AFFORDABLE_PRICE: '좋은 물품을 저렴하게 판매해요.',
  DETAILED_DESCRIPTION: '물품설명이 자세해요.',
  SHARING: '나눔을 해주셨어요.',
};

export const negMannerTypeLabels = {
  NEG_KINDNESS: '불친절해요.',
  NEG_PUNCTUALITY: '시간약속을 안 지켜요.',
  NEG_QUICK_RESPONSE: '채팅 메시지를 읽고도 답이 없어요.',
  NEG_DELIVERY: '약속 장소에 나타나지 않았어요.',
  NEG_ACCURATE_DESCRIPTION: '물품상태가 설명한 것과 달라요.',
  NEG_AFFORDABLE_PRICE: '물품을 너무 비싸게 판매해요.',
  NEG_DETAILED_DESCRIPTION: '물품설명이 자세하지 않아요.',
  NEG_SHARING: '그냥 싫은데!..',
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
