/*
 * - 提供更多挑戰時段 [customizeChallengeTimeSelector]
 * - 變更挑戰時段的文字顯示 [changeChallengeTimeDisplay]
 */

import React from '../utils/react-like.js';
import customizeChallengeTimeSelector from '../components/customize-challenge-time-selector.js';

const changeChallengeTimeDisplay = () => {
  const el = document.querySelectorAll('select[name=start_time]')[1];
  el.childNodes.forEach(el => {
    const secs = parseInt(el.value, 10),
          date = new Date(secs * 1000),
          str = date.toLocaleString();
    el.textContent = str;
  });
};

customizeChallengeTimeSelector();
changeChallengeTimeDisplay();
