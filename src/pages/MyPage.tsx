/*
  '나의 당근' 에 해당하는 마이페이지.
  - 내 프로필
  - 관심목록
  - 판매내역
  - 구매내역
  - 내 프로필 / 받은 매너 평가
  - 내 프로필 / 받은 거래 후기
  - 앱 설정정
  정도만 구현할 예정
*/
import settingsIcon from '../assets/upperbar-settings.svg';
import UpperBar from '../components/UpperBar';
import type { toolBarInfo } from '../typings/toolBar';

const myPageToolBarInfo: toolBarInfo = {
  path: '/mypage',
  mainText: '나의 당근',
  toolBarItems: [
    {
      pathTo: 'settings',
      alt: 'settings',
      icon: settingsIcon,
    },
  ],
};

const MyPage = () => {
  return (
    <div>
      <UpperBar toolBarInfo={myPageToolBarInfo} />
      <div>나의 당근</div>
    </div>
  );
};

export default MyPage;
