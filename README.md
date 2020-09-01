## vue-electron-audioplayer

[![Known Vulnerabilities](https://snyk.io/test/github/peterdee/vue-electron-audioplayer/badge.svg?targetFile=package.json)](https://snyk.io/test/github/peterdee/vue-electron-audioplayer?targetFile=package.json)

Deepseen is a simple desktop audio player with Electron, Vue and Vuex

DEV (browser): http://localhost:8080

### Deploy

```shell script
git clone https://github.com/peterdee/vue-electron-audioplayer
cd ./vue-electron-audioplayer
nvm use 14
npm i
```

### Environment variables

The `.env` file is required

See the [.env.example](.env.example) for more information

### Launch

Browser:

```shell script
npm run serve
```

Standalone:

```shell script
npm run electron:serve
```

### Build

Static:

```shell script
npm run build
```

Binary:

```shell script
npm run electron:build
```

### Linting

```shell script
npm run lint
```
