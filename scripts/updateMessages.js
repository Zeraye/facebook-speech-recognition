/**
 * Setting up custom style sheets.
 */
const addStyleSheets = (style) =>
  (document.head.appendChild(document.createElement("style")).innerHTML =
    style);

const styleSheet = `
  .fetched-fsr {
    border-style: solid;
    border-width: 3px;
    border-color: #45BD62;
    border-radius: 20px 20px 20px 20px;
    display: inline;
  }

  .error-fsr {
    border-style: solid;
    border-width: 3px;
    border-color: #F3425F;
    border-radius: 20px 20px 20px 20px;
    display: inline;
  }

  .repair-borders-fsr {
    border-top-left-radius: 18px;
    border-top-right-radius: 18px;
    border-bottom-left-radius: 18px;
    border-bottom-right-radius: 18px;
  }
`;

addStyleSheets(styleSheet);

/**
 * A higher order function that provides caching in the browser's local storage.
 *
 * Only supports functions with a single argument that can be stored as an object's key
 * (string, number, symbol, boolean).
 */
const withBrowserLocalCache = (fn) => async (arg) => {
  /** @type {Record<any, any>} */
  const cache = (await browser.storage.local.get()) || {};
  if (cache[arg]) {
    return cache[arg];
  }
  const result = await fn(arg);
  cache[arg] = result;
  await browser.storage.local.set({ [arg]: result });

  return result;
};

const fetchSpeechToText = async (url) => {
  // TODO: fetch sererUrl from heroku server
  const serverUrl = "http://9234-78-11-176-160.ngrok.io";

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  };

  const response = await fetch(serverUrl + "/speech-to-text", requestOptions);

  return response.text();
};

const memoizedFetchSpeechToText = withBrowserLocalCache(fetchSpeechToText);

setInterval(() => {
  const list = document.querySelectorAll('[data-testid="message-container"]');

  for (let element of list) {
    const audioElement = element.querySelector("audio");
    if (!audioElement) {
      continue;
    }
    element.querySelector(
      '[data-testid="chat-audio-player"]'
    ).children[0].children[1].children[1].children[0].innerHTML =
      '<img src="https://raw.githubusercontent.com/gist/Zeraye/8cec76ffbb45ebbca0b8418a38500b35/raw/af4568561ffa822e2d59e79da60072aeb1815f07/loading.svg">';
    const url = audioElement.getAttribute("src");
    memoizedFetchSpeechToText(url).then((message) => {
      element.innerHTML = createMessengerTextMessage(message);
    });
  }
}, 5000);

/**
 * @param {string} text
 */
const createMessengerTextMessage = (text) => {
  // Pray that somewhere in the visible conversation is a text message
  const list = document.querySelectorAll('[data-testid="message-container"]');

  for (let element of list) {
    const elementIsNotAudio = element.querySelector("audio") === null;
    const elementIsNotImage = element.querySelector("img") === null;
    if (elementIsNotAudio && elementIsNotImage) {
      element.children[0].children[0].children[0]
        .querySelector('[role="none"]')
        .classList.add("fetched-fsr");
      element.children[0].children[0].children[0]
        .querySelector('[role="none"]')
        .children[1].classList.add("repair-borders-fsr");
      element.querySelector('[dir="auto"]').textContent = text;
      return element.innerHTML;
    }
  }

  // Prays didn't work
  return `<span class="tojvnm2t a6sixzi8 abs2jz4q a8s20v7p t1p8iaqh k5wvi7nf q3lfd5jv pk4s997a bipmatt0 cebpdrjk qowsmv63 owwhemhu dp1hu0rb dhp61c6y iyyx5f41"><div role="none" class="j83agx80 k4urcfbm"><div role="none" class="ns4p8fja j83agx80 cbu4d94t a6sixzi8 bkfpd7mw d2edcug0 buofh1pr nred35xi"><div role="none" class="buofh1pr rj1gh0hx"></div></div><div role="none" class="l60d2q6s d1544ag0 sj5x9vvc tw6a2znq l9j0dhe7 ni8dbmo4 stjgntxs e72ty7fz qlfml3jp inkptoze qmr60zad jm1wdb64 qv66sw1b ljqsnud1 odn2s2vf tkr6xdv7" style="background-color: rgb(96, 96, 96);"><div role="none" class="rq0escxv l9j0dhe7 du4w35lb __fb-dark-mode"><div role="none" class="ljqsnud1 ii04i59q" dir="auto">${text}</div></div></div></div></span>`;
};
