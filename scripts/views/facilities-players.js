/*
 * - 加上截止時間、掛牌價 [appendExtraInfo]
 */

import React from '../utils/react-like.js';
import * as request from '../utils/request.js';

const appendExtraInfo = () => {
  const elHeadRow = document.querySelector('.horizontal_table thead tr');
  elHeadRow.appendChild(<th>{chrome.i18n.getMessage('player_transfer_deadline')}</th>);
  elHeadRow.appendChild(<th>{chrome.i18n.getMessage('player_bid_price')}</th>);

  const elBodyTd = document.querySelectorAll('.horizontal_table tbody tr a[href *=transfer]');
  elBodyTd.forEach(el => {
    request.get(el.href).then(doc => {
      const elDeadline = [].find.call(doc.querySelectorAll('th'), el => el.textContent === '期限'),
            elBidPrice = doc.querySelector('.sub_block .money-positive'),
            deadline = elDeadline.nextElementSibling.textContent,
            bidPrice = elBidPrice.textContent;
      el.parentElement.parentElement.appendChild(<td>{deadline}</td>);
      el.parentElement.parentElement.appendChild(<td>{bidPrice}</td>);
    });
  });
};

appendExtraInfo();
