type overlayInfo = {
  isOpen: boolean;
  closeOverlayFunction: () => void;
  overlayButtons: overlayButton[];
};

type overlayButton = {
  color: string;
  text: string;
  function: () => void;
};

export type overlayProps = {
  overlayInfo: overlayInfo;
};
