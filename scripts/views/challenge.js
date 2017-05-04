/*
 * - 可以選擇更多挑戰時段 [customizeChallengeTimeElement]
 * - 可以對別的球隊發送多個友誼賽挑戰時段 [appendMultiChallengeElement]
 */

import React from '../utils/react-like.js';
import * as utils from '../utils/common.js';
import * as request from '../utils/request.js';

const customizeChallengeTimeElement = () => {
  const el = document.querySelector('select[name=start_time]'),
        firstSecs = el.firstChild.value,
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

const appendMultiChallengeElement = () => {
  const form = document.querySelector('div.center > form'),
        teamName = document.querySelector('div.center > h2').textContent,
        TIMES = 6,
        PERIOD = 60 * 60 * 2; //2 hours

  const onclick = e => {
    const startSecs = parseInt(form.querySelector('[name=start_time]').value, 10);
    const data = {};
    form.querySelectorAll('[name]').forEach(el => data[el.name] = el.value);
    for (let i = 0; i < TIMES; i++) {
      data.start_time = startSecs + PERIOD * i;
      request.post(form.action, { data });
    }
    alert(chrome.i18n.getMessage('msg_multi_challenge').format(teamName, TIMES));
  };

  const text = chrome.i18n.getMessage('text_multi_challenge'),
        btn = utils.createButton(text, onclick);
  document.querySelector('div.center').appendChild(btn);
};

customizeChallengeTime();
appendMultiChallengeElement();
