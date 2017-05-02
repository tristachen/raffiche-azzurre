import * as request from '../utils/request.js';
import React from '../utils/react-like.js';

const elTickets = document.querySelectorAll('.tickets-link');

if (elTickets.length > 0) {

  const autoBuy = returnTicketUrl => {
    let completedTask = 0;

    const buyTicket = idx => {
      const url = elTickets[idx];
      const name = elTickets[idx].parentElement.previousElementSibling.textContent;

      return request.post(url, {
        data: {
          return_url: returnTicketUrl,
          buy_ticket: '免費買票'
        }
      })
        .then(data => data.text())
        .then(text => {
          const parser = new DOMParser(),
                doc = parser.parseFromString(text, 'text/html');
          const el = doc.querySelector('.sys_notices');
          document.querySelector('.center h3').appendChild(
            <div>{'訊息已傳送給' + name + ', 並隨信附上你的販賣門票連結'}</div>
          );
          document.querySelector('.center h3').appendChild(
            <div>{el.textContent}</div>
          );

          completedTask++;
          if (completedTask >= elTickets.length) {
            document.querySelector('#btn-auto-buy-ticket').textContent = '全部完成';
          } else {
            setTimeout(() => {
              buyTicket(completedTask);
            }, 1000);
          }
        });
    };

    buyTicket(0);
  }

  //get return ticket link, so only once
  //TODO, if cannnot get return url ?
  const ticketUrl = elTickets[0].href;
  request.get(ticketUrl)
    .then(data => data.text())
    .then(text => {
      const parser = new DOMParser(),
            doc = parser.parseFromString(text, 'text/html');

      const elSelectTicket = doc.querySelector('select.return-url');

      document.querySelector('.center h3').appendChild(elSelectTicket);
      const btn = document.createElement('button');
      btn.id = 'btn-auto-buy-ticket';
      btn.textContent = '自動購票';
      btn.onclick = e => {
        const returnTicketUrl = elSelectTicket.options[elSelectTicket.selectedIndex].value;
        document.querySelector('.center h3').appendChild(
          <div>{'你選擇的回購連結: ' + (returnTicketUrl || '無')}</div>
        );
        autoBuy(returnTicketUrl);
      };
      document.querySelector('.center h3').appendChild(btn);

    })
    .catch(err => console.log(err));
}
