/*
  프로필 수정 페이지.
*/
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import cameraIcon from '../assets/cameraIcon.svg';
import placeHolder from '../assets/placeholder_gray.png';
import quitIcon from '../assets/quitcross.svg';
import Loader from '../components/Loader';
import styles from '../css/MyProfileEditPage.module.css';
import {
  type ErrorResponseType,
  type ProfileResponse,
  Regions,
} from '../typings/user';
import { uploadImageToS3 } from '../utils/utils';

const MyProfileEditPage = () => {
  const [nickname, setNickname] = useState<string>();
  const [location, setLocation] = useState<string>();
  const [profileImage, setProfileImage] = useState<string | ArrayBuffer | null>(
    null,
  );
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file !== undefined) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
      setProfileImageFile(file);
    }
  };

  const handleCompleteClick = () => {
    const editMyProfile = async () => {
      const editedData = {
        nickname: nickname,
        location: location,
        imageCount: profileImage === null || profileImage === '' ? 0 : 1,
      };

      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (token === null) throw new Error('No token found');

        const response = await fetch('/api/mypage/profile/edit', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editedData),
        });

        if (!response.ok) {
          throw new Error('서버에 데이터를 전송하지 못했습니다.');
        }

        const data = (await response.json()) as ProfileResponse;

        console.info('presigned: ', data.user.imagePresignedUrl);
        if (profileImageFile !== null) {
          console.info('프로필 수정 성공, 사진 업로드 중');
          const presignedUrl = data.user.imagePresignedUrl;
          console.info(presignedUrl);

          await uploadImageToS3(profileImageFile, presignedUrl);
          console.info('프로필 이미지 업로드 성공');
        }
        if (nickname !== undefined) localStorage.setItem('nickname', nickname);
        if (location !== undefined) localStorage.setItem('location', location);
      } catch (error) {
        console.error('에러 발생:', error);
      } finally {
        setIsLoading(false);
        if (nickname !== undefined) void navigate(`/profile/${nickname}`);
      }
    };

    void editMyProfile();
  };

  useEffect(() => {
    const fetchMyProfileInfo = async () => {
      const token = localStorage.getItem('token');
      try {
        setIsLoading(true);
        if (token === null) throw new Error('No token found');
        const response = await fetch('/api/mypage/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = (await response.json()) as ErrorResponseType;
          throw new Error(`데이터 불러오기 실패: ${errorData.error}`);
        }

        const data = (await response.json()) as ProfileResponse;
        setNickname(data.user.nickname);
        setLocation(data.user.location);
        setProfileImage(data.user.imagePresignedUrl);
      } catch (error) {
        console.error('error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchMyProfileInfo();
  }, []);

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
      {isLoading ? (
        <Loader marginTop="40vh" />
      ) : (
        <div className={styles.contentBox}>
          <div className={styles.profilePicBox}>
            <label htmlFor="profilePicInput" className={styles.profilePicLabel}>
              <img
                src={
                  profileImage === '' ? placeHolder : (profileImage as string)
                }
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
            {Regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default MyProfileEditPage;
