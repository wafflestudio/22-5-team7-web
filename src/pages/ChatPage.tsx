/*
  '채팅' 에 해당하는 페이지.
*/
import bellIcon from '../assets/upperbar-bell.svg';
import filterIcon from '../assets/upperbar-filter.svg';
import qrcodeIcon from '../assets/upperbar-qrcode.svg';
import UpperBar from '../components/UpperBar';
import type { toolBarInfo } from '../typings/toolBar';

const chatPageToolBarInfo: toolBarInfo = {
  path: '/chat',
  mainText: '채팅',
  toolBarItems: [
    {
      pathTo: '/temp',
      alt: 'filter',
      icon: filterIcon,
    },
    {
      pathTo: '/temp',
      alt: 'QR code',
      icon: qrcodeIcon,
    },
    {
      pathTo: '/temp',
      alt: 'notification',
      icon: bellIcon,
    },
  ],
};

const ChatPage = () => {
  return (
    <div>
      <UpperBar toolBarInfo={chatPageToolBarInfo} />
      <div>채팅</div>
    </div>
  );
};

export default ChatPage;
