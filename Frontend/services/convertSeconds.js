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

// Chuyển giây sang định dạng "00:00:00"
function formatTime(seconds) {
  // Làm tròn số giây
  const roundedSeconds = Math.round(seconds);

  // Tính giờ, phút, và giây
  const hours = Math.floor(roundedSeconds / 3600);
  const minutes = Math.floor((roundedSeconds % 3600) / 60);
  const remainingSeconds = roundedSeconds % 60;

  // Định dạng thành HH:MM:SS
  const formattedTime = [
    String(hours).padStart(2, '0'),
    String(minutes).padStart(2, '0'),
    String(remainingSeconds).padStart(2, '0'),
  ].join(':');

  return formattedTime;
}

function parseTimeString(timeString) {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

// Chuyển từ "00:00:00" sang giây trong video
function seekToTimeInVideo(timeString) {
  if (timeString === 0) {
    return '00:00:00';
  }
  const video = document.getElementById('myVideo');
  const timeInSeconds = parseTimeString(timeString);
  return timeInSeconds;
}
