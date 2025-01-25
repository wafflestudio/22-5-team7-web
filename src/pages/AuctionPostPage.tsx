/*
    경매 물품 올리기 페이지
*/
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import uploadIcon from '../assets/cameraIcon.svg';
import checkmark from '../assets/checkmark.svg';
import checkmarkorange from '../assets/checkmark_orange.svg';
import leftarrow from '../assets/leftarrow.svg';
import quitcross from '../assets/quitcross.svg';
import grayRightArrow from '../assets/rightarrow_gray.svg';
import styles from '../css/ItemPostPage.module.css';
import type { AuctionItem } from '../typings/auctionitem';
import { categories } from '../typings/item';
import { uploadImageToS3 } from '../utils/utils';

const LONG_PLACEHOLDER_TEXT = `에 올릴 게시글 내용을 작성해 주세요. (판매 금지 물품은 게시가 제한될 수 있어요.)

신뢰할 수 있는 거래를 위해 자세히 적어주세요. 과학기술정보통신부, 한국 인터넷진흥원과 함께 해요.`;

const AuctionPostPage = () => {
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState('');
  const [showMore, setShowMore] = useState(false);
  const [price, setPrice] = useState<string>('');
  const [article, setArticle] = useState<string>('');
  const [place, setPlace] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [timeLimit, setTimeLimit] = useState<string>('');
  //const [isChecked, setIsChecked] = useState(false);
  //const [selectedButton, setSelectedButton] = useState('sell'); // 상태 추가
  const [images, setImages] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current !== null) {
      const length = inputRef.current.value.length - 2;
      inputRef.current.setSelectionRange(length, length);
      inputRef.current.focus();
    }
  }, [timeLimit]);

  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setArticle(e.target.value);
    if (textareaRef.current !== null) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleCategoryClick = (selectedCategory: string) => {
    setCategory(selectedCategory);
  };

  useEffect(() => {
    if (textareaRef.current !== null) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
    setLocation(localStorage.getItem('location') ?? 'error');
  }, [article]);

  const handlePostClick = async () => {
    const postData = {
      title,
      content: article,
      startingPrice: Number(price),
      duration: Number(timeLimit),
      location: place,
      imageCount: images.length,
      tag: category,
    };
    console.info('Post data:', postData);

    const token = localStorage.getItem('token');

    try {
      if (token === null) throw new Error('No token found');
      const response = await fetch('/api/auction/post', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error('서버에 데이터를 전송하지 못했습니다.');
      }

      const data = (await response.json()) as AuctionItem;
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

      void navigate(`/auctions/${data.id}`, {
        state: { from: 'itempost' },
      });
    } catch (error) {
      console.error('에러 발생:', error);
    }
  };

  const handlePostClickWrapper = () => {
    void handlePostClick();
  };

  return (
    <div className={styles.main}>
      {!showMore ? (
        <div className={styles.normal}>
          <div className={styles.upperbar}>
            <button
              onClick={() => {
                void navigate(-1);
              }}
              className={styles.button}
            >
              <img src={quitcross} className={styles.quitcross} />
            </button>
            <p className={styles.upperbartext}>내 물건 경매하기</p>
            <p>임시저장</p>
          </div>
          <div className={styles.imageToolbox}>
            <div className={styles.imageUpload}>
              <input
                className={styles.fileInput}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                id="fileInput"
              />
              <label htmlFor="fileInput" className={styles.fileInputLabel}>
                <div className={styles.uploadcontainer}>
                  <img
                    src={uploadIcon}
                    alt="Upload"
                    className={styles.uploadicon}
                  />
                  <p className={styles.imagecount}>{images.length} / 10</p> {}
                </div>
              </label>
            </div>
            <div className={styles.imagePreview}>
              {images.map((image, index) => (
                <div key={index} className={styles.imageContainer}>
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`첨부된 이미지 ${index + 1}`}
                    className={styles.previewImage}
                  />
                  {index === 0 && (
                    <div className={styles.firstImageLabel}>대표 사진</div>
                  )}
                  <button
                    className={styles.removeButton}
                    onClick={() => {
                      handleRemoveImage(index);
                    }}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.content}>
            <p className={styles.infotexts}>제목</p>
            <input
              className={styles.inputBox}
              type="text"
              placeholder="글 제목"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            ></input>
            <div className={styles.categoryButtons}>
              {category === '' ? (
                <>
                  {categories.slice(0, 3).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setCategory(cat);
                      }}
                      className={styles.notSelectedCategory}
                    >
                      {cat}
                    </button>
                  ))}
                  <img
                    src={grayRightArrow}
                    onClick={() => {
                      setShowMore(!showMore);
                    }}
                    className={styles.moreButton}
                  ></img>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      handleCategoryClick(category);
                    }}
                    className={styles.selectedCategory}
                  >
                    {category}
                  </button>
                  {categories
                    .filter((cat) => cat !== category)
                    .slice(0, 2)
                    .map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          handleCategoryClick(cat);
                        }}
                        className={styles.notSelectedCategory}
                      >
                        {cat}
                      </button>
                    ))}
                  <img
                    src={grayRightArrow}
                    onClick={() => {
                      setShowMore(!showMore);
                    }}
                    className={styles.moreButton}
                  ></img>
                </>
              )}
            </div>
            <p className={styles.infotexts}>시작 가격</p>
            <input
              className={styles.inputBox}
              type="text"
              placeholder="₩ 가격을 입력해주세요"
              value={price === '' ? '' : `₩ ${price}`}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 남기기
                setPrice(value);
              }}
            ></input>
            <p className={styles.infotexts}>경매 진행 시간</p>
            <input
              ref={inputRef}
              className={styles.inputBox}
              type="text"
              placeholder="시간을 분 단위로 입력해주세요. 24시간까지 가능해요"
              value={timeLimit === '' ? '' : `${timeLimit} 분`}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                setTimeLimit(value);
              }}
            />
            <p className={styles.infotexts}>자세한 설명</p>
            <textarea
              className={styles.articleBox}
              placeholder={location + LONG_PLACEHOLDER_TEXT}
              value={article}
              onChange={handleTextareaChange}
              ref={textareaRef}
            ></textarea>
            <p className={styles.infotexts}>거래 희망 장소</p>
            <input
              className={styles.inputBox}
              type="text"
              placeholder="위치 추가"
              value={place}
              onChange={(e) => {
                setPlace(e.target.value);
              }}
            ></input>
            <button
              onClick={handlePostClickWrapper}
              className={styles.PostButton}
            >
              작성 완료
            </button>
            <div className={styles.helpBox}></div>
          </div>
        </div>
      ) : (
        <div className={styles.category}>
          <div className={styles.upperbar}>
            <button
              onClick={() => {
                setShowMore(false);
              }}
              className={styles.button}
            >
              <img src={leftarrow} className={styles.quitcross} />
            </button>
            <p className={styles.upperbartext}>카테고리 선택</p>
          </div>
          <div className={styles.categoryListView}>
            <ul className={styles.categoryList}>
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      setCategory(cat);
                    }}
                    className={
                      category === cat
                        ? styles.selectedCategoryButton
                        : styles.notSelectedCategoryButton
                    }
                  >
                    {cat}
                    <img
                      src={category === cat ? checkmarkorange : checkmark}
                      className={
                        category === cat
                          ? styles.checkmark
                          : styles.checkmarknotSelected
                      }
                    ></img>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionPostPage;
