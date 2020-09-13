import { from } from "core-js/fn/array";
import { ipcMain } from 'electron';

/**
 * Create an application menu template
 * @param {*} app - Electron application
 * @param {boolean} isMac - check if building for Mac
 * @returns {object[]}
 */
export default (app, isMac = true) => [
  ...(isMac
    ? [
      {
        label: app.name,
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideothers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ],
      },
      {
        label: 'File',
        submenu: [
          {
            label: 'Add files or folders',
          },
        ],
      },
      {
        label: 'Playlist',
        submenu: [
          {
            label: 'Open playlist',
          },
          {
            label: 'Save playlist',
          },
          {
            label: 'Clear playlist',
          },
        ],
      },
    ]
    : []
  ),
  {
    label: 'File',
    submenu: [
      {
        label: 'Add files and folders',
        click: () => console.log('add file click'),
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
    label: 'About',
    click: () => console.log('handle About click'),
  },
];
