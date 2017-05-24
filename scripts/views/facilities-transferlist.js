/*
 * - 加上額外資訊 [appendExtraInfo]
 * - localStorage key: transfer-check-items
 */

import React from '../utils/react-like.js';
import * as utils from '../utils/common.js';
import * as request from '../utils/request.js';
import Player from '../models/player.js';
import appendCheckList from '../components/player-info-check-list.js';

const STORAGE_KEY = 'transfer-check-items';

const appendExtraInfo = () => {
  const elHeadRow = document.querySelector('.horizontal_table thead tr'),
        elBodyRow = document.querySelectorAll('.horizontal_table tbody tr');

  let keys = localStorage.getItem(STORAGE_KEY);
  keys = keys ? JSON.parse(keys) : [];

  //head
  keys.forEach(key => {
    elHeadRow.appendChild(<th>{chrome.i18n.getMessage('player_' + key)}</th>);
  });

  //body
  elBodyRow.forEach(el => {
    const elName = el.querySelector('td:first-child a:nth-child(2)');
    if (elName) {
      const playerUrl = elName.href,
            player = new Player({ url: playerUrl });
      player.fetch().then(() => {
        player.parseBidPriceElement(el.children[4]);
        el.children[3].textContent = player.format('age_string');
        el.children[4].textContent = player.format('bid_price');
        keys.forEach(key => el.appendChild(<td>{player.format(key)}</td>));
        $('.horizontal_table').trigger('update');
      });
    }
  });
  $('.horizontal_table').tablesorter();
};

appendCheckList(document.querySelector('.subtab-content').children[1], STORAGE_KEY);
appendExtraInfo();
