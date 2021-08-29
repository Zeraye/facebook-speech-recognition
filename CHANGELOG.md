# Changelog

## v1.0.2 (2021-08-29)

- Added

  - fetching data is visualized with loading animation
  - changed voice messages have green border

- Refractoring

  - updates interval changed from `1000ms` to `5000ms`

## v1.0.1 (2021-08-29)

- Fixed

  - `withBrowserLocalCache` is now an async function
  - bug with appending new data to the `browser.storage.local`

- Refactoring

  - list of messages is created with `querySelectorAll` and based on `data-testid="message-container"`
  - text message (which replace voice message) is created with `querySelector` and based on `data-testid="message-container"`, `audio` and `img`

## v1.0.0 (2021-08-28)

- The initial release
