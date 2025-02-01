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
import {
  type ErrorResponseType,
  type Manner,
  mannerTypeLabels,
  negMannerTypeLabels,
} from '../typings/user';

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
  const { nickname } = useParams<{ nickname: string }>();
  const [manners, setManners] = useState<Manner[]>([]);
  const [negManners, setNegManners] = useState<Manner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const myNickname = localStorage.getItem('nickname');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMannersInfo = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (token === null) throw new Error('No token found');
        if (nickname === undefined) throw new Error('nickname is undefined!');

        const response = await fetch(
          `/api/profile/manners?nickname=${encodeURIComponent(nickname)}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
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

        const PosManners = data.filter(
          (manner) => !manner.mannerType.startsWith('NEG_'),
        );
        setManners(PosManners);

        if (nickname === myNickname) {
          const NegManners = data.filter((manner) =>
            manner.mannerType.startsWith('NEG_'),
          );
          setNegManners(NegManners);
        }
      } catch (error) {
        console.error('error:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchMannersInfo();
  }, [nickname, myNickname]);

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
                    <p>
                      {
                        mannerTypeLabels[
                          manner.mannerType as keyof typeof mannerTypeLabels
                        ]
                      }
                    </p>
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
          {nickname === myNickname ? (
            negManners.length === 0 ? (
              <p className={styles.mannerLine}>받은 비매너가 없어요.</p>
            ) : (
              <>
                {negManners
                  .sort((a, b) => b.count - a.count)
                  .map((manner, index) => (
                    <div key={index} className={styles.mannerLine}>
                      <p>
                        {
                          negMannerTypeLabels[
                            manner.mannerType as keyof typeof negMannerTypeLabels
                          ]
                        }
                      </p>
                      <div className={styles.mannerLineRight}>
                        <img src={peopleIcon} style={{ height: '20px' }} />
                        {manner.count}
                      </div>
                    </div>
                  ))}
              </>
            )
          ) : (
            <p className={styles.mannerLine}>
              &lsquo;받은 비매너&rsquo;는 본인에게만 보여요.
            </p>
          )}
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
