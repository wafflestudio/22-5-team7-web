export type toolBarInfo = {
  path: string;
  mainText: string;
  toolBarItems: toolBarItem[];
};

type toolBarItem = {
  pathTo: string;
  alt: string;
  icon: string;
};

export type UpperBarProps = {
  toolBarInfo: toolBarInfo;
};