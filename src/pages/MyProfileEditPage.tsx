/*
  프로필 수정 페이지.
*/
import { useState } from 'react';
import { useNavigate } from 'react-router';

import cameraIcon from '../assets/cameraIcon.svg';
import placeHolder from '../assets/placeholder_gray.png';
import quitIcon from '../assets/quitcross.svg';
import styles from '../css/MyProfileEditPage.module.css';

const PrevNickname = '바꾸기 전 닉네임';
const PrevProfileImage = placeHolder;

const MyProfileEditPage = () => {
  const [nickname, setNickname] = useState<string>(PrevNickname);
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
        <p className={styles.nickname}>닉네임</p>
        <input
          type="text"
          value={nickname}
          className={styles.nicknameInput}
          onChange={(e) => {
            setNickname(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default MyProfileEditPage;
