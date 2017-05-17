/*
 * - 增加閱兵按鈕 [appendParadeElement]
 */

import React from '../utils/react-like.js';

const appendParadeElement = () => {
  const ulMenu = document.querySelector('.menu ul'),
        playersUrl = ulMenu.querySelectorAll('a')[1].href,
        paradeUrl = playersUrl + '?tournament_id=all&parade',
        label = chrome.i18n.getMessage('label_parade');
  ulMenu.appendChild(<li><a href={paradeUrl}>{label}</a></li>);
};

appendParadeElement();
