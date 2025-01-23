/*
    물품 올리기 페이지
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
import type { Item } from '../typings/item';
import { categories } from '../typings/item';
import { uploadImageToS3 } from '../utils/utils';

const LONG_PLACEHOLDER_TEXT = `에 올릴 게시글 내용을 작성해 주세요. (판매 금지 물품은 게시가 제한될 수 있어요.)

신뢰할 수 있는 거래를 위해 자세히 적어주세요. 과학기술정보통신부, 한국 인터넷진흥원과 함께 해요.`;

const ItemPostPage = () => {
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState('');
  const [showMore, setShowMore] = useState(false);
  const [price, setPrice] = useState<string>('');
  const [article, setArticle] = useState<string>('');
  const [place, setPlace] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [isChecked, setIsChecked] = useState(false);
  const [selectedButton, setSelectedButton] = useState('sell'); // 상태 추가
  const [images, setImages] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleButtonClick = (buttonType: string) => {
    if (buttonType === 'sell') {
      setPrice('');
      setIsChecked(false);
    }
    setSelectedButton(buttonType);
  };
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
      price: Number(price),
      location: place,
      imageCount: images.length,
      tag: category,
    };
    console.info('Post data:', postData);

    const token = localStorage.getItem('token');

    try {
      if (token === null) throw new Error('No token found');
      const response = await fetch('/api/item/post', {
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

      const data = (await response.json()) as Item;
      if (images.length > 0) {
        console.info('업로드 성공, 사진 업로드 중');
        console.info(data.article.imagePresignedUrl);

        const presignedUrls = data.article.imagePresignedUrl;
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

      void navigate(`/item/${data.article.id}`, {
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
            <p className={styles.upperbartext}>내 물건 팔기</p>
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
            <p className={styles.infotexts}>거래 방식</p>
            <div className={styles.selectbuttons}>
              <button
                onClick={() => {
                  handleButtonClick('sell');
                }}
                className={
                  selectedButton === 'sell'
                    ? styles.activebutton
                    : styles.inactivebutton
                }
              >
                판매하기
              </button>
              <button
                onClick={() => {
                  handleButtonClick('free');
                }}
                className={
                  selectedButton === 'free'
                    ? styles.activebutton
                    : styles.inactivebutton
                }
              >
                나눔하기
              </button>
            </div>
            <input
              className={styles.inputBox}
              type="text"
              placeholder="₩ 가격을 입력해주세요"
              value={
                selectedButton === 'free'
                  ? '₩ 0'
                  : price === ''
                    ? ''
                    : `₩ ${price}`
              }
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 남기기
                setPrice(value);
              }}
              disabled={selectedButton === 'free'}
            ></input>
            <div className={styles.pricesuggestion}>
              <input
                className={styles.suggestioncheckbox}
                type="checkbox"
                id="priceSuggestion"
                checked={isChecked}
                onChange={(e) => {
                  setIsChecked(e.target.checked);
                }}
              />
              <p>
                {selectedButton === 'free'
                  ? '나눔 신청 받기'
                  : '가격 제안 받기'}
              </p>
            </div>
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

export default ItemPostPage;
