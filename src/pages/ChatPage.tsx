/*
  '채팅' 에 해당하는 페이지.
*/
import { useEffect, useState } from 'react';

import bellIcon from '../assets/upperbar-bell.svg';
import filterIcon from '../assets/upperbar-filter.svg';
import qrcodeIcon from '../assets/upperbar-qrcode.svg';
import Chat from '../components/Chat';
import UpperBar from '../components/UpperBar';
import type { chatItem } from '../typings/chat';
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
  const [chats, setChats] = useState<chatItem[]>([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token === null) throw new Error('토큰이 없습니다.');

        const instant = new Date('2030-01-01T00:00:00Z').toISOString();

        const response = await fetch(`/api/chat?updatedAt=${instant}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = (await response.json()) as chatItem[];
        setChats(data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    void fetchChats();
  }, []);

  return (
    <div>
      <UpperBar toolBarInfo={chatPageToolBarInfo} />
      <div style={{ margin: '66px 0 75px' }}>
        {chats.map((chat) => (
          <Chat key={chat.id} chatItem={chat} />
        ))}
      </div>
    </div>
  );
};

export default ChatPage;
