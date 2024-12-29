/*
  '동네생활' 에 해당하는 페이지.
*/
import bellIcon from '../assets/upperbar-bell.svg';
import profileIcon from '../assets/upperbar-profile.svg';
import searchIcon from '../assets/upperbar-search.svg';
import UpperBar from '../components/UpperBar';
import type { toolBarInfo } from '../typings/toolBar';

const communityPageToolBarInfo: toolBarInfo = {
  path: '/community',
  mainText: '대학동',
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

const CommunityPage = () => {
  return (
    <div>
      <UpperBar toolBarInfo={communityPageToolBarInfo} />
      <div>동네생활</div>
    </div>
  );
};

export default CommunityPage;
