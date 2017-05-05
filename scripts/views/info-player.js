/*
 * - 加上額外資訊 [appendExtraInfo]
 */

import React from '../utils/react-like.js';
import htmlParser from '../helpers/htmlParser.js';

const appendExtraInfo = () => {
  const el = document.querySelector('.center'),
        playerInfo = htmlParser(el);

  ['total_exp', 'player_score'].forEach(key => {
    const name = chrome.i18n.getMessage('player_' + key),
          value = playerInfo[key];
    const jsx = (
      <tr>
        <th>{name}</th>
        <td>{value}</td>
      </tr>
    );
    document.querySelector('.vertical_table > tbody').appendChild(jsx);
  });
};

//don't apply on info/player-*/transfer
if (location.href.search('transfer') < 0) {
  appendExtraInfo();
}
