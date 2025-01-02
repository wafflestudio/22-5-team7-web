/*
  다른 이용자들의 받은 매너 평가 페이지.
*/

/*
  나의 관심목록 페이지.
*/

import { useNavigate } from 'react-router-dom';

import leftArrow from '../assets/leftarrow.svg';
import peopleIcon from '../assets/people.svg';
import styles from '../css/MannersPage.module.css';

const tempUser = {
  // 나중에 API 연결
  id: 'mytempid',
  nickname: '단호한 호박',
  userId: 'hobak123',
  location: '대학동',
  temperature: 40.7,
  sellingItems: 2,
  manners: [
    {
      label: '친절하고 매너가 좋아요.',
      number: 45,
    },
    {
      label: '시간 약속을 잘 지켜요.',
      number: 42,
    },
    {
      label: '제가 있는 곳까지 와서 거래했어요.',
      number: 28,
    },
    {
      label: '응답이 빨라요.',
      number: 42,
    },
    {
      label: '물품상태가 설명한 것과 같아요.',
      number: 12,
    },
    {
      label: '좋은 물품을 저렴하게 판매해요.',
      number: 10,
    },
    {
      label: '물품설명이 자세해요.',
      number: 8,
    },
    {
      label: '나눔을 해주셨어요.',
      number: 5,
    },
  ],
  reviews: [
    {
      profilePic: 'put_url_here',
      nickname: '췌민킴',
      type: '구매자',
      location: '서울특별시 관악구',
      time: 8,
      text: '상품 상태가 좋네요 ^^',
    },
    {
      profilePic: 'put_url_here',
      nickname: 'ilovekimchi',
      type: '판매자',
      location: '서울특별시 송파구',
      time: 27,
      text: '잘 쓰세요~',
    },
    {
      profilePic: 'put_url_here',
      nickname: 'imwinter',
      type: '구매자',
      location: '서울특별시 영등포구',
      time: 81,
      text: '안녕하세요 에스파 윈터입니다~ 새로 나온 저희 앨범 잘 들어주세요!',
    },
  ],
};

const MANNER_INFO_TEXT = `
- 받은 비매너 내역은 나에게만 보입니다.
- 매너 온도가 올라가는 경우 (가산점 높은 순)
1. 거래 상대에게 받은 긍정 거래 후기
2. 거래 상대에게 받은 매너 칭찬
3. 대화 상대에게 받은 매너 칭찬
- 매너 온도가 내려가는 경우 (감산점 높은 순)
1. 이용정지 징계
2. 거래 상대의 비매너 평가
3. 대화 상대의 비매너 평가
`;

const MannersPage = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.main}>
      <div className={styles.upperBar}>
        <button
          onClick={() => {
            void navigate(-1);
          }}
          className={styles.button}
        >
          <img src={leftArrow} className={styles.upperIcon} />
        </button>
        <p className={styles.pageTitle}>매너 상세</p>
      </div>
      <div className={styles.contentBox}>
        <div className={styles.mannerTitle}>
          <span className={styles.mannerEmoji}>🙂</span>
          <span>받은 매너 칭찬</span>
        </div>
        {tempUser.manners.length === 0 ? (
          <p className={styles.mannerLine}>받은 매너가 없어요.</p>
        ) : (
          <>
            {tempUser.manners
              .sort((a, b) => b.number - a.number)
              .map((manner, index) => (
                <div key={index} className={styles.mannerLine}>
                  <p>{manner.label}</p>
                  <div className={styles.mannerLineRight}>
                    <img src={peopleIcon} style={{ height: '20px' }} />
                    {manner.number}
                  </div>
                </div>
              ))}
          </>
        )}

        <div className={styles.mannerTitle}>
          <span className={styles.mannerEmoji}>😞</span>
          <span>받은 비매너</span>
        </div>
        <p className={styles.mannerLine}>받은 비매너가 없어요.</p>
      </div>
      <div className={styles.mannerInfoBox}>
        <p style={{ fontWeight: 'bold' }}>참고사항</p>
        <p className={styles.mannerInfoText}>{MANNER_INFO_TEXT}</p>
      </div>
      <div className={styles.mannerGuideBox}>
        <p>
          따뜻한 거래를 위한
          <br />
          당근 거래매너를 확인해보세요:)
        </p>
        <a
          href="https://www.daangn.com/wv/faqs/27"
          className={styles.mannerGuideButton}
        >
          당근 거래매너 보기
        </a>
      </div>
    </div>
  );
};

export default MannersPage;
