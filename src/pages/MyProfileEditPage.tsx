/*
  프로필 수정 페이지.
*/
import { useState } from 'react';
import { useNavigate } from 'react-router';

import cameraIcon from '../assets/cameraIcon.svg';
import placeHolder from '../assets/placeholder_gray.png';
import quitIcon from '../assets/quitcross.svg';
import styles from '../css/MyProfileEditPage.module.css';

// temp 정보, 추후에 변경
const PrevNickname = '바꾸기 전 닉네임';
const PrevLocation = '대학동';
const PrevProfileImage = placeHolder;

const regions = [
  '보라매동',
  '은천동',
  '성현동',
  '중앙동',
  '청림동',
  '행운동',
  '청룡동',
  '낙성대동',
  '인헌동',
  '남현동',
  '신림동',
  '신사동',
  '조원동',
  '미성동',
  '난곡동',
  '난향동',
  '서원동',
  '신원동',
  '서림동',
  '삼성동',
  '대학동',
];

const MyProfileEditPage = () => {
  const [nickname, setNickname] = useState<string>(PrevNickname);
  const [location, setLocation] = useState<string>(PrevLocation);
  const [profileImage, setProfileImage] = useState<string | ArrayBuffer | null>(
    PrevProfileImage,
  );
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file !== undefined) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompleteClick = () => {
    // 닉네임, 프로필 사진 업데이트
    void navigate(-1);
  };

  return (
    <div className={styles.main}>
      <div className={styles.upperBar}>
        <button
          onClick={() => {
            void navigate(-1);
          }}
          className={styles.button}
        >
          <img src={quitIcon} style={{ height: '25px' }} />
        </button>
        <p className={styles.pageTitle}>프로필 수정</p>
        <p className={styles.completeButton} onClick={handleCompleteClick}>
          완료
        </p>
      </div>
      <div className={styles.contentBox}>
        <div className={styles.profilePicBox}>
          <label htmlFor="profilePicInput" className={styles.profilePicLabel}>
            <img
              src={profileImage as string}
              className={styles.profilePic}
              alt="Profile"
            />
            <div className={styles.cameraIconContainer}>
              <img
                src={cameraIcon}
                className={styles.cameraIcon}
                alt="Edit Profile"
              />
            </div>
          </label>
          <input
            id="profilePicInput"
            type="file"
            accept="image/*"
            className={styles.fileInput}
            onChange={handleImageChange}
          />
        </div>
        <p className={styles.infoText}>닉네임</p>
        <input
          type="text"
          value={nickname}
          className={styles.inputBox}
          onChange={(e) => {
            setNickname(e.target.value);
          }}
        />
        <p className={styles.infoText}>내 동네</p>
        <select
          className={styles.inputBox}
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
          }}
        >
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default MyProfileEditPage;
