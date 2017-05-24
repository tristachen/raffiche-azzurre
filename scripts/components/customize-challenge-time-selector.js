import React from '../utils/react-like.js';

const customizeChallengeTimeSelector = () => {
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

export default customizeChallengeTimeSelector;
