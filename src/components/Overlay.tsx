/*
  여러 페이지에서 다양하게 쓸 수 있는 Overlay 컴포넌트.
*/
import styles from '../css/Overlay.module.css';
import type { overlayProps } from '../typings/overlay';

const Overlay = ({ overlayInfo }: overlayProps) => {
  return (
    overlayInfo.isOpen && (
      <div>
        <div
          className={styles.overlay}
          onClick={overlayInfo.closeOverlayFunction}
        ></div>
        <div className={styles.actionSheet}>
          <div className={styles.actionSheetContent}>
            {overlayInfo.overlayButtons.map((overlayButton, index) => (
              <button
                key={index}
                className={styles.overlayButton}
                style={overlayButton.color === 'red' ? { color: 'red' } : {}}
                onClick={overlayButton.function}
              >
                {overlayButton.text}
              </button>
            ))}
          </div>
          <button
            onClick={overlayInfo.closeOverlayFunction}
            className={styles.cancelbutton}
          >
            닫기
          </button>
        </div>
      </div>
    )
  );
};

export default Overlay;
