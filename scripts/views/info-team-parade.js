/*
 * - 從球隊/球員頁面來修改的，改成單欄式，只顯示球員列表 [relayout]
 * - 可自行選擇要列出的資料 [appendExtraInfo]
 *    - localStorage key: parade-check-items
 * - 增加統計列 [appendStatisticalRow]
 */

import React from '../utils/react-like.js';
import * as utils from '../utils/common.js';
import Player from '../models/player.js';
import appendCheckList from '../components/player-info-check-list.js';

const STORAGE_KEY = 'parade-check-items';

const relayout = () => {
  document.querySelector('div#menu').outerHTML = '';
  document.querySelector('div.side').outerHTML = '';
  document.querySelector('div.center form').outerHTML = '';
  document.querySelector('.two_cols_wide').classList.remove('two_cols_wide');
  document.querySelector('#content').classList.add('one-col');

  const elTeam = document.querySelector('div.center h2'),
        teamName = elTeam.textContent,
        teamUrl = location.href.match(/(.*)\/players/)[1],
        labelBack = chrome.i18n.getMessage('label_back_team').format(teamName);
  elTeam.appendChild(<h3><a href={teamUrl}>{labelBack}</a></h3>);
};

const appendExtraInfo = () => {
  const REMOVE_BEHIND_CHILD_NUM = 7;
  const elHeadRow = document.querySelector('.horizontal_table thead tr'),
        elBodyRow = document.querySelectorAll('.horizontal_table tbody tr'),
        playerNum = elBodyRow.length,
        players = [];

  let keys = localStorage.getItem(STORAGE_KEY);
  keys = keys ? JSON.parse(keys) : [];

  //head
  for (let i = 0; i < REMOVE_BEHIND_CHILD_NUM; i++) {
    elHeadRow.removeChild(elHeadRow.lastChild);
  }
  keys.forEach(key => {
    elHeadRow.appendChild(<th>{chrome.i18n.getMessage('player_' + key)}</th>);
  });

  //body
  elBodyRow.forEach(el => {
    const playerUrl = el.querySelector('td:first-child a').href,
          player = new Player({ url: playerUrl });
    player.fetch().then(() => {
      for (let i = 0; i < REMOVE_BEHIND_CHILD_NUM; i++) {
        el.removeChild(el.lastChild);
      }
      keys.forEach(key => el.appendChild(<td>{player.format(key)}</td>));
      el.children[2].textContent = player.age_string;

      players.push(player);
      if (players.length === playerNum) {
        appendStatisticalRow(players, keys);
      }
    });
  });
};

const appendStatisticalRow = (players, keys) => {
  const TOP_NUM = 11,
        playerNum = players.length;

  let total = [],
      top = [];

  //sort
  players.sort((a, b) => {
    if (parseFloat(a.min_value) < parseFloat(b.min_value)) {
      return 1;
    } else if (parseFloat(a.min_value) > parseFloat(b.min_value)) {
      return -1;
    } else {
      return 0;
    }
  });

  //calc total value and get top value
  players.forEach((player, i) => {
    keys.forEach((key, j) => {
      if (typeof player[key] === 'number') {
        total[j] = total[j] ? total[j] + player[key] : player[key];
      }
    });
    if (i === TOP_NUM - 1) {
      top = total.map(v => v);
    }
  });

  //append row
  const table = document.querySelector('.horizontal_table');
  table.appendChild(
    <tfoot>
      <tr>
        <td><strong>{chrome.i18n.getMessage('label_all')}</strong></td>
        <td>{playerNum}</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td><strong>{'Top {0}'.format(TOP_NUM)}</strong></td>
        <td>{TOP_NUM}</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    </tfoot>
  );

  const row = table.querySelectorAll('tfoot tr'),
        totalPlayer = new Player(), //purpose: use player function
        topPlayer = new Player(); //purpose: use player function
  keys.forEach((value, i) => {
    if (total[i]) {
      totalPlayer[value] = total[i] / playerNum;
      topPlayer[value] = top[i] / TOP_NUM;
      row[0].appendChild(<td>{totalPlayer.format(value)}</td>);
      row[1].appendChild(<td>{topPlayer.format(value)}</td>);
    } else {
      row[0].appendChild(<td></td>);
      row[1].appendChild(<td></td>);
    }
  });
  $('.horizontal_table').tablesorter();
};

relayout();
appendCheckList(document.querySelector('.center').children[2], STORAGE_KEY);
appendExtraInfo();
