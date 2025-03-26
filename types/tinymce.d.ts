/* TinyMCE类型声明 */

// 声明TinyMCE模块
declare module 'tinymce' {
  // TinyMCE编辑器实例
  export interface TinyMCEEditor {
    // 编辑器基本方法
    getContent(args?: any): string;
    setContent(content: string, args?: any): void;
    on(name: string, callback: Function): void;
    off(name: string, callback: Function): void;
    destroy(): void;
    setMode(mode: string): void;
    getContainer(): HTMLElement;
    
    // 添加缺少的属性
    ui?: {
      registry: {
        addButton(name: string, config: any): void;
        // 其他注册方法
      }
    };
    
    // 添加执行命令方法
    execCommand?(cmd: string, ui?: boolean, value?: any): any;
    
    // 和其他编辑器方法...
  }
  
  // TinyMCE主实例
  export interface TinyMCE {
    init(settings: any): Promise<TinyMCEEditor[]>;
    get(id?: string): TinyMCEEditor | null;
    remove(selector?: string): void;
    baseURL: string;
    majorVersion: string;
    minorVersion: string;
    // 和其他TinyMCE属性和方法...
  }
  
  // 默认导出为TinyMCE实例
  const tinymce: TinyMCE;
  export default tinymce;
  
  // 插件类型
  export type Plugin = (editor: TinyMCEEditor, url?: string) => void;
}

// 声明TinyMCE各组件模块
declare module 'tinymce/tinymce' {
  import tinymce from 'tinymce';
  export default tinymce;
}

declare module 'tinymce/themes/silver' {
  const Silver: any;
  export default Silver;
}

declare module 'tinymce/icons/default' {
  const Icons: any;
  export default Icons;
}

declare module 'tinymce/models/dom' {
  const DOMModel: any;
  export default DOMModel;
}

// 声明TinyMCE插件模块
declare module 'tinymce/plugins/*' {
  const Plugin: import('tinymce').Plugin;
  export default Plugin;
}

// 声明全局Window扩展
interface Window {
  tinymce: import('tinymce').TinyMCE;
  requestIdleCallback: (callback: () => void, options?: { timeout: number }) => number;
  cancelIdleCallback: (handle: number) => void;
} 