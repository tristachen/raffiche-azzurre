/*
 * - 自動買票 [appendBuyTicketElement]
 *   - getReturnUrlByIndex
 *   - batchBuyTicket
 */

import React from '../utils/react-like.js';
import * as utils from '../utils/common.js';
import * as request from '../utils/request.js';

const elContatiner = document.querySelector('.center h3'),
      elTickets = document.querySelectorAll('.tickets-link');

const getReturnUrlByIndex = i => {
  const ticketUrl = elTickets[i].href;
  request.get(ticketUrl).then(doc => {
    const elSelectTicket = doc.querySelector('select.return-url');
    if (elSelectTicket) {
      const onclick = e => {
        const selectedIndex = elSelectTicket.selectedIndex,
              returnUrl = elSelectTicket.options[selectedIndex].value,
              ticketName = elSelectTicket.options[selectedIndex].text,
              i18nKey = 'msg_selected_ticket_return_url',
              msgSelected = chrome.i18n.getMessage(i18nKey).format(ticketName);
        elBuyTicket.parentElement.removeChild(elBuyTicket);
        elContatiner.appendChild(<div>{msgSelected}</div>);
        batchBuyTicket(returnUrl);
      };
      const label = chrome.i18n.getMessage('label_auto_buy_ticket'),
            btn = utils.createButton(label, onclick);
      const elBuyTicket = (
        <div>
          {elSelectTicket}
          {btn}
        </div>
      );
      elContatiner.appendChild(elBuyTicket);
    } else {
      //util get return url
      getReturnUrlByIndex(i+1);
    }
  });
};

const batchBuyTicket = returnUrl => {
  let completedTickets = 0;

  const buyTicketByIndex = i => {
    const ticketUrl = elTickets[i],
          name = elTickets[i].parentElement.previousElementSibling.textContent;
    const data = {
      return_url: returnUrl,
      buy_ticket: chrome.i18n.getMessage('label_buy_free_ticket')
    };
    request.post(ticketUrl, { data }).then(doc => {
      const sysMsg = doc.querySelector('.sys_notices').textContent;
      elContatiner.appendChild(<div>{'* ' + sysMsg}</div>);

      completedTickets++;
      if (completedTickets >= elTickets.length) {
        const completedMsg = chrome.i18n.getMessage('msg_buy_ticket_completed');
        elContatiner.appendChild(<div>{completedMsg}</div>);
      } else {
        setTimeout(() => buyTicketByIndex(completedTickets), 1000);
      }
    });
  };

  buyTicketByIndex(0);
};

const appendBuyTicketElement = () => {
  if (elTickets.length > 0) {
    getReturnUrlByIndex(0);
  }
};

appendBuyTicketElement();
