if (sessionStorage.getItem('becasDemoAuth') !== '1') {
  window.location.replace('login.html');
}

document.getElementById('logoutBtn').addEventListener('click', () => {
  sessionStorage.removeItem('becasDemoAuth');
  window.location.href = 'index.html';
});

const target = new Date('2026-09-30T23:59:00-06:00').getTime();
function updateCountdown(){
  const diff = Math.max(0, target - Date.now());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  document.getElementById('days').textContent = days;
  document.getElementById('hours').textContent = String(hours).padStart(2,'0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2,'0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2,'0');
}
updateCountdown();
setInterval(updateCountdown,1000);

window.addEventListener('message', (event) => {
  const iframe = document.getElementById('progressFrame');
  if (!iframe || event.source !== iframe.contentWindow || !event.data || event.data.type !== 'avance-height') return;

  const reportedHeight = Number(event.data.height);
  if (!Number.isFinite(reportedHeight) || reportedHeight <= 0) return;

  const nextHeight = Math.max(760, Math.ceil(reportedHeight));
  const currentHeight = Math.round(iframe.getBoundingClientRect().height);
  if (Math.abs(nextHeight - currentHeight) >= 2) {
    iframe.style.height = `${nextHeight}px`;
  }
});
