const API_URL = 'https://api.coinbase.com/v2/prices/spot?currency=USD';
const DEFAULT_MINUTES = 60;

function fetchAndNotify() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      const price = parseFloat(data.data.amount).toFixed(2);
      chrome.notifications.clear('btc-alert', () => {
        chrome.notifications.create('btc-alert', {
          type: 'basic',
          iconUrl: 'icon.png',
          title: 'Bitcoin Price (Coinbase)',
          message: `BTC: $${Number(price).toLocaleString()}`,
          requireInteraction: true,
          priority: 2
        });
      });
    })
    .catch(console.error);
}

function setAlarm() {
  chrome.storage.sync.get(['interval'], result => {
    const minutes = result.interval || DEFAULT_MINUTES;
    chrome.alarms.clear('btcPriceAlert', () => {
      chrome.alarms.create('btcPriceAlert', { periodInMinutes: minutes });
      console.log(`[btc] Alarm set for every ${minutes} minutes`);
    });
  });
}

chrome.runtime.onInstalled.addListener(() => {
  setAlarm();
  fetchAndNotify();
});

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'btcPriceAlert') {
    fetchAndNotify();
  }
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'updateAlarm') {
    setAlarm();
  }
});
