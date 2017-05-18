/*
 * - 加上額外資訊 [appendExtraInfo]
 * - 加上成長預估資訊 [appendGrowingUpInfo]
 */

import React from '../utils/react-like.js';
import * as utils from '../utils/common.js';
import * as request from '../utils/request.js';
import Player from '../models/player.js';

let player;
const appendExtraInfo = () => {
  const id = location.href.match(/.*\/player-(.*)/)[1];
  const el = document.querySelector('.center');
  player = new Player(el);
  ['total_exp2', 'player_score2', 'expscore1'].forEach(key => {
    const name = chrome.i18n.getMessage('player_' + key),
          value = player[key];
    const jsx = (
      <tr>
        <th>{name}</th>
        <td>{value}</td>
      </tr>
    );
    document.querySelector('.vertical_table > tbody').appendChild(jsx);
  });
  document.querySelector('.vertical_table > tbody').appendChild(
    <tr>
      <th>{chrome.i18n.getMessage('player_note')}</th>
      <td>
        <input id='inputPlayerNote' value={localStorage.getItem('player_' + id + '_note')}/>
        <button id='btnPlayerNote' disabled>{'OK'}</button>
      </td>
    </tr>
  );
  document.querySelector('#btnPlayerNote').onclick = e => {
    const note = document.querySelector('#inputPlayerNote').value;
    localStorage.setItem('player_' + id + '_note', note);
  };

  if (player.age <= 30) {
    getTrain(player);
  }
};

const getTrain = player => {
  const paths = location.pathname.split('/'),
        prefixUrl = '{0}/{1}/{2}'.format(location.origin, paths[1], paths[2]),
        trainUrl = prefixUrl + '/facilities/trainer';

  request.get(trainUrl).then(doc => {
    const elMap = {};
    doc.querySelectorAll('.vertical_table th').forEach(th => {
      const key = th.textContent,
            td = th.nextElementSibling;
      if (key && td) {
        //TODO: get current format
        const value = td.textContent.match(/\d+/g);
        elMap[key] = value && value[0] ? value[0] : td.textContent;
      } else {
        /* do nothing */
      }
    });
    appendGrowingUpInfo(player, elMap);
  });
};

const appendGrowingUpInfo = (player, train) => {
  const trainLv = train[chrome.i18n.getMessage('trainer_lv')],
        trainAddition = train[chrome.i18n.getMessage('trainer_bouns')],
        trainMultiple = trainLv * 12,
        skill = player.special_attributes.indexOf(chrome.i18n.getMessage('player_special_attributes_hardworking'));

  const tbody = (<tbody></tbody>);
  const age = parseInt(player.age, 10) + 1;
  for (let i = age; i <= 30; i++) {
    const expc = player.futurecExp(i, player, player.age_array, player.total_exp, player.talent, trainMultiple, trainAddition, skill, player.main_trainable_feature, player.age_percent, player.position_skill_name),
          exp = player.futureExp(i, player, player.age_array, player.total_exp, player.talent, trainMultiple, trainAddition, skill),
          exp1 = player.getExpScore(exp, i),
          exp2 = player.getExpScore2(exp, i);

    tbody.appendChild(
      <tr>
        <td>{i}</td>
        <td>{expc}</td>
        <td>{exp}</td>
        <td>{exp1}</td>
        <td>{exp2}</td>
      </tr>
    );
  }

  const table = (
    <table class='vertical_table'>
      <thead>
        <tr>
          <th colspan='5'>{chrome.i18n.getMessage('label_player_growing_up')}</th>
        </tr>
        <tr>
          <th colspan='5'>{chrome.i18n.getMessage('msg_player_growing_up').format(trainLv, trainMultiple, trainAddition, skill > -1 ? chrome.i18n.getMessage('player_special_attributes_hardworking') : '')}</th>
        </tr>
        <tr>
          <td>{chrome.i18n.getMessage('player_age')}</td>
          <td>{chrome.i18n.getMessage('player_main_fixed_feature')}</td>
          <td>{chrome.i18n.getMessage('player_total_exp')}</td>
          <td>{chrome.i18n.getMessage('player_exp1')}</td>
          <td>{chrome.i18n.getMessage('player_exp2')}</td>
        </tr>
      </thead>
      {tbody}
    </table>
  );
  const insertTo = document.querySelectorAll('.vertical_table')[2];
  insertTo.parentElement.insertBefore(table, insertTo);
};

//don't apply on info/player-*/transfer
if (location.href.search('transfer') < 0) {
  appendExtraInfo();
}
