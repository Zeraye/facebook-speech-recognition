# Changelog

## v1.1.0 (2021-08-31)

- Added

  - updates interval changed from `5000ms` to `1000ms`
  - button for returning to original voice message (only visually, button will be functional in the future)

- Refractoring

  - only needed cache is get from `browser.storage.local`
  - `elementIsNotAudio` and `elementIsNotImage` changed to `audioElement` and `imageElement` (better readability and consistency)
  - trimming permissions in `manifest.json`
  - support for `http`

- Fixed

  - loading animation is taken from facebook voice message loading animation (problem with using external resources)

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
