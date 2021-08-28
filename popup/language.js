document.addEventListener("click", (event) => {
  const enUS = document.getElementById("en-US");
  const plPL = document.getElementById("pl-PL");

  const text = document.getElementById("text");

  let language = "";

  if (enUS.checked) language = "en-US";
  if (plPL.checked) language = "pl-PL";

  // text.textContent = "Currently language: " + language;
  browser.storage.local.get().then((res) => console.log(res));
});
