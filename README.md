## deepseen-desktop

[![Known Vulnerabilities](https://snyk.io/test/github/peterdee/deepseen-desktop/badge.svg?targetFile=package.json)](https://snyk.io/test/github/peterdee/deepseen-desktop?targetFile=package.json)

Deepseen is a simple desktop audio player with [Electron](https://www.electronjs.org), [Vue](https://vuejs.org) and [Vuex](https://vuex.vuejs.org)

### Deploy

```shell script
git clone https://github.com/peterdee/deepseen-desktop
cd ./deepseen-desktop
nvm use 14
npm i
```

### Environment variables

The `.env` file is required, see the [.env.example](.env.example) for more information

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
