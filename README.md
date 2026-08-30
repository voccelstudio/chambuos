# Chambú Kitchen & Bar

Restaurant management web app. Runs entirely in the browser and is deployed to **GitHub Pages**.

## Screens

| Pagina          | Archivo          | Descripcion                                             |
| --------------- | ---------------- | ------------------------------------------------------- |
| Mapa de Mesas     | `index.html`     | Mapa de mesas interactivo (abre un ticket en el POS).   |
| POS & Pago        | `pos.html`       | Ticket (Gs., IVA incluido), personas por mesa, split bill, "Enviar a cocina" y flujo de pago (tarjeta/efectivo). |
| Editor de Menu    | `menu.html`      | Categorias, busqueda y alternar disponibilidad (agotado). |
| Bar & Inventario  | `inventory.html` | Stock, filtros y reposiciones rapidas.                  |
| Lista de Compras  | `shopping.html`  | Lista de compras de ingredientes (Cocina y Bar), con sugerencias de stock bajo. |
| Pantalla de Cocina| `kitchen.html`   | Tablero de cocina (Nuevo / En Preparacion / Listo / Hecho) alimentado por el POS. |
| Datos             | `analytics.html` | Data: mas vendidos, personas/tiempo por mesa y comparacion por mes. |
| Configuracion     | `settings.html`  | Nombre del negocio (mostrado en el header).             |
| Soporte           | `support.html`   | FAQ y reporte de issues en GitHub.                      |

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
| `chambu_shopping`        | Lista de compras (Shopping List).                |
| `chambu_orders`          | Tickets enviados a Kitchen Display.             |
| `chambu_ticket_next`     | Correlativo de tickets del POS.                 |
| `chambu_settings`        | Nombre del negocio (Settings).                  |
| `chambu_current_visit`   | Visita abierta del POS (mesa + personas + hora de entrada). |
| `chambu_visits`          | Historico de visitas cerradas (analytics).      |
| `chambu_tables_party`    | Personas por mesa del floor map.                |
| `chambu_analytics_orders`| Comandas historicas de ejemplo (analytics).     |

La moneda es Guaranies (`Gs.`) y todos los precios incluyen IVA (no hay impuestos extra en el ticket).

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