function timeToSeconds(time) {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

function secondsToTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Đảm bảo định dạng luôn là 2 chữ số
  let formattedTime = [];

  if (hours > 0) formattedTime.push(String(hours).padStart(2, '0'));
  if (minutes > 0 || hours > 0)
    formattedTime.push(String(minutes).padStart(2, '0'));
  formattedTime.push(String(seconds).padStart(2, '0'));

  return formattedTime.join(':');
}

function sumTimes(timeArray) {
  const totalSeconds = timeArray.reduce(
    (sum, time) => sum + timeToSeconds(time),
    0
  );
  return secondsToTime(totalSeconds);
}
