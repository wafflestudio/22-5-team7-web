/*
  다른 이용자들의 받은 매너 평가 페이지.
*/

/*
  나의 관심목록 페이지.
*/

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import leftArrow from '../assets/leftarrow.svg';
import peopleIcon from '../assets/people.svg';
import Loader from '../components/Loader';
import styles from '../css/MannersPage.module.css';
import type { ErrorResponseType, Manner } from '../typings/user';

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
  const { id } = useParams<{ id: string }>();
  const [manners, setManners] = useState<Manner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMannersInfo = async () => {
      try {
        setLoading(true);
        if (id === undefined) throw new Error('id is undefined!');
        const response = await fetch(
          `http://localhost:5173/api/profile/${id}/manners`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          const errorData = (await response.json()) as ErrorResponseType;
          throw new Error(`데이터 불러오기 실패: ${errorData.error}`);
        }

        const data = (await response.json()) as Manner[];
        console.info(data);
        setManners(data);
      } catch (error) {
        console.error('error:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchMannersInfo();
  }, [id]);

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
      {loading ? (
        <Loader marginTop="40vh" />
      ) : (
        <div className={styles.contentBox}>
          <div className={styles.mannerTitle}>
            <span className={styles.mannerEmoji}>🙂</span>
            <span>받은 매너 칭찬</span>
          </div>
          {manners.length === 0 ? (
            <p className={styles.mannerLine}>받은 매너가 없어요.</p>
          ) : (
            <>
              {manners
                .sort((a, b) => b.count - a.count)
                .map((manner, index) => (
                  <div key={index} className={styles.mannerLine}>
                    <p>{manner.mannerType}</p>
                    <div className={styles.mannerLineRight}>
                      <img src={peopleIcon} style={{ height: '20px' }} />
                      {manner.count}
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
      )}
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
