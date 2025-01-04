export const getTimeAgo = (isoTimestamp: string): string => {
    const commentTime = new Date(isoTimestamp);
    const now = new Date();
    const diffMilliseconds = now.getTime() - commentTime.getTime();

    const diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));
    const diffHours = Math.floor(diffMilliseconds / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMilliseconds / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffMilliseconds / (1000 * 60 * 60 * 24 * 7));

    if (diffMinutes < 1) return '방금';
    if (diffMinutes < 60) return `${diffMinutes} 분 전 `;
    if (diffHours < 24) return `${diffHours} 시간 전`;
    if (diffDays < 7) return `${diffDays} 일 전`;
    return `${diffWeeks} 주 전`;
  };