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
  createdAt: string;
  likeCount: number;
}
