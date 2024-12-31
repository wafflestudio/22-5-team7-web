export type User = {
  id: string,
  nickname: string,
  userId: string,
  location: string,
  temperature: number,
  sellingItems: number,
  manners: manner[],
  reviews: review[]
};

type manner = {
  label: string,  // 매너 글귀 (친절하고 매너가 좋아요, 시간 약속을 잘 지켜요 등등)
  number: number, // 몇 명이 해당 매너 평가를 남겼는지
};

type review = { // 리뷰 남긴 사람의 정보
  profilePic: string,
  nickname: string,
  type: string,
  location: string,
  time: number, //며칠전에 작성된 리뷰인지
  text: string,
};
