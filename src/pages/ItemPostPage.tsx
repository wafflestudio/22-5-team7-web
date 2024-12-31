/*
    물품 올리기 페이지
*/
import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import uploadIcon from '../assets/cameraIcon.svg';
import quitcross from '../assets/quitcross.svg';
import styles from '../css/ItemPostPage.module.css';

const LONG_PLACEHOLDER_TEXT = `에 올릴 게시글 내용을 작성해 주세요. (판매 금지 물품은 게시가 제한될 수 있어요.)

신뢰할 수 있는 거래를 위해 자세히 적어주세요. 과학기술정보통신부, 한국 인터넥진흥원과 함께 해요.`;

const ItemPostPage = () => {
  const [title, setTitle] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [article, setArticle] = useState<string>('');
  const [place, setPlace] = useState<string>('');
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

  const handlePostClick = () => {
    //지금은 메인으로 가는데 다음에는 아이템 상세화면으로 갈 예정
    void navigate('/main');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files !== null) {
      const fileArray = Array.from(files).slice(0, 5); // 최대 5개 파일 선택
      setImages(fileArray);
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

  useEffect(() => {
    if (textareaRef.current !== null) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [article]);

  return (
    <div className={styles.main}>
      <div className={styles.upperbar}>
        <NavLink to="/main">
          <img src={quitcross} className={styles.quitcross} />
        </NavLink>
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
              <p className={styles.imagecount}>{images.length} / 5</p> {}
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
            selectedButton === 'free' ? '₩ 0' : price === '' ? '' : `₩ ${price}`
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
            {selectedButton === 'free' ? '나눔 신청 받기' : '가격 제안 받기'}
          </p>
        </div>
        <p className={styles.infotexts}>자세한 설명</p>
        <textarea
          className={styles.articleBox}
          placeholder={LONG_PLACEHOLDER_TEXT}
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
        <button onClick={handlePostClick} className={styles.PostButton}>
          작성 완료
        </button>
        <div className={styles.helpBox}></div>
      </div>
    </div>
  );
};

export default ItemPostPage;
