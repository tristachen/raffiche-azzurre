/*
 * - 增加劇透功能 [appendSpoilerElement]
 * - 增加球員的提示列表 [appendPlayerTooltip]
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

const appendPlayerTooltip = () => {
  const linkPlayers = document.querySelectorAll('a[href *=player-]:not([href $=transfer])');
  linkPlayers.forEach(el => {
    const playerUrl = el.href;
    let elTooltips;

    el.addEventListener('mouseover', e => {
      if (elTooltips) {
        return;
      }

      const player = new Player({ url: playerUrl });
      const DATA_LAYOUT_SETTINGS = [
        { cols: 'one', key: 'name' },
        { cols: 'two', key: 'age_string' },
        { cols: 'one', key: 'position' },
        { cols: 'one', key: 'special_attributes' },
        { cols: 'one', key: 'value' },
        { cols: 'one', key: 'market_value' },
        { cols: 'two', key: 'talent' },
        { cols: 'two', key: 'scoring' },
        { cols: 'two', key: 'endurance' },
        { cols: 'two', key: 'passing' },
        { cols: 'two', key: 'power' },
        { cols: 'two', key: 'dueling' },
        { cols: 'two', key: 'speed' },
        { cols: 'two', key: 'blocking' },
        { cols: 'two', key: 'tactics' },
        { cols: 'one', key: 'position_exp' },
        { cols: 'one', key: 'total_exp2' },
        { cols: 'one', key: 'player_score2' }
      ];
      player.fetch().then(() => {
        elTooltips = (
          <div class='tooltips--player'></div>
        );

        let i = 0;
        while (i < DATA_LAYOUT_SETTINGS.length) {
          const setting = DATA_LAYOUT_SETTINGS[i],
                nextSetting = DATA_LAYOUT_SETTINGS[i+1],
                { cols, key } = setting;
          let elRow;

          if (cols === 'two' && (nextSetting && nextSetting.cols === 'two')) {
            elRow = (
              <div class='tooltips__two-col'>
                <span class='tooltips__label'>{chrome.i18n.getMessage('player_{0}'.format(key))}</span>
                <span class='tooltips__value'>{player.format(key)}</span>
                <span class='tooltips__label'>{chrome.i18n.getMessage('player_{0}'.format(nextSetting.key))}</span>
                <span class='tooltips__value'>{player.format(nextSetting.key)}</span>
              </div>
            );
            i += 2;
          } else {
            elRow = (
              <div class={'tooltips__{0}-col'.format(cols)}>
                <span class='tooltips__label'>{chrome.i18n.getMessage('player_{0}'.format(key))}</span>
                <span class='tooltips__value'>{player.format(key)}</span>
              </div>
            );
            i += 1;
          }
          elTooltips.appendChild(elRow);
        }

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
  });
};

//don't apply on info/match-*/fixture
if (location.href.search('fixture') < 0) {
  appendSpoilerElement();
  appendPlayerTooltip();
}
