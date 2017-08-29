/*
 * - 提供更多挑戰時段 [customizeChallengeTimeSelector]
 * - 可對該球隊發送多個友誼賽挑戰時段 [appendMultiChallengeElement]
 */

import React from '../utils/react-like.js';
import * as utils from '../utils/common.js';

const appendMultiChallengeElement = () => {
  const onclick = e => {
    let isMaximum = false,
        price = document.querySelector('#amount').value;

    while (!isMaximum) {
      document.querySelector('#bid-more').click();
      if (price === document.querySelector('#amount').value) {
        isMaximum = true;
      } else {
        price = document.querySelector('#amount').value;
      }
    }
    return false;
  };

  const label = 'Max',
        btn = utils.createButton(label, onclick),
        btnAdd = document.getElementById('bid-more');
        btnAdd.parentNode.insertBefore(btn, btnAdd.nextSibling);
};

document.addEventListener('DOMContentLoaded', function (event) {
  appendMultiChallengeElement();
});
