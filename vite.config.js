import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// __filename과 __dirname 정의
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// findAllHtmlFiles 함수 정의 추가
function findAllHtmlFiles(directory) {
  const htmlFiles = {};

  function scanDirectory(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        scanDirectory(filePath);
      } else if (file.endsWith('.html')) {
        // 키 이름을 경로에서 추출 (확장자 제외)
        const key = path.relative(__dirname, filePath).replace('.html', '');
        htmlFiles[key] = filePath;
      }
    }
  }

  scanDirectory(directory);
  return htmlFiles;
}

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'index.html'),
        ...findAllHtmlFiles(path.resolve(__dirname, 'src')),
      },
    },
  },
  appType: 'mpa', // fallback 사용안함
  plugins: [tailwindcss()],
});
