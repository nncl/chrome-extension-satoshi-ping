const API_URL = 'https://api.coinbase.com/v2/prices/spot?currency=USD';

fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    const price = parseFloat(data.data.amount).toFixed(2);
    document.getElementById('price').textContent = `$${Number(price).toLocaleString()}`;
  })
  .catch(err => {
    document.getElementById('price').textContent = 'Error loading price';
    console.error(err);
  });

