import type { Article } from './item';
import type { User } from './user';

export type message = {
  chatRoomId: number;
  senderNickname: string;
  content: string;
  createdAt: string;
};

export type chatItem = {
  id: number;
  article: Article;
  seller: User;
  buyer: User;
  chatMessage: string;
  updatedAt: string;
};

export type chatRoomResponse = {
  chatRoom: chatItem;
  messages: message[];
};
