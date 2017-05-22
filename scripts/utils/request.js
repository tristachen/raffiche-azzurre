const buildSearchParams = params => {
  return Object.keys(params).map((key) => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
  }).join('&');
};

const handleRes = res => {
  const contentType = res.headers.get('content-type');
  if (res.status === 200) {
    if (contentType.search('text/html') > -1) {
      return res.text().then(text => {
        const parser = new DOMParser(),
              doc = parser.parseFromString(text, 'text/html');
        return doc;
      });
    } else {
      return res;
    }
  } else {
    return res;
  }
};

const request = (url, options) => {
   return fetch(url, options).then(handleRes);
};

export const get = (url, options) => {
  options = options || {};
  return request(url, {
    method: 'GET',
    credentials: 'include',
    mode: options.mode || 'cors'
  });
};

export const post = (url, options) => {
  options = options || {};
  let body;
  if (options.data && options.data instanceof FormData) {
    body = options.data;
  } else {
    body = buildSearchParams(options.data);
  }
  return request(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
     'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    mode: options.mode || 'cors',
    body: body
  });
};
