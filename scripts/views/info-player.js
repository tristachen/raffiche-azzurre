/*
 * - 增加額外資訊 [appendExtraInfo]
 * - 增加成長預估資訊 [appendGrowingUpInfo]
 */

import React from '../utils/react-like.js';
import * as utils from '../utils/common.js';
import * as request from '../utils/request.js';
import Player from '../models/player.js';

const appendExtraInfo = () => {
  const id = location.href.match(/.*\/player-(.*)/)[1],
        el = document.querySelector('.center');
  let player = new Player();
  player.parse(el);
  ['training_grade', 'property_score', 'score1', 'score2'].forEach(key => {
    const name = chrome.i18n.getMessage('player_' + key),
          value = player.format(key);
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
        <button id='btnPlayerNote'>{chrome.i18n.getMessage('label_ok')}</button>
      </td>
    </tr>
  );
  document.querySelector('#btnPlayerNote').onclick = e => {
    const note = document.querySelector('#inputPlayerNote').value;
    localStorage.setItem('player_' + id + '_note', note);
  };

  if (player.age_years <= 30) {
    getTrainerInfo().then(trainer => appendGrowingUpInfo(player, trainer));
  }
};

const getTrainerInfo = player => {
  const paths = location.pathname.split('/'),
        prefixUrl = '{0}/{1}/{2}'.format(location.origin, paths[1], paths[2]),
        trainUrl = prefixUrl + '/facilities/trainer';

  return request.get(trainUrl).then(doc => {
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
    return elMap;
  });
};

const appendGrowingUpInfo = (player, train) => {
  const trainer_lv = train[chrome.i18n.getMessage('trainer_lv')],
        trainer_bonus = train[chrome.i18n.getMessage('trainer_bonus')] || 0,
        trainer_multiple = trainer_lv * 12,
        hasSpecialAttributes = player.special_attributes.indexOf(chrome.i18n.getMessage('special_attributes_hardworking')) > -1;

  const tbody = (<tbody></tbody>);
  const age = player.age_years + 1;
  for (let i = age; i <= 30; i++) {
    const futurePlayer = new Player();
    futurePlayer.total_exp1 = player.getFutureTotalExp(i, trainer_multiple, trainer_bonus);
    futurePlayer.main_feature = player.getFutureMainFeature(i, futurePlayer.total_exp1);
    futurePlayer.exp_score1 = player.getExpScore(1, { total_exp: futurePlayer.total_exp1, age_number: i });
    futurePlayer.exp_score2 = player.getExpScore(2, { total_exp: futurePlayer.total_exp1, age_number: i });
    tbody.appendChild(
      <tr>
        <td>{i}</td>
        <td>{futurePlayer.format('main_feature')}</td>
        <td>{futurePlayer.format('total_exp1')}</td>
        <td>{futurePlayer.format('exp_score1')}</td>
        <td>{futurePlayer.format('exp_score2')}</td>
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
          <th colspan='5'>{chrome.i18n.getMessage('msg_player_growing_up').format(trainer_lv, trainer_multiple, trainer_bonus, hasSpecialAttributes ? chrome.i18n.getMessage('special_attributes_hardworking') : '')}</th>
        </tr>
        <tr>
          <td>{chrome.i18n.getMessage('player_age')}</td>
          <td>{chrome.i18n.getMessage('player_bonus_fixed_feature')}</td>
          <td>{chrome.i18n.getMessage('player_total_exp2')}</td>
          <td>{chrome.i18n.getMessage('player_exp_score1')}</td>
          <td>{chrome.i18n.getMessage('player_exp_score2')}</td>
        </tr>
      </thead>
      {tbody}
    </table>
  );
  const target = document.querySelectorAll('.vertical_table')[2];
  target.parentElement.insertBefore(table, target);
};

//only apply on info/player-*
if (location.href.match(/player-\d*$/)) {
  appendExtraInfo();
}
