import '@bion-mfe-ui/tokens/css'
import { createApp, type App } from 'vue'
import Cart from './Cart.vue'

// Exposed federated module. The React host can't render a Vue tree as a React
// child, so the cart remote hands back a framework-agnostic mount/unmount pair
// that operates on a plain DOM node.
let app: App | null = null

export function mount(el: HTMLElement): void {
  app = createApp(Cart)
  app.mount(el)
}

export function unmount(): void {
  app?.unmount()
  app = null
}
