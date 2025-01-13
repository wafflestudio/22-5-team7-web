/*
  유저 location 정보를 초기 세팅하는 페이지.
*/
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import leftArrow from '../assets/leftarrow.svg';
import styles from '../css/SetLocationPage.module.css';
import { Regions } from '../typings/user';

const SetLocationPage = () => {
  const [location, setLocation] = useState<string>('');
  const navigate = useNavigate();

  /*
  const handleNextClick = async () => {
      try {
        const response = await fetch('/api/auth/sign/in', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: location,
          }),
        });
  
        if (!response.ok) {
          const errorData = (await response.json()) as ErrorResponseType;
          throw new Error(`로그인 실패: ${errorData.error}`);
        }
        const data = (await response.json()) as SigninResponse;
        localStorage.setItem('location', data.user.location);
        console.info('지역 정보 설정 완료!');
        void navigate('/main');
      } catch (error) {
        if (error instanceof Error) alert(error.message);
        console.error('error: ', error);
      }
    };
  */

  const handleNextClickWrapper = () => {
    // void handleNextClick;
    void navigate('/main');
  };

  return (
    <div className={styles.main}>
      <NavLink to="/">
        <img src={leftArrow} className={styles.leftArrow} />
      </NavLink>
      <div className={styles.content}>
        <p className={styles.mainText}>내 동네를 설정해주세요.</p>
        <p className={styles.subText}>
          당근마켓은 동네 직거래 마켓이에요. <br />내 동네를 설정하고
          시작해보세요! <br /> 동네 정보는 내 프로필에서 변경할 수도 있어요.
        </p>
        <select
          className={styles.inputBox}
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
          }}
        >
          <option value="">지역을 선택하세요</option>
          {Regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
        <button
          onClick={handleNextClickWrapper}
          className={
            location !== '' ? styles.activeButton : styles.disabledButton
          }
          disabled={location === ''}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default SetLocationPage;
