/*
  기존에 없던 새로운 기능인 '경매'에에 해당하는 페이지.
*/
import bellIcon from '../assets/upperbar-bell.svg';
import profileIcon from '../assets/upperbar-profile.svg';
import searchIcon from '../assets/upperbar-search.svg';
import AuctionItem from '../components/AuctionItem';
import UpperBar from '../components/UpperBar';
import styles from '../css/AuctionPage.module.css';
import type { PreviewAuctionItem } from '../typings/auctionitem';
import type { toolBarInfo } from '../typings/toolBar';

const auctionPageToolBarInfo: toolBarInfo = {
  path: '/auctions',
  mainText: '경매',
  toolBarItems: [
    {
      pathTo: '/temp',
      alt: 'community profile',
      icon: profileIcon,
    },
    {
      pathTo: '/search',
      alt: 'search',
      icon: searchIcon,
    },
    {
      pathTo: '/temp',
      alt: 'notification',
      icon: bellIcon,
    },
  ],
};

const mockAuctionItem: PreviewAuctionItem = {
  id: 1,
  title: '빈티지 시계',
  price: 50000,
  status: true,
  location: '서울특별시 강남구',
  image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
  createdAt: '2025-01-11T07:40:00Z',
  likeCount: 10,
};

const AuctionPage = () => {
  return (
    <div>
      <UpperBar toolBarInfo={auctionPageToolBarInfo} />
      <div className={styles.contentBox}>
        <button className={styles.postbutton}>+ 글쓰기</button>
        <AuctionItem ItemInfo={mockAuctionItem}></AuctionItem>
        <AuctionItem ItemInfo={mockAuctionItem}></AuctionItem>
        <AuctionItem ItemInfo={mockAuctionItem}></AuctionItem>
        <AuctionItem ItemInfo={mockAuctionItem}></AuctionItem>
        <AuctionItem ItemInfo={mockAuctionItem}></AuctionItem>
      </div>
    </div>
  );
};

export default AuctionPage;
