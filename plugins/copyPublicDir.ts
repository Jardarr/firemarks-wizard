import type { Plugin } from 'vite';
import { existsSync, unlinkSync } from 'fs';
import { resolve } from 'path';

export function copyPublicDir(): Plugin {
  return {
    name: 'copy-public-dir',
    apply: 'build',
    writeBundle: {
      order: 'post',
      handler: () => {
        // Удаляем bookmarks.json из dist, если он был скопирован
        const bookmarksPath = resolve('dist', 'bookmarks.json');
        if (existsSync(bookmarksPath)) {
          unlinkSync(bookmarksPath);
        }
      }
    }
  };
}
