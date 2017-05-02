import * as request from '../utils/request.js';
import React from '../utils/react-like.js';
import htmlParser from '../helpers/htmlParser.js';

const getTrain = (exp, i) => {
  let c1 = 0,
      c2 = 0,
      c3 = 0,
      c4 = 0,
      c5 = 0; // 依次：阻擋，搶球，傳球，射門，戰術
  if (location.href.indexOf('train-goalkeeping') >= 0) {
    c1 = 0.724;
    c2 = 0.0;
    c3 = 0.115;
    c4 = 0.0;
    c5 = 0.163;
  } else if (location.href.indexOf('train-defense') >= 0) {
    c1 = 0.207;
    c2 = 0.765;
    c3 = 0.015;
    c4 = 0.175;
    c5 = 0.439;
  } else if (location.href.indexOf('train-midfield') >= 0) {
    c1 = 0.055
    c2 = 0.218;
    c3 = 0.695;
    c4 = 0;
    c5 = 0.307;
  } else if (location.href.indexOf('train-attack') >= 0) {
    c1 = 0.002;
    c2 = 0.205;
    c3 = 0.16;
    c4 = 0.736;
    c5 = 0.189;
  }
  const c = [c1, c2, c3, c4, c5];
  return 1000 * c[i] / exp;;
}


if (location.href.search('specials') < 0) {
  const trs = document.querySelectorAll('.horizontal_table tbody tr');
  trs.forEach(tr => {
    const playerHref = tr.querySelector('td:first-child > a:nth-child(2)').href;

    request.get(playerHref)
      .then(data => data.text())
      .then(text => {
        const parser = new DOMParser(),
              doc = parser.parseFromString(text, 'text/html'),
              el = doc.querySelector('.center'),
              playerInfo = htmlParser(el);

        tr.querySelector('td:first-child div').hidden = true;
        tr.querySelector('td:first-child').appendChild(
          <div>{'★ ' + playerInfo.value + ' | ' + playerInfo.talent + ' | ' + playerInfo.age}</div>
        );
        tr.querySelector('td:first-child').appendChild(
          <div>{'◆ [' + playerInfo.special_attributes + ']'}</div>
        );

        const exps = [];
        tr.querySelectorAll('.cost').forEach((el, i) => {
          const exp = parseInt(el.textContent.replace(/\D/ig, ''), 10);
          const value = getTrain(exp, i);
          exps[exps.length] = value;
          el.parentElement.parentElement.appendChild(<div style='color: blue'>{'+ ' + value.toFixed(3) + ' 星'}</div>);
        });

        const idxMax = exps.reduce((idxMax, x, i, arr) => x > arr[idxMax] ? i : idxMax, 0);
        const elTrain = tr.querySelectorAll('.cost')[idxMax].parentElement.parentElement.lastChild;
        elTrain.style.color = '#990000';
        elTrain.style.fontWeight = 'bold';
      })
      .catch(err => console.log(err));
  });
}
