/*
 * - 劇透功能 [appendSpoilerElement]
 */

import React from '../utils/react-like.js';
import * as utils from '../utils/common.js';
import * as request from '../utils/request.js';
import Player from '../models/player.js';

const appendSpoilerElement = () => {
  const elContainer = document.querySelector('.middle'),
        elResults = document.querySelectorAll('.notes > ul > li');

  if (elResults.length > 1) {
    const label = chrome.i18n.getMessage('label_spoiler'),
          onclick = e => elResults[0].click(),
          btn = utils.createButton(label, onclick);
    elContainer.insertBefore(<div>{btn}</div>, elContainer.firstChild);
  }
};

const addTooltip = () => {
  const linkPlayers = document.querySelectorAll('a[href *=player-]:not([href $=transfer])');
  linkPlayers.forEach(el => {
    const playerUrl = el.href;
    let elTooltips;
    el.addEventListener('mouseover', e => {
      if (elTooltips) {
        return;
      }

      request.get(playerUrl).then(doc => {
        const player = new Player(doc.querySelector('div.center'));
        elTooltips = (
          <div class='tooltips--player'>
            <div class='tooltips__one-col'>
              <span class='tooltips__label'>{chrome.i18n.getMessage('player_name')}</span>
              <span class='tooltips__value'>{player.name}</span>
            </div>
            <div class='tooltips__two-col'>
              <span class='tooltips__label'>{chrome.i18n.getMessage('player_age')}</span>
              <span class='tooltips__value'>{player.age_string}</span>
            </div>
            <div class='tooltips__one-col'>
              <span class='tooltips__label'>{chrome.i18n.getMessage('player_position')}</span>
              <span class='tooltips__value'>{player.position}</span>
            </div>
            <div class='tooltips__one-col'>
              <span class='tooltips__label'>{chrome.i18n.getMessage('player_special_attributes')}</span>
              <span class='tooltips__value'>{player.special_attributes}</span>
            </div>
            <div class='tooltips__one-col'>
              <span class='tooltips__label'>{chrome.i18n.getMessage('player_value')}</span>
              <span class='tooltips__value'>{player.value}</span>
            </div>
            <div class='tooltips__one-col'>
              <span class='tooltips__label'>{chrome.i18n.getMessage('player_market_value')}</span>
              <span class='tooltips__value'>{player.market_value}</span>
            </div>
            <div class='tooltips__two-col'>
              <span class='tooltips__label'>{chrome.i18n.getMessage('player_talent')}</span>
              <span class='tooltips__value'>{player.talent}</span>
              <span class='tooltips__label'>{chrome.i18n.getMessage('player_scoring')}</span>
              <span class='tooltips__value'>{player.scoring}</span>
            </div>
            <div class='tooltips__two-col'>
              <span class='tooltips__label'>{chrome.i18n.getMessage('player_endurance')}</span>
              <span class='tooltips__value'>{player.endurance}</span>
              <span class='tooltips__label'>{chrome.i18n.getMessage('player_passing')}</span>
              <span class='tooltips__value'>{player.passing}</span>
            </div>
            <div class='tooltips__two-col'>
              <span class='tooltips__label'>{chrome.i18n.getMessage('player_power')}</span>
              <span class='tooltips__value'>{player.power}</span>
              <span class='tooltips__label'>{chrome.i18n.getMessage('player_dueling')}</span>
              <span class='tooltips__value'>{player.dueling}</span>
            </div>
            <div class='tooltips__two-col'>
              <span class='tooltips__label'>{chrome.i18n.getMessage('player_speed')}</span>
              <span class='tooltips__value'>{player.speed}</span>
              <span class='tooltips__label'>{chrome.i18n.getMessage('player_blocking')}</span>
              <span class='tooltips__value'>{player.blocking}</span>
            </div>
            <div class='tooltips__two-col'>
              <span class='tooltips__label'>{chrome.i18n.getMessage('player_tactics')}</span>
              <span class='tooltips__value'>{player.tactics}</span>
            </div>
            <div class='tooltips__one-col'>
              <span class='tooltips__label'>{chrome.i18n.getMessage('player_position_exp')}</span>
              <span class='tooltips__value'>{player.position_exp}</span>
            </div>
            <div class='tooltips__one-col'>
              <span class='tooltips__label'>{chrome.i18n.getMessage('player_player_score')}</span>
              <span class='tooltips__value'>{player.player_score}</span>
            </div>
            <div class='tooltips__one-col'>
              <span class='tooltips__label'>{chrome.i18n.getMessage('player_total_exp')}</span>
              <span class='tooltips__value'>{player.total_exp}</span>
            </div>
          </div>
        );

        el.parentElement.parentElement.appendChild(elTooltips);
        elTooltips.style.left = e.clientX + 'px';
        elTooltips.style.top = (e.clientY - 100) + 'px';

        setTimeout(unembedElement, 2000);
      });
    });

    const unembedElement = () => {
      if (!elTooltips) {
        return;
      }

      elTooltips.outerHTML = '';
      elTooltips = null;
    };

    // el.addEventListener('mouseleave', e => {
    // });
  });
};

//don't apply on info/match-*/fixture
if (location.href.search('fixture') < 0) {
  appendSpoilerElement();
  addTooltip();
}
