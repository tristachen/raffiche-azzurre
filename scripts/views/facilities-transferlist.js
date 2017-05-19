/*
 * - 加上額外資訊 [appendExtraInfo]
 * - localStorage key: transfer-check-items
 */

import common from '../utils/common.js';
import React from '../utils/react-like.js';
import * as request from '../utils/request.js';
import Player from '../models/player.js';

const PROP_KEYS = [
  'talent',
  'scoring',

  'endurance',
  'passing',

  'power',
  'dueling',

  'speed',
  'blocking',

  'tactics',

  'special_attributes',

  'main_feature',
  'total_exp2',
  'player_score2',
  'premium_rate',
  'born'
];
let keys;

const appendCheckItems = () => {
  const target = document.querySelector('.subtab-content');
  const el = (
    <div>
      <div></div>
      <button id='btnCheck'>{'OK'}</button>
    </div>
  );

  PROP_KEYS.forEach(key => {
    const elCheck = (
      <span>
        <input type='checkbox' name='items[]' value={key}/>
        {chrome.i18n.getMessage('player_' + key)}
      </span>
    );
    el.firstChild.appendChild(elCheck);
  });

  keys = localStorage.getItem('transfer-check-items');
  keys = keys ? JSON.parse(keys) : [];
  keys.forEach(key => {
    const input = el.querySelector('input[value={0}]'.format(key));
    if (input) {
      input.checked = true;
    }
  });

  el.querySelector('#btnCheck').onclick = e => {
    keys = [].map.call(document.querySelectorAll('input[name*=items]:checked'), el => el.value);
    localStorage.setItem('transfer-check-items', JSON.stringify(keys));
    location.reload();
  };
  target.insertBefore(el, target.children[1]);
};

const appendExtraInfo = () => {
  const elHeadRow = document.querySelector('.horizontal_table thead tr'),
        elBodyRow = document.querySelectorAll('.horizontal_table tbody tr'),
        playerNum = elBodyRow.length,
        players = [];

  //head
  keys.forEach(key => {
    elHeadRow.appendChild(<th>{chrome.i18n.getMessage('player_' + key)}</th>);
  });

  //body
  elBodyRow.forEach(el => {
    const playerUrl = el.querySelector('td:first-child a:nth-child(2)').href,
          employmentUrl = playerUrl + '/employment';

    const player = new Player({ url: playerUrl });
    player.fetch().then(() => {
      el.children[3].textContent = player.age_string;

      const money = el.children[4].textContent,
            moneyStr = money.match(/\D/ig)[0],
            moneyInt = parseInt(money.replace(/\D/ig, ''), 10).format(0),
            mm = moneyStr + moneyInt;

      player.bid_price = el.children[4].textContent.replace(/\D/ig, '');
      player.premium_rate = Math.round(player.bid_price * 100 / player.market_value) + '%';
      el.children[4].textContent = mm;
      player.total_exp2 = player.total_exp2.format(0);

      request.get(employmentUrl).then(doc => {
        const note = doc.querySelector('.footnote').textContent;
        player.born = ((note.match(/\d* 青訓中心/g) || note.match(/用 \d*/g) || [])[0]).replace(/\D/ig, '');

        keys.forEach(key => el.appendChild(<td>{player[key]}</td>));
        $('.horizontal_table').trigger('update');
      });
    });
  });
  $('.horizontal_table').tablesorter();
};

appendCheckItems();
appendExtraInfo();
