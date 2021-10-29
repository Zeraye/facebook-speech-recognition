/**
 * @param {function} fetchFunction
 */
const withBrowserLocalCache = (fetchFunction) => async (url, lang) => {
  const cache = await browser.storage.local.get(lang + url);

  if (cache[lang + url] || cache[lang + url] === "") {
    return cache[lang + url];
  }
  const result = await fetchFunction(url, lang);

  await browser.storage.local.set({ [lang + url]: result });

  return result;
};

const fetchServerUrl = async () => {
  const response = await fetch(
    "https://messenger-transcription-api.vercel.app/api"
  );

  const data = await response.json();

  return data["server_url"];
};

/**
 * @param {string} url
 * @param {string} lang
 */
const fetchSpeechToText = async (url, lang) => {
	return "test";

  const serverUrl = await fetchServerUrl();

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, lang }),
  };

  const response = await fetch(serverUrl + "/api", requestOptions);

  const data = await response.json();

  return data["transcription"];
};

const memoizedFetchSpeechToText = withBrowserLocalCache(fetchSpeechToText);

const updateMessenger = async () => {
  const langCache = await browser.storage.local.get("lang");
  const lang = langCache["lang"] || "en";

  const transcriptionCache = await browser.storage.local.get("transcription");
  const transcription = transcriptionCache["transcription"];

  await new Promise((r) => setTimeout(r, 3000));

  setInterval(async () => {
    if (transcription === false) {
      return;
    }

    const messages = document.querySelectorAll(
      `[data-testid="message-container"]`
    );

    for (const message of messages) {
      const audioMessage = message.querySelector("audio");

      if (!audioMessage) {
        continue;
      }

      if (audioMessage.getAttribute("changeable") === "false") {
        continue;
      }

      message.innerHTML = createMessengerTextMessage(
        "Transcribing voice message..."
      );

      const url = audioMessage.getAttribute("src");

      let text = "";

      try {
        text = await memoizedFetchSpeechToText(url, lang);
      } catch {
        text = "Error while fetching!";
      }

      [html, key] = createMessengerTextMessage(text, url);

      message.innerHTML = html;

      const audioTagEventListener = `
      initAudio = () => {
        const timeConverter = (time) => {
          let seconds = time % 60;
          if (seconds < 10) seconds = "0" + seconds;
          let minutes = (time - seconds) / 60;
          if (minutes < 10) minutes = "0" + minutes;
          return minutes + ":" + seconds;
        };
  
        const audioElement = document.querySelector('[audioKey="${key}"]');
  
        const audio = audioElement.querySelector("audio");
        const button = audioElement.querySelector("p");
        const time = audioElement.querySelector("span");

        audio.onloadedmetadata = () => {
          time.textContent = timeConverter(parseInt(audio.duration));
        };

        button.addEventListener("click", () => {
          if (button.textContent === "⏸ ") {
            button.textContent = "▶️ ";
            audio.pause();
            return;
          }
					
          button.textContent = "⏸️ ";
          audio.play();
        });

        audio.addEventListener("ended", () => {
          time.textContent = timeConverter(parseInt(audio.duration));
          button.textContent = "▶️ ";
        });

        audio.addEventListener("timeupdate", () => {
          time.textContent = timeConverter(
            parseInt(audio.duration - audio.currentTime)
          );
        });
      }

      initAudio();
    `;
      const audioTagScript = document.createElement("script");
      audioTagScript.innerHTML = audioTagEventListener;
      document.body.appendChild(audioTagScript);
    }
  }, 1000);
};

updateMessenger();

/**
 * @param {string} text
 */
const createMessengerTextMessage = (text, url) => {
  const messages = document.querySelectorAll(
    `[data-testid="message-container"]`
  );

  for (let message of messages) {
    message = message.cloneNode(true);

    const audioMessage = message.querySelector("audio");
    const imageMessage = message.querySelector("img");
    const removedMessage =
      message.children[0].children[0].children[0].children[0].children
        .length === 0;

    if (audioMessage || imageMessage || removedMessage) {
      continue;
    }

    message.children[0].children[0].children[0].querySelector(
      '[role="none"]'
    ).children[1].style.borderRadius = "18px";

    message.querySelector('[dir="auto"]').textContent = text;

    const uniqueKey = Math.random().toString(36).substr(2, 9);

    // This should happen when voice message is transcribing
    if (url === undefined) {
      return [message.innerHTML, uniqueKey];
    }

    const audioDiv = document.createElement("div");
    audioDiv.setAttribute("audioKey", uniqueKey);
    audioDiv.classList.add("audio");
    const audioAudio = document.createElement("audio");
    audioAudio.setAttribute("changeable", "false");
    audioAudio.setAttribute("preload", "metadata");
    audioAudio.setAttribute("src", url);
    const audioParagraph = document.createElement("p");
    audioParagraph.setAttribute("onmousedown", "return false");
    audioParagraph.setAttribute("onselectstart", "return false");
    audioParagraph.style.cursor = "pointer";
    audioParagraph.style.display = "inline";
    audioParagraph.textContent = "▶️ ";
    const audioSpan = document.createElement("span");
    audioDiv.appendChild(audioAudio);
    audioDiv.appendChild(audioParagraph);
    audioDiv.appendChild(audioSpan);

    message.querySelector('[dir="auto"]').appendChild(audioDiv);

    return [message.innerHTML, uniqueKey];
  }
};
