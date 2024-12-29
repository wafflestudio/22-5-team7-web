/*
  기존에 없던 새로운 기능인 '경매'에에 해당하는 페이지.
*/
import bellIcon from '../assets/upperbar-bell.svg';
import profileIcon from '../assets/upperbar-profile.svg';
import searchIcon from '../assets/upperbar-search.svg';
import UpperBar from '../components/UpperBar';
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

const AuctionPage = () => {
  return (
    <div>
      <UpperBar toolBarInfo={auctionPageToolBarInfo} />
      <div>경매</div>
    </div>
  );
};

export default AuctionPage;
