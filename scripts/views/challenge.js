import React from '../utils/react-like.js';
import * as request from '../utils/request.js';

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


const btn = document.createElement('button');
btn.textContent = '挑戰多次';
btn.onclick = e => {

  const form = document.querySelector('.center form'),
        formdata = new FormData(form);

  const startTime = parseInt(formdata.get('start_time'), 10),
        teamId = formdata.get('team_id'),
        matchType = formdata.get('match_type'),
        challenge = document.querySelector('[name=challenge]').value;
         //formdata.get('challenge');

  let times = 6;

  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      request.post(form.action, {
        data: {
          start_time: startTime + 60 * 60 * 2 * i,
          challenge: challenge,
          team_id: teamId,
          match_type: matchType
        }
      })
    }, 1000 * (i + 1));
  }
  alert('已經向隊伍 ' + teamId + ' 發出了 ' + times + ' 次友誼賽請求，請等待對方接受')
}
document.querySelector('div.center').appendChild(btn);


//http://rockingsoccer.com/zh-tw/football/friendlies/friendlies/challenge
