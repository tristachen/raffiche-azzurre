import React from '../utils/react-like.js';
import htmlParser from '../helpers/htmlParser.js';

if (location.href.search('transfer') < 0) {
  const dom = document.querySelector('.center');
  const playerInfo = htmlParser(dom);

  ['total_exp', 'player_score'].forEach(key => {
    const name = chrome.i18n.getMessage('player_' + key);
    const value = playerInfo[key];
    const jsx = (
      <tr>
        <th>{key}</th>
        <td>{value}</td>
      </tr>
    );
    document.querySelector('.vertical_table > tbody').appendChild(jsx);
  });
}
