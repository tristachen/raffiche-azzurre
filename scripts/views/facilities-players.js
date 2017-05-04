/*
 * - 加上球隊、截止時間資訊 [appendExtraInfo]
 */

import React from '../utils/react-like.js';

const appendExtraInfo = () => {
  const elHeadRow = document.querySelector('.horizontal_table > thead > tr');
  elHeadRow.appendChild(<th>{chrome.i18n.getMessage('player_team')}</th>);
  elHeadRow.appendChild(<th>截止時間</th>);

  const elBodyRow = document.querySelectorAll('.horizontal_table tbody tr');
  elBodyRow.forEach(el => {
    el.appendChild(<td></td>);
    el.appendChild(<td></td>);
  });
};

appendExtraInfo();
