import * as request from '../utils/request.js';
import React from '../utils/react-like.js';

//Q: 有自行設定時間的需求嗎
const count = (location.href.match(/friendlies/g)).length;
if (count < 2) {
  const autoWatch = () => {
    document.querySelectorAll('a.match').forEach(el => {
      request.get(el.href);
    });
    document.querySelector('#js-refresh-time').textContent = '刷新時間：' + new Date().toLocaleTimeString();
    setTimeout(() => location.reload(), 300000);
  };

  const toggleWatch = e => {
    const isWatch = e.currentTarget.dataset.watch === 'true';
    renderWatchingDom(isWatch);
    if (isWatch) {
      autoWatch();
      localStorage.setItem('autoWatch', 'true');
    } else {
      localStorage.setItem('autoWatch', 'false');
    }
  };

  const renderWatchingDom = isWatch => {
    let element = document.querySelector('#el-autowatch-area');
    if (element) {
      element.parentNode.removeChild(element);
    }
    const btnText = isWatch ? '停止自動觀看比賽' : '自動觀看比賽';
    const el = (
      <div id='el-autowatch-area'>
        <button id='btn-toggle-watch' data-watch={(!isWatch).toString()}>{btnText}</button>
        <div id='js-refresh-time'></div>
      </div>
    );
    document.querySelector('#content h2').appendChild(el);
    document.querySelector('#btn-toggle-watch').addEventListener('click', toggleWatch);
  };

  const isAutoWatch = localStorage.getItem('autoWatch') === 'true';
  renderWatchingDom(isAutoWatch);

  if (isAutoWatch) {
    autoWatch();
  }
}
