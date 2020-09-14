/**
 * Create an application menu template
 * @param {*} app - Electron application
 * @param {boolean} isMac - check if building for Mac
 * @param {*} window - main application window
 * @returns {object[]}
 */
export default (app, isMac = true, window) => [
  ...(isMac
    ? [
      {
        label: app.name,
        submenu: [
          {
            label: 'Playlist Actions',
            click: () => window.webContents.send('show-playlist-actions'),
          },
          {
            label: 'About DeepSeen',
            click: () => window.webContents.send('show-about'),
          },
          {
            type: 'separator',
          },
          {
            role: 'quit',
          }
        ],
      },
      {
        label: 'File',
        submenu: [
          {
            label: 'Add files and directories',
            click: () => window.webContents.send('add-files-dialog'),
          },
        ],
      },
    ]
    : [
      {
        label: 'File',
        submenu: [
          {
            label: 'Add files and directories',
            click: () => window.webContents.send('add-files-dialog'),
          },
          {
            type: 'separator',
          },
          {
            role: 'quit',
          },
        ],
      },
      {
        label: 'Playlist Actions',
        click: () => window.webContents.send('show-playlist-actions'),
      },
      {
        label: 'About DeepSeen',
        click: () => window.webContents.send('show-about'),
      },
    ]
  ),
];
