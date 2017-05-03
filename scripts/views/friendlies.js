import React from '../utils/react-like.js';

//1st
const startSecs = parseInt(document.querySelector('select[name=start_time] option').value, 10);

const elSearchTime = document.querySelectorAll('select[name=start_time]')[0];
elSearchTime.innerHTML = '';

for (let i = 0; i <= 72; i++) {
  const secs = startSecs + 60 * 60 * i;
  const date = new Date(secs * 1000);
  const timestring = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  elSearchTime.appendChild(<option value={secs}>{timestring}</option>);
}

//2nd
document.querySelectorAll('select[name=start_time]')[1].childNodes.forEach(el => {
  const timestamp = parseInt(el.value, 10) * 1000;
  const date = new Date(timestamp);
  const str = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  el.textContent = str;
});
