// copy-tinymce.js
import { copy } from 'fs-extra';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = resolve(__dirname, '..');

async function copyTinyMCEResources() {
  const tinymcePath = resolve(rootDir, 'node_modules/tinymce');
  const targetPath = resolve(rootDir, 'public/plugins/tinymce');
  
  try {
    // 复制TinyMCE资源到public目录
    await copy(tinymcePath, targetPath, {
      filter: (src) => {
        // 排除不需要的文件
        return !src.includes('node_modules') && 
              !src.includes('.git') && 
              !src.endsWith('.ts') &&
              !src.endsWith('.map')
      }
    });
    console.log('✅ TinyMCE资源已复制到public/plugins/tinymce');
  } catch (error) {
    console.error('❌ 复制TinyMCE资源失败:', error);
  }
}

copyTinyMCEResources(); 