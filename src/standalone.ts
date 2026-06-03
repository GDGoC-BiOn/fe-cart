// Solo dev harness: run the cart remote on its own at :3002 without the host.
import { mount } from "./mount";
import type { MarqetProduct } from "./types";

mount(document.getElementById("root")!);

const demo: Record<string, MarqetProduct> = {
  a: {
    id: "p1",
    brand: "Auro",
    name: "Headset Nirkabel Pro",
    icon: "audio",
    price: 349000,
    old: 499000,
    rate: 5,
    rev: "1.2rb",
    tag: "30% off",
  },
  b: {
    id: "p2",
    brand: "Tempo",
    name: "Smartwatch Seri 4",
    icon: "watch",
    price: 899000,
    old: null,
    rate: 4,
    rev: "847",
    tag: "Baru",
  },
};

const bar = document.createElement("div");
bar.style.cssText =
  "position:fixed;top:16px;left:16px;display:flex;gap:8px;z-index:200;font-family:Inter,sans-serif";
bar.innerHTML =
  '<button id="a">+ Headset</button><button id="b">+ Smartwatch</button><button id="o">Open cart</button>';
document.body.appendChild(bar);

const fire = (p: MarqetProduct) =>
  window.dispatchEvent(
    new CustomEvent("cart:add-item", { detail: { product: p } }),
  );
bar.querySelector("#a")!.addEventListener("click", () => fire(demo.a));
bar.querySelector("#b")!.addEventListener("click", () => fire(demo.b));
bar
  .querySelector("#o")!
  .addEventListener("click", () =>
    window.dispatchEvent(new CustomEvent("cart:open")),
  );
