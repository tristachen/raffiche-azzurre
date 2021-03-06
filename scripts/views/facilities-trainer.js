/*
 * - 增加額外資訊 [appendExtraInfo]
 */

import React from '../utils/react-like.js';
import * as utils from '../utils/common.js';
import Player from '../models/player.js';

const getTrain = (cost, i) => {
  //blocking, dueling, passing, scoring, tactics
  const C_GOALKEEPING = [0.724, 0.000, 0.115, 0.000, 0.163],
        C_DEFENSE     = [0.207, 0.765, 0.015, 0.175, 0.439],
        C_MIDFIELD    = [0.055, 0.218, 0.695, 0.000, 0.307],
        C_ATTACK      = [0.002, 0.205, 0.160, 0.736, 0.189];
  let coefficient;
  if (location.href.search('train-goalkeeping') >= 0) {
    coefficient = C_GOALKEEPING;
  } else if (location.href.search('train-defense') >= 0) {
    coefficient = C_DEFENSE;
  } else if (location.href.search('train-midfield') >= 0) {
    coefficient = C_MIDFIELD;
  } else if (location.href.search('train-attack') >= 0) {
    coefficient = C_ATTACK;
  }
  return (1000 * coefficient[i] / cost).toFixed(3);
};

const appendExtraInfo = () => {
  const elBodyRow = document.querySelectorAll('.horizontal_table tbody tr');

  const appendPlayerInfo = (elRow, player) => {
    elRow.querySelector('td:first-child div').hidden = true;
    elRow.querySelector('td:first-child').appendChild(
      <div>{'★ {0} | {1} | {2}'.format(player.format('value'), player.format('talent'), player.format('age_string'))}</div>
    );
    elRow.querySelector('td:first-child').appendChild(
      <div>{'◆ [{0}]'.format(player.format('special_attributes'))}</div>
    );
  };

  const appendTrainInfo = elRow => {
    const elCosts = elRow.querySelectorAll('.cost'),
          costs = [];
    elCosts.forEach((el, i) => {
      const cost = parseInt(el.textContent.replace(/\D/ig, ''), 10),
            train = getTrain(cost, i);
      costs[costs.length] = train;
      el.parentElement.parentElement.appendChild(
        <div class='extra-info'>{chrome.i18n.getMessage('label_train').format(train)}</div>
      );
    });

    //highlight max train
    const iMax = costs.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0),
          elMaxCost = elCosts[iMax].parentElement.parentElement.lastChild;
    elMaxCost.className = 'extra-info-height';
  };

  elBodyRow.forEach(tr => {
    const elPlayerName = tr.querySelector('td:first-child a:nth-child(2)'),
          playerUrl = elPlayerName && elPlayerName.href;
    if (playerUrl) {
      const player = new Player({ url: playerUrl });
      player.fetch().then(() => {
        appendPlayerInfo(tr, player);
        appendTrainInfo(tr);
      });
    }
  });
};

//don't apply on facilities/trainer/specials
if (location.href.search('specials') < 0) {
  appendExtraInfo();
}
