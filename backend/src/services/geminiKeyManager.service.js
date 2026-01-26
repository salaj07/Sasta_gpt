const MAX_DAILY_LIMIT = 20;

const keys = process.env.GEMINI_API_KEYS.split(",");

let state = {
  currentKeyIndex: 0,
  usage: new Array(keys.length).fill(0),
  lastReset: new Date().toDateString()
};

function resetIfNewDay() {
  const today = new Date().toDateString();
  if (state.lastReset !== today) {
    state.usage.fill(0);
    state.currentKeyIndex = 0;
    state.lastReset = today;
  }
}

function getApiKey() {
  resetIfNewDay();

  for (let i = 0; i < keys.length; i++) {
    const index = (state.currentKeyIndex + i) % keys.length;

    if (state.usage[index] < MAX_DAILY_LIMIT) {
      state.usage[index]++;
      state.currentKeyIndex = index;
      return keys[index];
    }
  }

  throw new Error("All Gemini API keys exhausted for today 😭");
}

module.exports = { getApiKey };
