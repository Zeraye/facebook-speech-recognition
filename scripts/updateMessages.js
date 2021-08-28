const fetchSpeechToText = async (url) => {
  // getting translated message from storage.local
  let savedUrls = await browser.storage.local.get();

  if (savedUrls) {
    for (let savedUrl in savedUrls) {
      if (savedUrl === url) {
        return savedUrls[savedUrl];
      }
    }
  }

  // fetching new data
  // TODO: fetch sererUrl from heroku server
  const serverUrl = "http://61e2-78-11-176-160.ngrok.io";

  const headers = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: url }),
  };

  const response = await fetch(serverUrl + "/speech-to-text", headers);

  const message = await response.text();

  if (savedUrls) {
    savedUrls[url] = message;
    browser.storage.local.set(savedUrls);
  } else {
    browser.storage.local.set({ url: message });
  }

  return message;
};

setInterval(() => {
  const list = document.getElementsByClassName(
    "aovydwv3 j83agx80 cbu4d94t d2edcug0 l9j0dhe7"
  );

  for (let element of list) {
    if (element.getElementsByTagName("audio").length > 0) {
      const url = element.getElementsByTagName("audio")[0].getAttribute("src");
      fetchSpeechToText(url).then(
        (message) =>
          (element.innerHTML = `<span class="tojvnm2t a6sixzi8 abs2jz4q a8s20v7p t1p8iaqh k5wvi7nf q3lfd5jv pk4s997a bipmatt0 cebpdrjk qowsmv63 owwhemhu dp1hu0rb dhp61c6y iyyx5f41"><div role="none" class="j83agx80 k4urcfbm"><div role="none" class="ns4p8fja j83agx80 cbu4d94t a6sixzi8 bkfpd7mw d2edcug0 buofh1pr nred35xi"><div role="none" class="buofh1pr rj1gh0hx"></div></div><div role="none" class="l60d2q6s d1544ag0 sj5x9vvc tw6a2znq l9j0dhe7 ni8dbmo4 stjgntxs e72ty7fz qlfml3jp inkptoze qmr60zad jm1wdb64 qv66sw1b ljqsnud1 odn2s2vf tkr6xdv7" style="background-color: rgb(96, 96, 96);"><div role="none" class="rq0escxv l9j0dhe7 du4w35lb __fb-dark-mode"><div role="none" class="ljqsnud1 ii04i59q" dir="auto">${message}</div></div></div></div></span>`)
      );
    }
  }
}, 1000);
