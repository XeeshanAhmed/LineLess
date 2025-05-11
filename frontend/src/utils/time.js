export function getEstimatedTimeInPKT(minutesFromNow=0) {
  const minutes=Number(minutesFromNow);
  const futureTime = new Date(Date.now() + minutes * 60000);
  return futureTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Karachi',
  });
}
