export const getTimeAgo = (isoTimestamp: string): string => {
  const commentTime = new Date(isoTimestamp);
  const now = new Date();
  const diffMilliseconds = now.getTime() - commentTime.getTime();

  const diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));
  const diffHours = Math.floor(diffMilliseconds / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMilliseconds / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffMilliseconds / (1000 * 60 * 60 * 24 * 7));

  if (diffMinutes < 1) return '방금';
  if (diffMinutes < 60) return `${diffMinutes}분 전 `;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  return `${diffWeeks}주 전`;
};

export const uploadImageToS3 = async (
  file: File,
  presignedUrl: string,
): Promise<string> => {
  try {
    // S3로 파일 업로드
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to upload file: ${file.name}. Response: ${errorText}`,
      );
      //throw new Error(`Failed to upload file: ${file.name}`);
    }

    const returnUrl = presignedUrl.split('?')[0];
    if (returnUrl === undefined) throw new Error('returnUrl is undefined');
    return returnUrl; // query param 없는 url
  } catch (error) {
    console.error(`Error uploading file ${file.name}:`, error);
    throw error;
  }
};

export const calculateTimeLeft = (
  endTime: string,
  setTimeLeft: (time: string) => void,
) => {
  const interval = setInterval(() => {
    const now = new Date();
    const end = new Date(endTime);
    const timeDiff = end.getTime() - now.getTime();

    if (timeDiff <= 0) {
      clearInterval(interval);
      setTimeLeft('경매 종료');
    } else {
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      if (hours > 0) {
        setTimeLeft(`${hours}시간 ${minutes}분 ${seconds}초 남음`);
      } else if (minutes > 0) {
        setTimeLeft(`${minutes}분 ${seconds}초 남음`);
      } else {
        setTimeLeft(`${seconds}초 남음`);
      }
    }
  }, 1000);

  return interval;
};
