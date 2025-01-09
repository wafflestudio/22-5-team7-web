export type PreviewItem = {
  id: number;
  title: string;
  price: number;
  status: '판매 중' | '예약 중' | '거래완료';
  location: string;
  createdAt: string;
  likeCount: number;
};
