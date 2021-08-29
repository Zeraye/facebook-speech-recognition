# Changelog

## v1.0.1 (2021-08-29)

- Fixed

  - `withBrowserLocalCache` is now an async function
  - bug with appending new data to the `browser.storage.local`

- Refactoring

  - list of messages is created with `querySelectorAll` and based on `data-testid="message-container"`
  - text message (which replace voice message) is created with `querySelector` and based on `data-testid="message-container"`, `audio` and `img`

## v1.0.0 (2021-08-28)

- The initial release
