# Chambú Kitchen & Bar

Restaurant management web app. Runs entirely in the browser and is deployed to **GitHub Pages**.

## Screens

| Pagina          | Archivo          | Descripcion                                             |
| --------------- | ---------------- | ------------------------------------------------------- |
| Floor Map       | `index.html`     | Mapa de mesas interactivo (abre un ticket en el POS).   |
| POS & Billing   | `pos.html`       | Ticket, totales, split bill, "Send to Kitchen" y flujo de pago (tarjeta/efectivo). |
| Menu Editor     | `menu.html`      | Categorias, busqueda y alternar disponibilidad (86'd).  |
| Bar & Inventory | `inventory.html` | Stock, filtros y Quick Restock.                         |
| Kitchen Display | `kitchen.html`   | Tablero de cocina (New / In Progress / Ready / Done) alimentado por el POS. |
| Settings        | `settings.html`  | Nombre del negocio, tasa de impuesto y cargo por servicio (aplicados en el POS). |
| Support         | `support.html`   | FAQ y reporte de issues en GitHub.                      |

## Nota: layout compartido

El sidebar y la barra superior son generados por `assets/js/app.js` (una sola fuente de verdad:
marca, logo y enlaces). Cada pagina solo tiene `<div data-layout-sidebar>` y `<div data-layout-topbar>`.
Para cambiar logo, nombre o links, edita las constantes `BRAND`, `LOGO` y `NAV` al inicio de `app.js`.

## Datos locales

El prototipo guarda todo en `localStorage` (sin servidor):

| Clave                    | Uso                                             |
| ------------------------ | ----------------------------------------------- |
| `chambu_reservations`    | Reservas / walk-ins (Floor Map).                |
| `chambu_menu_items`      | Items agregados en Menu Editor.                 |
| `chambu_menu_deleted`    | Items del menu marcados como eliminados.        |
| `chambu_inventory_items` | Items de stock agregados en Bar & Inventory.    |
| `chambu_inventory_deleted` | Items de stock eliminados.                    |
| `chambu_inventory_stock` | Overrides de stock tras Quick Restock.          |
| `chambu_orders`          | Tickets enviados a Kitchen Display.             |
| `chambu_ticket_next`     | Correlativo de tickets del POS.                 |
| `chambu_settings`        | Nombre, impuesto y servicio (Settings).         |

> Limpiar los datos del navegador reinicia el demo.

## Correr localmente

Abre cualquiera de los `.html` directo en el navegador, o con un servidor estatico:

```bash
# Python
python -m http.server 8000

# Node
npx serve .
```

Luego visita `http://localhost:8000`.

## CSS estatico (performance)

No se usa el CDN de Tailwind en runtime (compilaba CSS en el navegador, lo que enlentecia la UI). El CSS esta precompilado en `assets/css/tailwind.css`.

Si agregas/cambias clases de Tailwind, regenera el CSS:

```bash
npm install
npm run build:css
```

Ojo: las clases dinamicas de `assets/js/app.js` estan incluidas en la busqueda (`tailwind.config.js` → `content`).

## Deploy

El workflow en `.github/workflows/pages.yml` publica la rama `main` en GitHub Pages automaticamente en cada push.

Pasos una sola vez:

1. En el repo: **Settings → Pages → Source: "GitHub Actions"**.
2. La URL quedara en `https://voccelstudio.github.io/chambuos/`.

## Stack

- HTML + Tailwind CSS (compilado estatico), vanilla JavaScript.
- Diseno base: "Artisan Hospitality Suite" (`stitch_restaurant_management_system`).