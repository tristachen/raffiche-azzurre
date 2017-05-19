/*
 * - 自動觀看比賽 [appendAutoWatchMatchElement]
 *   - localStorage key: auto-watch-match
 *     if (auto-watch-match) {
 *       renderWatchToggleElement(off);
 *       clickMatchAndReload();
 *     } else {
 *       renderWatchToggleElement(on);
 *     }
 */

import React from '../utils/react-like.js';
import * as utils from '../utils/common.js';
import * as request from '../utils/request.js';

const REFRESH_MINS = 5,
      REFRESH_PERIOD = 1000 * 60 * REFRESH_MINS;

const appendAutoWatchMatchElement = () => {
  const STORAGE_KEY = 'auto-watch-match',
        elContainer = document.querySelector('#content h2'),
        elMatchLinks = document.querySelectorAll('a[href *=match-]:not([href $=fixture])');
  let elMatchToggle, timer;

  const renderWatchToggleElement = isWatchEnabled => {
    const flag = isWatchEnabled ? 'off' : 'on',
          i18nKey = 'label_auto_match_{0}'.format(flag),
          btnLabel = chrome.i18n.getMessage(i18nKey);
    if (elMatchToggle) {
      elMatchToggle.parentNode.removeChild(elMatchToggle);
    }
    elMatchToggle = (
      <div>
        <button id='btn-toggle' data-toggle={flag}>{btnLabel}</button>
        <div id='js-refresh-time'></div>
      </div>
    );
    elContainer.appendChild(elMatchToggle);
    document.querySelector('#btn-toggle').addEventListener('click', toggleWatch);
  };

  const toggleWatch = e => {
    const isWatchEnabled = e.currentTarget.dataset.toggle === 'on';
    renderWatchToggleElement(isWatchEnabled);
    if (isWatchEnabled) {
      localStorage.setItem(STORAGE_KEY, 'on');
      clickMatchAndReload();
    } else {
      if (timer) {
        clearTimeout(timer);
      }
      localStorage.setItem(STORAGE_KEY, 'off');
    }
  };

  const clickMatchAndReload = () => {
    let label = chrome.i18n.getMessage('label_refresh');
    label = label.format(new Date().toLocaleTimeString(), REFRESH_MINS);
    elMatchLinks.forEach(el => request.get(el.href));
    document.querySelector('#js-refresh-time').textContent = label;
    timer = setTimeout(() => location.reload(), REFRESH_PERIOD);
  };

  if (elMatchLinks.length > 0) {
    const isWatchEnabled = localStorage.getItem(STORAGE_KEY) === 'on';
    renderWatchToggleElement(isWatchEnabled);
    if (isWatchEnabled) {
      clickMatchAndReload();
    }
  }
};

//don't apply on info/player-*/matches
if (location.href.search('player') < 0) {
  appendAutoWatchMatchElement();
}
