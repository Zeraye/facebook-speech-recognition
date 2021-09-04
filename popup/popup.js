const fetchLangs = async () => {
  const response = await fetch(
    "https://messenger-transcription-api.vercel.app/api"
  );

  const data = await response.json();

  return data["langs"];
};

const initPopup = async () => {
  const userLangCache = await browser.storage.local.get("lang");
  const userLang = userLangCache["lang"] || "en";

  const langs = await fetchLangs();

  for (const lang of langs) {
    const optionElement = document.createElement("option");
    optionElement.setAttribute("value", Object.keys(lang)[0]);
    optionElement.textContent = Object.values(lang)[0];

    if (userLang == Object.keys(lang)[0]) {
      optionElement.setAttribute("selected", "selected");
    }

    document.querySelector("select").appendChild(optionElement);
  }
};

initPopup();

document.getElementById("language-form").addEventListener("click", async () => {
  const select = document.querySelector("select");
  const option = select.options[select.selectedIndex];
  const userLang = option.value;
  await browser.storage.local.set({ lang: userLang });
});

browser.storage.local.get("transcription").then((cache) => {
  if (cache["transcription"] === undefined) {
    return;
  }
  document.getElementById("transcription").checked = cache["transcription"];
});

document
  .getElementById("transcription-form")
  .addEventListener("click", async () => {
    await browser.storage.local.set({
      transcription: document.getElementById("transcription").checked,
    });
  });

document.getElementById("clear").addEventListener("click", async () => {
  await browser.storage.local.clear();
});
