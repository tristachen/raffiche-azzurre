/*
 * - 提供更多挑戰時段 [customizeChallengeTimeSelector]
 * - 可對該球隊發送多個友誼賽挑戰時段 [appendMultiChallengeElement]
 */

import React from '../utils/react-like.js';
import * as utils from '../utils/common.js';
import * as request from '../utils/request.js';
import customizeChallengeTimeSelector from '../components/customize-challenge-time-selector.js';

const appendMultiChallengeElement = () => {
  const form = document.querySelector('div.center > form'),
        teamName = document.querySelector('div.center > h2').textContent,
        TIMES = 6,
        PERIOD = 60 * 60 * 2; //2 hours

  const onclick = e => {
    const startSecs = parseInt(form.querySelector('[name=start_time]').value, 10),
          data = {};
    form.querySelectorAll('[name]').forEach(el => data[el.name] = el.value);
    for (let i = 0; i < TIMES; i++) {
      data.start_time = startSecs + PERIOD * i;
      request.post(form.action, { data });
    }
    alert(chrome.i18n.getMessage('msg_multi_challenge').format(teamName, TIMES));
  };

  const label = chrome.i18n.getMessage('label_multi_challenge'),
        btn = utils.createButton(label, onclick);
  document.querySelector('div.center').appendChild(btn);
};

customizeChallengeTimeSelector();
appendMultiChallengeElement();
