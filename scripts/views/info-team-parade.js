/*
 * - 改成單欄式，只顯示球員列表 [relayout]
 * - 增加閱兵資訊 [appendParadeInfo]
 * - 增加全部、前11名球員統計列 [appendStatisticalRow]
 */

import css from '../../styles/index.styl';
import React from '../utils/react-like.js';
import * as utils from '../utils/common.js';
import * as request from '../utils/request.js';
import Player from '../models/player.js';

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

const appendParadeInfo = () => {
  const REMOVE_BEHIND_CHILD_NUM = 7;
  const keys = [
    'talent', 'endurance', 'tactics',
    'main_fixed_feature', 'main_trainable_feature',
    'position_exp', 'total_exp2', 'special_attributes', 'market_value',
    // 'name',
    'player_score', 'training_morale'
  ];
  const elHeadRow = document.querySelector('.horizontal_table thead tr'),
        elBodyRow = document.querySelectorAll('.horizontal_table tbody tr'),
        playerNum = elBodyRow.length,
        players = [];

  //head
  for (let i = 0; i < REMOVE_BEHIND_CHILD_NUM; i++) {
    elHeadRow.removeChild(elHeadRow.lastChild);
  }
  keys.forEach(key => {
    elHeadRow.appendChild(<th>{chrome.i18n.getMessage('player_' + key)}</th>);
  });

  //body
  elBodyRow.forEach(el => {
    const playerUrl = el.querySelector('td:first-child a').href;
    request.get(playerUrl).then(doc => {
      const player = new Player(doc.querySelector('.center'));

      for (let i = 0; i < REMOVE_BEHIND_CHILD_NUM; i++) {
        el.removeChild(el.lastChild);
      }
      keys.forEach(key => el.appendChild(<td>{player[key]}</td>));
      el.children[2].textContent = player.age;

      players.push(player);
      if (players.length === playerNum) {
        appendStatisticalRow(players);
      }
    });
  });
};

const appendStatisticalRow = players => {
  const TOP_NUM = 11,
        playerNum = players.length;
  let totalAge                   = 0.0,
      totalValue                 = 0.0,
      totalTalent                = 0.0,
      totalEndurance             = 0.0,
      totalTactics               = 0.0,
      totalMainFixedFeature      = 0.0,
      totalMainTrainableFeature  = 0.0,
      totalPositionExp           = 0.0,
      totalTotalExp              = 0.0,
      totalSpecialAttributes     = 0.0,
      totalMarketValue           = 0.0,
      totalPlayerScore           = 0.0,
      totalTrainingMorale        = 0.0,

      topNumAge                  = 0.0,
      topNumValue                = 0.0,
      topNumTalent               = 0.0,
      topNumEndurance            = 0.0,
      topNumTactics              = 0.0,
      topNumMainFixedFeature     = 0.0,
      topNumMainTrainableFeature = 0.0,
      topNumPositionExp          = 0.0,
      topNumTotalExp             = 0.0,
      topNumSpecialAttributes    = 0.0,
      topNumMarketValue          = 0.0,
      topNumPlayerScore          = 0.0,
      topNumTrainingMorale       = 0.0;

  //sort
  players.sort((a, b) => {
    if (parseFloat(a.value) < parseFloat(b.value)) {
      return 1;
    } else if (parseFloat(a.value) > parseFloat(b.value)) {
      return -1;
    } else {
      return 0;
    }
  });

  //calc total value and get top value
  players.forEach((player, i) => {
    totalAge                  += parseFloat(player.age);
    totalValue                += parseFloat(player.value);
    totalTalent               += parseFloat(player.talent);
    totalEndurance            += parseFloat(player.endurance);
    totalTactics              += parseFloat(player.tactics);
    totalMainFixedFeature     += parseFloat(player.main_fixed_feature);
    totalMainTrainableFeature += parseFloat(player.main_trainable_feature);
    totalPositionExp          += parseFloat(player.position_exp);
    totalTotalExp             += parseFloat(player.total_exp);
    totalSpecialAttributes    += parseFloat(player.special_attributes);
    totalMarketValue          += parseFloat(player.market_value);
    totalPlayerScore          += parseFloat(player.player_score);
    totalTrainingMorale       += parseFloat(player.training_morale);

    if (i === TOP_NUM - 1) {
      topNumAge                  = totalAge;
      topNumValue                = totalValue;
      topNumTalent               = totalTalent;
      topNumEndurance            = totalEndurance;
      topNumTactics              = totalTactics;
      topNumMainFixedFeature     = totalMainFixedFeature;
      topNumMainTrainableFeature = totalMainTrainableFeature;
      topNumPositionExp          = totalPositionExp;
      topNumTotalExp             = totalTotalExp;
      topNumSpecialAttributes    = totalSpecialAttributes;
      topNumMarketValue          = totalMarketValue;
      topNumPlayerScore          = totalPlayerScore;
      topNumTrainingMorale       = totalTrainingMorale;
    }
  });

  //append row
  const table = document.querySelector('.horizontal_table');
  table.appendChild(
    <tfoot>
      <tr>
        <td><strong>{chrome.i18n.getMessage('label_all')}</strong></td>
        <td>{playerNum}</td>
        <td>{(totalAge / playerNum).format(2)}</td>
        <td></td>
        <td>{(totalValue / playerNum).format(2)}</td>
        <td>{(totalTalent / playerNum).format(2)}</td>
        <td>{(totalEndurance / playerNum).format(2)}</td>
        <td>{(totalTactics / playerNum).format(2)}</td>
        <td>{(totalMainFixedFeature / playerNum).format(2)}</td>
        <td>{(totalMainTrainableFeature / playerNum).format(2)}</td>
        <td>{(totalPositionExp / playerNum).format()}</td>
        <td>{(totalTotalExp / playerNum).format()}</td>
        <td></td>
        <td>{totalMarketValue.format()}</td>
        <td></td>
        <td>{(totalPlayerScore / playerNum).format()}</td>
        <td></td>
      </tr>
      <tr>
        <td><strong>{'Top {0}'.format(TOP_NUM)}</strong></td>
        <td>{TOP_NUM}</td>
        <td>{(topNumAge / TOP_NUM).format(2)}</td>
        <td></td>
        <td>{(topNumValue / TOP_NUM).format(2)}</td>
        <td>{(topNumTalent / TOP_NUM).format(2)}</td>
        <td>{(topNumEndurance / TOP_NUM).format(2)}</td>
        <td>{(topNumTactics / TOP_NUM).format(2)}</td>
        <td>{(topNumMainFixedFeature / TOP_NUM).format(2)}</td>
        <td>{(topNumMainTrainableFeature / TOP_NUM).format(2)}</td>
        <td>{(topNumPositionExp / TOP_NUM).format()}</td>
        <td>{(topNumTotalExp / TOP_NUM).format()}</td>
        <td></td>
        <td>{topNumMarketValue.format()}</td>
        <td></td>
        <td>{(topNumPlayerScore / TOP_NUM).format()}</td>
        <td></td>
      </tr>
    </tfoot>
  );
};

relayout();
appendParadeInfo();
