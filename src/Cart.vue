<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { CartDrawer } from '@bion-mfe-ui/vue'
import { glyphOf, type MarqetProduct } from './types'

const rp = (n: number) => 'Rp ' + n.toLocaleString('id-ID')

// The cart remote owns its own state — no shared store. It only talks to the
// rest of the app through the window CustomEvent bus.
const cart = reactive<Record<string, { product: MarqetProduct; qty: number }>>({})
const open = ref(false)

const items = computed(() =>
  Object.values(cart).map(({ product: p, qty }) => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    glyph: glyphOf(p.icon),
    qty,
    lineTotal: rp(p.price * qty), // CartLine carries a pre-formatted string, not a number
  })),
)
const total = computed(() =>
  Object.values(cart).reduce((s, i) => s + i.product.price * i.qty, 0),
)
const count = computed(() =>
  Object.values(cart).reduce((s, i) => s + i.qty, 0),
)

// Feed the shell header badge (Vue → React) over the bus.
function emitCount() {
  window.dispatchEvent(new CustomEvent('cart:count', { detail: { count: count.value } }))
}

function onAdd(e: WindowEventMap['cart:add-item']) {
  const p = e.detail.product
  if (cart[p.id]) cart[p.id].qty++
  else cart[p.id] = { product: p, qty: 1 }
  open.value = true
  emitCount()
}
function onOpen() {
  open.value = true
}
// bion-cart-drawer's stepper resolves the new value for us.
function onQty({ id, value }: { id: string; value: number }) {
  if (value <= 0) delete cart[id]
  else if (cart[id]) cart[id].qty = value
  emitCount()
}

onMounted(() => {
  window.addEventListener('cart:add-item', onAdd)
  window.addEventListener('cart:open', onOpen)
  emitCount()
})
onUnmounted(() => {
  window.removeEventListener('cart:add-item', onAdd)
  window.removeEventListener('cart:open', onOpen)
})
</script>

<template>
  <!-- The drawer owns its scrim, close button and Escape key; we only react to
       its intents. items/open are bound as JS properties by the adapter. -->
  <CartDrawer
    :items="items"
    :subtotal="rp(total)"
    :total="rp(total)"
    shipping="Gratis"
    :open="open"
    @close="open = false"
    @quantity-change="onQty"
    @checkout="() => {}"
  />
</template>
