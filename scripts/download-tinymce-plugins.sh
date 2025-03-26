#!/bin/bash

# 创建目录结构
mkdir -p public/plugins/tinymce/skins/ui/oxide
mkdir -p public/plugins/tinymce/skins/content/default
mkdir -p public/plugins/tinymce/icons/default
mkdir -p public/plugins/tinymce/models/dom
mkdir -p public/plugins/tinymce/themes/silver

# CDN URL
CDN_URL="https://cdn.tiny.cloud/1/no-api-key/tinymce/6.8.2"

# 下载 TinyMCE 核心
echo "下载 TinyMCE 核心文件..."
curl -L $CDN_URL/tinymce.min.js -o public/plugins/tinymce/tinymce.min.js

# 下载主题
echo "下载 TinyMCE 主题..."
curl -L $CDN_URL/themes/silver/theme.min.js -o public/plugins/tinymce/themes/silver/theme.min.js

# 下载图标
echo "下载 TinyMCE 图标..."
curl -L $CDN_URL/icons/default/icons.min.js -o public/plugins/tinymce/icons/default/icons.min.js

# 下载 DOM 模型
echo "下载 TinyMCE DOM 模型..."
curl -L $CDN_URL/models/dom/model.min.js -o public/plugins/tinymce/models/dom/model.min.js

# 下载皮肤CSS文件
echo "下载 TinyMCE 皮肤文件..."
curl -L $CDN_URL/skins/ui/oxide/skin.min.css -o public/plugins/tinymce/skins/ui/oxide/skin.min.css
curl -L $CDN_URL/skins/ui/oxide/content.min.css -o public/plugins/tinymce/skins/ui/oxide/content.min.css
curl -L $CDN_URL/skins/content/default/content.min.css -o public/plugins/tinymce/skins/content/default/content.min.css

# 同时下载非压缩版本以备调试
curl -L $CDN_URL/skins/ui/oxide/skin.css -o public/plugins/tinymce/skins/ui/oxide/skin.css
curl -L $CDN_URL/skins/ui/oxide/content.css -o public/plugins/tinymce/skins/ui/oxide/content.css
curl -L $CDN_URL/skins/content/default/content.css -o public/plugins/tinymce/skins/content/default/content.css

# 定义插件列表
plugins=(
  "advlist"
  "autolink"
  "lists"
  "link"
  "image"
  "charmap"
  "preview"
  "anchor"
  "searchreplace"
  "visualblocks"
  "code"
  "fullscreen"
  "insertdatetime"
  "media"
  "table"
  "help"
  "wordcount"
)

# 下载插件
echo "下载 TinyMCE 插件..."
for plugin in "${plugins[@]}"; do
  echo "下载 $plugin 插件..."
  mkdir -p "public/plugins/tinymce/$plugin"
  curl -L "$CDN_URL/plugins/$plugin/plugin.min.js" -o "public/plugins/tinymce/$plugin/plugin.min.js"
done

# 下载帮助插件的国际化文件
echo "下载帮助插件的国际化文件..."
mkdir -p "public/plugins/tinymce/help/js/i18n/keynav"
curl -L "$CDN_URL/plugins/help/js/i18n/keynav/en.js" -o "public/plugins/tinymce/help/js/i18n/keynav/en.js"

echo "所有文件下载完成！" 