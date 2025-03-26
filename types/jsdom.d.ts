declare module 'jsdom' {
  export class JSDOM {
    constructor(html: string, options?: any);
    window: {
      document: Document;
      DOMParser: typeof DOMParser;
      Node: typeof Node;
      NodeList: typeof NodeList;
      HTMLElement: typeof HTMLElement;
      XMLSerializer: typeof XMLSerializer;
      navigator: {
        userAgent: string;
      };
      location: {
        href: string;
      };
      [key: string]: any;
    };
    document: Document;
    serialize(): string;
  }
} 