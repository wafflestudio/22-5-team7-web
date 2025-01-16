export const handleShareClick = () => {
  const url = window.location.href;
  navigator.clipboard
    .writeText(url)
    .then(() => {
      alert('URL이 클립보드에 복사되었습니다.');
    })
    .catch((err: unknown) => {
      console.error('URL 복사 실패:', err);
    });
};
