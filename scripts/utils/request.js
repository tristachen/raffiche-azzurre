/*

request.get('htxx', {
  data
})
*/
const buildSearchParams = params => {
  return Object.keys(params).map((key) => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
  }).join('&');
};

const request = (url, options) => {
  return fetch(url, options);
};

export const get = (url, options) => {
  return request(url, { method: 'GET', credentials: 'include', ...options });
};

export const post = (url, options) => {
  return request(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
     'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: buildSearchParams(options.data)
  });
};
