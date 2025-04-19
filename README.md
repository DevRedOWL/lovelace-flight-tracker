# ✈️ Flight Tracker Cards

[![hacs][hacs-badge]][hacs-url]
[![release][release-badge]][release-url]
![downloads][downloads-badge]
![build][build-badge]

<!-- <a href="https://www.buymeacoffee.com/wareandsoft" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/white_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a> -->

## What is Flight Tracker Cards?

Flight Tracker Cards is a collection of cards for [Home Assistant][home-assistant] Dashboard UI that allows you to track and monitor flights in real-time.

### Features

- 🛫 Real-time flight tracking
- 📍 Interactive map visualization
- 📊 Flight information display
- 🎨 Customizable UI
- 🌓 Light and dark theme support
- 🚀 Easy to use and configure

## Installation

### HACS

Flight Tracker Cards is available in [HACS][hacs] (Home Assistant Community Store).

#### Custom Repository
1. Open HACS in Home Assistant
2. Go to the "Integrations" tab
3. Click the three dots menu in the top right corner
4. Select "Custom repositories"
5. Add the following repository:
   - Repository: `DevRedOWL/lovelace-flight-tracker`
   - Category: `Lovelace`
6. Click "Add"
7. Find "Flight Tracker Cards" in the list and click "Download"

### Manual

1. Download `flighttracker.js` file from the [latest release][release-url].
2. Put `flighttracker.js` file into your `config/www` folder.
3. Add reference to `flighttracker.js` in Dashboard. There's two way to do that:
    - **Using UI:** _Settings_ → _Dashboards_ → _More Options icon_ → _Resources_ → _Add Resource_ → Set _Url_ as `/local/flighttracker.js` → Set _Resource type_ as `JavaScript Module`.
      **Note:** If you do not see the Resources menu, you will need to enable _Advanced Mode_ in your _User Profile_
    - **Using YAML:** Add following code to `lovelace` section.
        ```yaml
        resources:
            - url: /local/flighttracker.js
              type: module
        ```

## Usage

All the Flight Tracker cards can be configured using Dashboard UI editor.

1. In Dashboard UI, click 3 dots in top right corner.
2. Click _Edit Dashboard_.
3. Click Plus button to add a new card.
4. Find one of the _Custom: Flight Tracker_ card in the list.

### Cards

Different cards are available for different flight tracking needs:

- 🗺️ [Flight Tracker Card](docs/cards/flight-card.md)

## Development

### Home Assistant Demo

You can run a demo instance of Home Assistant with docker by running:

```sh
npm run start:hass
```

Once it's done, go to Home Assistant instance [http://localhost:8123](http://localhost:8123) and start configuration.

#### Windows Users

If you are on Windows, either run the above command in Powershell, or use the below if using Command Prompt:

```sh
npm run start:hass-cmd
```

### Development Server

In another terminal, install dependencies and run development server:

```sh
npm run install
npm run start
```

Server will start on port `4000`.

### Build

You can build the `flighttracker.js` file in `dist` folder by running the build command.

```sh
npm run build
```

## Troubleshooting

### I don't see the last changes

1. Check that your Home Assistant version is the latest
2. Check that you have the latest Flight Tracker Cards version on HACS
3. Check that you have the latest Flight Tracker Cards version by checking the browser console
4. Clear your cache:
    - delete flighttracker resources
    - uninstall Flight Tracker Cards from HACS
    - reinstall Flight Tracker Cards from HACS

## Credits

Created and maintained by [DevRedOWL](https://github.com/DevRedOWL)

<!-- Badges -->

[hacs-url]: https://github.com/hacs/integration
[hacs-badge]: https://img.shields.io/badge/hacs-default-orange.svg?style=flat-square
[release-badge]: https://img.shields.io/github/v/release/DevRedOWL/lovelace-flight-tracker?style=flat-square
[downloads-badge]: https://img.shields.io/github/downloads/DevRedOWL/lovelace-flight-tracker/total?style=flat-square
[build-badge]: https://img.shields.io/github/actions/workflow/status/DevRedOWL/lovelace-flight-tracker/build.yml?branch=main&style=flat-square

<!-- References -->

[home-assistant]: https://www.home-assistant.io/
[hacs]: https://hacs.xyz
[release-url]: https://github.com/DevRedOWL/lovelace-flight-tracker/releases
[plugin-requirements]: https://www.hacs.xyz/docs/publish/plugin/#requirements
