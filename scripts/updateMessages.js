/**
 * @param {string} style
 */
const addStyleSheets = (style) =>
  (document.head.appendChild(document.createElement("style")).innerHTML =
    style);

const styleSheet = `
  .recognized-message-fsr {
    border-style: solid;
    border-width: 3px;
    border-color: #45BD62;
    border-radius: 20px 20px 20px 20px;
    display: inline;
    width: auto;
  }

  .error-message-fsr {
    border-style: solid;
    border-width: 3px;
    border-color: #F3425F;
    border-radius: 20px 20px 20px 20px;
    display: inline;
    width: auto;
  }

  .repair-borders-fsr {
    border-top-left-radius: 18px;
    border-top-right-radius: 18px;
    border-bottom-left-radius: 18px;
    border-bottom-right-radius: 18px;
  }

  .loading-circle-fsr {
    animation-duration: 2s;
    animation-fill-mode: both;
    animation-iteration-count: infinite;
    animation-timing-function: cubic-bezier(.33,0,.67,1);
    transform-origin: 50% 50%;
    animation-name: cdeelhz6-B;
  }

  .loading-svg-fsr {
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-timing-function: cubic-bezier(0,0,1,1);
    animation-fill-mode: both;
    animation-name: ffxpx7bd-B;
  }

  .reset-message-fsr {
    align-items: end;
  }

  .reset-message-svg-fsr {
    var(--placeholder-icon);
    fill: #606060;
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
  const cache = (await browser.storage.local.get(arg)) || {};
  if (cache[arg]) {
    return cache[arg];
  }

  const result = await fn(arg);
  await browser.storage.local.set({ [arg]: result });

  return result;
};

const fetchSpeechToText = async (url) => {
  // TODO: fetch sererUrl from heroku server
  // Only for development purposes
  const serverUrl = "http://1c93-78-11-176-160.ngrok.io";

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

    const playButton = element.querySelector(
      '[data-testid="chat-audio-player"]'
    ).children[0].children[1].children[1].children[0];

    const loadingAnimationSvg =
      '<svg class="loading-svg-fsr" height="16" viewBox="0 0 16 16" width="16"><circle class="loading-circle-fsr" cx="8" cy="8" fill="none" r="7" stroke="var(--progress-ring-disabled-foreground)" stroke-dasharray="43.982297150257104" stroke-width="2"></circle></svg>';

    playButton.innerHTML = loadingAnimationSvg;

    const url = audioElement.getAttribute("src");

    memoizedFetchSpeechToText(url).then((message) => {
      element.innerHTML = createMessengerTextMessage(message);
    });
  }
}, 1000);

/**
 * @param {string} text
 */
const createMessengerTextMessage = (text) => {
  // Pray that somewhere in the visible conversation is a text message
  const list = document.querySelectorAll('[data-testid="message-container"]');

  for (let element of list) {
    const audioElement = element.querySelector("audio");
    const imageElement = element.querySelector("img");
    if (audioElement || imageElement) {
      continue;
    }

    const resetButton = element.children[1].children[0];

    const resetButtonSvg = `<svg width="22px" height="22px" viewBox="1 1 21 21"><g stroke-width="1" fill-rule="evenodd" class="reset-message-svg-fsr"><path d="M10.8932368,14.7625445 C10.8932368,15.535432 10.0849567,15.996442 9.48116675,15.5677995 L4.03193175,11.696707 C3.49257425,11.313742 3.49287675,10.4694645 4.03193175,10.0864995 L9.48116675,6.2157095 C10.0849567,5.7867645 10.8932368,6.248077 10.8932368,7.020662 L10.8938418,9.0755445 C15.2129368,9.0755445 18.1517243,11.027577 18.1523293,15.7226795 C18.1523293,16.0820495 17.9036743,16.3349395 17.5273643,16.3349395 C17.2487618,16.3349395 17.0164418,16.1746145 16.8527893,15.680027 C16.1588543,13.584307 14.1063918,12.7049395 10.8938418,12.7049395 L10.8932368,14.7625445 Z"></path></g></svg>`;

    resetButton.classList.add("reset-message-fsr");

    resetButton.innerHTML = resetButtonSvg;

    const message =
      element.children[0].children[0].children[0].querySelector(
        '[role="none"]'
      );

    message.classList.add("recognized-message-fsr");

    message.children[1].classList.add("repair-borders-fsr");

    element.querySelector('[dir="auto"]').textContent = text;

    return element.innerHTML;
  }

  // Prays didn't work
  return `<span class="tojvnm2t a6sixzi8 abs2jz4q a8s20v7p t1p8iaqh k5wvi7nf q3lfd5jv pk4s997a bipmatt0 cebpdrjk qowsmv63 owwhemhu dp1hu0rb dhp61c6y iyyx5f41"><div role="none" class="j83agx80 k4urcfbm"><div role="none" class="ns4p8fja j83agx80 cbu4d94t a6sixzi8 bkfpd7mw d2edcug0 buofh1pr nred35xi"><div role="none" class="buofh1pr rj1gh0hx"></div></div><div role="none" class="l60d2q6s d1544ag0 sj5x9vvc tw6a2znq l9j0dhe7 ni8dbmo4 stjgntxs e72ty7fz qlfml3jp inkptoze qmr60zad jm1wdb64 qv66sw1b ljqsnud1 odn2s2vf tkr6xdv7" style="background-color: rgb(96, 96, 96);"><div role="none" class="rq0escxv l9j0dhe7 du4w35lb __fb-dark-mode"><div role="none" class="ljqsnud1 ii04i59q" dir="auto">${text}</div></div></div></div></span>`;
};
