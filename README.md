## deepseen-desktop

[![Build Status](https://travis-ci.org/peterdee/deepseen-desktop.svg?branch=develop)](https://travis-ci.org/peterdee/deepseen-desktop)

[![Known Vulnerabilities](https://snyk.io/test/github/peterdee/deepseen-desktop/badge.svg?targetFile=package.json)](https://snyk.io/test/github/peterdee/deepseen-desktop?targetFile=package.json)

DeepSeen is a simple desktop audio player with Electron, Vue and Vuex

### Deploy

```shell script
git clone https://github.com/peterdee/deepseen-desktop
cd ./deepseen-desktop
nvm use 14
npm i
```

### Environment variables

The `.env` file is required

See the [.env.example](.env.example) for more information

### Launch

```shell script
npm run electron:serve
```

### Build

```shell script
npm run electron:build
```

### Linting

```shell script
npm run lint
```

### License

[MIT](./LICENSE)
