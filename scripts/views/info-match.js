/*
 * - 劇透功能 [appendSpoilerElement]
 */

import React from '../utils/react-like.js';
import * as utils from '../utils/common.js';

const appendSpoilerElement = () => {
  const elContainer = document.querySelector('.middle'),
        elResults = document.querySelectorAll('.notes > ul > li');

  if (elResults.length > 1) {
    const label = chrome.i18n.getMessage('label_spoiler'),
          onclick = e => elResults[0].click(),
          btn = utils.createButton(label, onclick);
    elContainer.insertBefore(<div>{btn}</div>, elContainer.firstChild);
  }
};

//don't apply on info/match-*/fixture
if (location.href.search('fixture') < 0) {
  appendSpoilerElement();
}
