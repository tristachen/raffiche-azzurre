import * as request from '../utils/request.js';

import css from '../../styles/index.styl';
import routerPath from '../url-mappings.json';
import React from '../utils/react-like.js';

//TODO: generate prefix url
const paths = location.pathname.split('/');
const prefixUrl = location.origin + '/' + paths[1] + '/' + paths[2];
const btnKeys = ['train', 'youth', 'scout', 'friendlies', 'bsquad'];
const elemContent = document.getElementById('content');
const elemLinks = document.createElement('div');

btnKeys.forEach(key => {
  const link = document.createElement('a');
  link.href = prefixUrl + routerPath[key];
  link.innerText = chrome.i18n.getMessage(key);
  link.className = 'link';
  elemLinks.appendChild(link);
});
elemContent.insertBefore(elemLinks, elemContent.firstChild);



const autoAd = () => {
  const SELECTOR_VOTE_SITE = 'a.external';
  document.querySelectorAll(SELECTOR_VOTE_SITE).forEach(el => {
    request.get(el.href);
  });
  let count = parseInt(document.querySelector('#input-ad-count').value, 10);
  count--;
  localStorage.setItem('ad-count', count);
  setTimeout(() => location.reload(), 1000);
};

const toggleAd = e => {
  const isAd = e.currentTarget.dataset.ad === 'true';
  let count = parseInt(document.querySelector('#input-ad-count').value, 10);
  if (isAd && count > 0) {
    autoAd();
  } else {
    localStorage.setItem('ad-count', 0);
  }
  // renderAdingDom(isAd);
};

const renderAdingDom = isAd => {
  const btnText = isAd ? '停止自動點選廣告' : '自動點選廣告';
  const count = parseInt(localStorage.getItem('ad-count'), 10);
  const el = (
    <div id='el-autoAd-area'>
      <input id='input-ad-count' disabled={isAd} value={count || 0}/>
      <button id='btn-toggle-ad' data-ad={(!isAd).toString()}>{btnText}</button>
    </div>
  );
  elemLinks.appendChild(el);
  document.querySelector('#btn-toggle-ad').addEventListener('click', toggleAd);
};

const isAutoAd = parseInt(localStorage.getItem('ad-count'), 10) > 0;

if (document.querySelectorAll('a.external').length > 0) {
  renderAdingDom(isAutoAd);
}

if (isAutoAd) {
  autoAd();
}
