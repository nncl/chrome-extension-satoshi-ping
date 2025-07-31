const intervalInput = document.getElementById("interval");
const saveButton = document.getElementById("saveInterval");
const status = document.getElementById("status");
const priceEl = document.getElementById("price");

const API_URL = 'https://api.coinbase.com/v2/prices/spot?currency=USD';
const DEFAULT_MINUTES = 60;

// Load saved interval
chrome.storage.sync.get(["interval"], result => {
  intervalInput.value = result.interval || DEFAULT_MINUTES;
});

// Save interval
saveButton.addEventListener("click", () => {
  const minutes = parseInt(intervalInput.value);
  if (isNaN(minutes) || minutes < 1) {
    status.textContent = "Enter a valid number ≥ 1";
    return;
  }

  chrome.storage.sync.set({ interval: minutes }, () => {
    status.textContent = `Saved: ${minutes} min`;
    chrome.runtime.sendMessage({ type: "updateAlarm" });
  });
});

// Load current BTC price
fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    const price = parseFloat(data.data.amount).toFixed(2);
    priceEl.textContent = `BTC: $${Number(price).toLocaleString()}`;
  })
  .catch(() => {
    priceEl.textContent = "Failed to fetch price";
  });
