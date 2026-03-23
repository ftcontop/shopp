const https = require('https');

exports.handler = async function (event) {
  const { q } = event.queryStringParameters || {};

  if (!q) {
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Missing query param q' }),
    };
  }

  const SERP_KEY = process.env.SERP_KEY;

  const params = new URLSearchParams({
    engine: 'google_shopping',
    q,
    api_key: SERP_KEY,
    num: 40,
    gl: 'us',
    hl: 'en',
  });

  const url = `https://serpapi.com/search.json?${params.toString()}`;

  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(parsed),
          });
        } catch (e) {
          resolve({
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: 'Failed to parse response' }),
          });
        }
      });
    }).on('error', (err) => {
      resolve({
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: err.message }),
      });
    });
  });
};
