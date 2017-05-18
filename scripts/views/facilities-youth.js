/*
 * - 加上額外資訊 [appendExtraInfo]
 */

import React from '../utils/react-like.js';
import * as request from '../utils/request.js';
import Player from '../models/player.js';

const appendExtraInfo = (keys, insertTo) => {
  if (keys.length <= 0) {
    return;
  }

  const elHeadRow = document.querySelectorAll('.horizontal_table thead tr'),
        elBodyRow = document.querySelectorAll('.horizontal_table tbody tr');

  elHeadRow.forEach(tr => {
    for (let i = keys.length - 1; i > -1; i--) {
      const key = keys[i],
            name = chrome.i18n.getMessage('player_' + key),
            th = <th>{name}</th>;
      tr.insertBefore(th, tr.children[insertTo]);
    }
  });

  elBodyRow.forEach(tr => {
    const elPlayerName = tr.querySelector('td:first-child a:nth-child(2)'),
          playerUrl = elPlayerName && elPlayerName.href;
    if (playerUrl) {
      request.get(playerUrl).then(doc => {
        const el = doc.querySelector('div.center'),
              player = new Player(el);
        for (let i = keys.length - 1; i > -1; i--) {
          const key = keys[i],
                td = <td>{player[key]}</td>;
          tr.insertBefore(td, tr.children[insertTo]);
        }
      });
    }
  });
};

let keys = [],
    insertTo = 0;
if (location.href.search('youth/youthsquad') > -1) {
  keys = ['training_morale', 'market_value'];
  insertTo = 3;
} else if (location.href.search('youth/log') > -1) {
  keys = ['talent'];
  insertTo = 4;
}
appendExtraInfo(keys, insertTo);
