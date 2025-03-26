// TinyMCE各组件模块声明

// 声明TinyMCE主题模块
declare module 'tinymce/themes/silver/theme.min.js' {
  const theme: any;
  export default theme;
}

// 声明TinyMCE图标模块
declare module 'tinymce/icons/default/icons.min.js' {
  const icons: any;
  export default icons;
}

// 声明TinyMCE模型模块
declare module 'tinymce/models/dom/model.min.js' {
  const model: any;
  export default model;
}

// 声明TinyMCE插件模块
declare module 'tinymce/plugins/*' {
  const plugin: any;
  export default plugin;
}

// 声明TinyMCE库自身
declare module 'tinymce/tinymce.min.js' {
  const tinymce: any;
  export default tinymce;
}

// 声明TinyMCE核心模块
declare module 'tinymce/themes/silver' {
  const silver: any;
  export default silver;
}

declare module 'tinymce/icons/default' {
  const icons: any;
  export default icons;
} 