/// <reference types="vite/client" />
/// <reference types="vue-router/dist/vue-router" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}