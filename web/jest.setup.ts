import { TextDecoder, TextEncoder } from 'node:util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
