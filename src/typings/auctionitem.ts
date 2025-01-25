import type { User } from './user';

export type PreviewAuctionItem = {
  id: number;
  title: string;
  startingPrice: number;
  currentPrice: number;
  status: number;
  location: string;
  imagePresignedUrl: string;
  endTime: string;
  likeCount: number;
};

export type AuctionItem = {
  id: number;
  seller: User;
  title: string;
  content: string;
  tag: string;
  startingPrice: number;
  currentPrice: number;
  status: number;
  location: string;
  imagePresignedUrl: string[];
  startingTime: string;
  endTime: string;
  likeCount: number;
  viewCount: number;
  isLiked: boolean;
};

export type AuctionMessage = {
  auctionId: number;
  senderNickname: string;
  price: number;
  createdAt: string;
};
