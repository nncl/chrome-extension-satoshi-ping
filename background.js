const API_URL = 'https://api.coinbase.com/v2/prices/spot?currency=USD';

function fetchAndNotify() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      const price = parseFloat(data.data.amount).toFixed(2);
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon.png',
        title: 'Bitcoin Price (Coinbase)',
        message: `BTC: $${Number(price).toLocaleString()}`,
	requireInteraction: true,
        priority: 2
      });
    })
    .catch(err => console.error('Error fetching BTC price from Coinbase:', err));
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('btcPriceAlert', { periodInMinutes: 4 });
  fetchAndNotify();
});

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'btcPriceAlert') {
    fetchAndNotify();
  }
});

