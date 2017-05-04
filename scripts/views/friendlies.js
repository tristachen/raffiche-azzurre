/*
 * - 可以選擇更多挑戰時段 [customizeChallengeTimeElement]
 * - 變更挑戰時段的文字顯示 [changeChallengeTimeDisplay]
 */

import React from '../utils/react-like.js';

const customizeChallengeTimeElement = () => {
  const el = document.querySelector('select[name=start_time]'),
        firstSecs = parseInt(el.firstChild.value, 10),
        NUMBERS = 72,
        PERIOD = 60 * 60; //1 hour

  //clear default options
  el.innerHTML = '';

  //add customization options
  for (let i = 0; i < NUMBERS; i++) {
    const secs = firstSecs + PERIOD * i,
          date = new Date(secs * 1000),
          str = date.toLocaleString();
    el.appendChild(<option value={secs}>{str}</option>);
  }
};

const changeChallengeTimeDisplay = () => {
  const el = document.querySelectorAll('select[name=start_time]')[1];
  el.childNodes.forEach(el => {
    const secs = parseInt(el.value, 10),
          date = new Date(secs * 1000),
          str = date.toLocaleString();
    el.textContent = str;
  });
};

customizeChallengeTimeElement();
changeChallengeTimeDisplay();
