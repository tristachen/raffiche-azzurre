import css from '../../styles/index.styl';
import React from '../utils/react-like.js';
import * as request from '../utils/request.js';
import htmlParser from '../helpers/htmlParser.js';

export const addTooltips = () => {
  const linkPlayers = document.querySelectorAll('a[href *=player-]');
  linkPlayers.forEach(el => {
    const playerUrl = el.href;
    let elTooltips;
    el.addEventListener('mouseover', e => {
      if (elTooltips) {
        return;
      }

      request.get(playerUrl).then(doc => {
        const player = htmlParser(doc.querySelector('div.center'));
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
      });
    });

    el.addEventListener('mouseleave', e => {
      if (!elTooltips) {
        return;
      }

      elTooltips.outerHTML = '';
      elTooltips = null;
    });
  });
};
