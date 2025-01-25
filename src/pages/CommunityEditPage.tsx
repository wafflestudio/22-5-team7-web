/*
  동네생활 게시글을 수정하는 페이지.
*/
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import hashtagIcon from '../assets/hashtag-gray.svg';
import pictureIcon from '../assets/picture-gray.svg';
import quitIcon from '../assets/quitcross.svg';
import rightArrow from '../assets/rightarrow_black.svg';
import Loader from '../components/Loader';
import styles from '../css/CommunityRegisterPage.module.css';
import {
  type CommunityPost,
  type FeedResponse,
  TagsArray,
} from '../typings/communityPost';
import { uploadImageToS3 } from '../utils/utils';

const CommunityEditPage = () => {
  const { id } = useParams();
  const [isTagPopupActive, setIsTagPopupActive] = useState<boolean>(true);
  const [tag, setTag] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [article, setArticle] = useState<string>('');
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const tempLocation = '대학동';

  const LONG_PLACEHOLDER_TEXT = `${tempLocation} 이웃과 이야기를 나눠보세요.
#맛집 #병원 #산책...`;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (token === null) throw new Error('토큰이 없습니다.');
        if (id === undefined) throw new Error('id is undefined!');

        const response = await fetch(`/api/feed/get/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch post: ${response.statusText}`);
        }

        const data = (await response.json()) as CommunityPost;
        // setTag(data.tag)
        setTitle(data.title);
        setArticle(data.content);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    void fetchPost();
  }, [id]);

  const handleEditClick = async () => {
    const postData = {
      title,
      content: article,
      tag: tag,
      imageCount: images.length,
    };

    const token = localStorage.getItem('token');

    try {
      if (token === null) throw new Error('No token found');
      if (id === undefined) throw new Error('id is undefined');

      const response = await fetch(`/api/feed/edit/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error('서버에 데이터를 전송하지 못했습니다.');
      }

      const data = (await response.json()) as FeedResponse;
      if (images.length > 0) {
        console.info('업로드 성공, 사진 업로드 중');
        console.info(data.imagePresignedUrl);

        const presignedUrls = data.imagePresignedUrl;
        console.info('Presigned URL: ', presignedUrls);
        if (images.length !== presignedUrls.length)
          throw new Error('이미지와 presigned URL 개수가 다릅니다');

        // S3에 이미지 업로드
        const uploadPromises = images.map((file, index) => {
          const presignedUrl = presignedUrls[index];
          if (presignedUrl === undefined)
            throw new Error('Presigned URL is undefined');
          return uploadImageToS3(file, presignedUrl);
        });

        const uploadedUrls = await Promise.all(uploadPromises);
        console.info('모든 이미지 업로드 성공: ', uploadedUrls);
      }

      void navigate(`/community/${data.id}`, {
        state: { from: 'communitypost' },
      });
    } catch (error) {
      console.error('에러 발생:', error);
    }
  };

  const handleEditClickWrapper = () => {
    void handleEditClick();
  };

  const handleSelectTag = () => {
    setIsTagPopupActive(true);
  };

  const handleCloseTag = () => {
    setIsTagPopupActive(false);
  };

  const handleTextareaInput = (textarea: HTMLTextAreaElement) => {
    if (styles.contentBox === undefined)
      throw new Error('contentBox is undefined');
    const contentBox = document.querySelector(
      `.${styles.contentBox}`,
    ) as HTMLElement;

    textarea.style.height = 'auto';

    const contentBoxBottom = contentBox.getBoundingClientRect().bottom;
    const screenHeight = window.innerHeight;
    const maxHeight = screenHeight - contentBoxBottom;

    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${newHeight}px`;
  };

  const handleTagButtonClick = (tagValue: string) => {
    setTag(tagValue);
    setTimeout(() => {
      setIsTagPopupActive(false);
    }, 100);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      const newFiles = Array.from(e.target.files);
      const totalFiles = images.length + newFiles.length;

      if (totalFiles > 10) {
        alert('이미지는 최대 10개까지 업로드할 수 있습니다.');
        setImages((prev) => [...prev, ...newFiles.slice(0, 10 - prev.length)]);
      } else {
        setImages((prev) => [...prev, ...newFiles]);
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddHashtag = () => {
    setArticle((prev) => `${prev}#`);
  };

  return (
    <div className={styles.main}>
      <div className={styles.upperBar}>
        <img
          src={quitIcon}
          style={{ height: '25px' }}
          onClick={() => {
            void navigate(-1);
          }}
        />
        <p className={styles.pageTitle}>동네생활 글쓰기</p>
        <p className={styles.registerButton} onClick={handleEditClickWrapper}>
          완료
        </p>
      </div>
      <div className={styles.contentBox}>
        <div className={styles.selectTagButton} onClick={handleSelectTag}>
          {tag !== '' ? tag : '게시글의 주제를 선택해주세요.'}
          <img src={rightArrow} style={{ height: '18px' }} />
        </div>
        <input
          className={styles.titleInput}
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <textarea
          className={styles.articleBox}
          placeholder={LONG_PLACEHOLDER_TEXT}
          value={article}
          onChange={(e) => {
            setArticle(e.target.value);
          }}
          onInput={(e) => {
            handleTextareaInput(e.target as HTMLTextAreaElement);
          }}
        />
        <div className={styles.imageBox}>
          {images.map((image, index) => (
            <div key={index} className={styles.imageWrapper}>
              <img
                src={URL.createObjectURL(image)}
                alt={`Uploaded ${index}`}
                className={styles.uploadedImage}
              />
              <button
                className={styles.removeImageButton}
                onClick={() => {
                  handleRemoveImage(index);
                }}
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.bottomBar}>
        <label className={styles.bottomButton}>
          <input
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
          <img src={pictureIcon} height={'20px'} />
          사진
        </label>
        <div className={styles.bottomButton} onClick={handleAddHashtag}>
          <img src={hashtagIcon} height={'20px'} />
          태그
        </div>
      </div>
      {loading && <Loader marginTop="30vh" />}
      {isTagPopupActive && (
        <div className={styles.popupOverlay}>
          <div className={styles.closeOverlay} onClick={handleCloseTag} />
          <div className={styles.popupBox}>
            <h3>게시글 주제를 선택해주세요.</h3>
            {TagsArray.map((Tags) => (
              <div key={Tags.category}>
                <h4>{Tags.category}</h4>
                <div className={styles.tagBox}>
                  {Tags.tags.map((tagValue, index) => (
                    <button
                      key={index}
                      className={
                        tagValue === tag
                          ? styles.activeTagButton
                          : styles.tagButton
                      }
                      onClick={() => {
                        handleTagButtonClick(tagValue);
                      }}
                    >
                      {tagValue}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityEditPage;
