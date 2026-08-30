# Chambú Kitchen & Bar

Restaurant management web app. Runs entirely in the browser and is deployed to **GitHub Pages**.

## Screens

| Pagina          | Archivo          | Descripcion                                             |
| --------------- | ---------------- | ------------------------------------------------------- |
| Floor Map       | `index.html`     | Mapa de mesas interactivo (abre un ticket en el POS).   |
| POS & Billing   | `pos.html`       | Ticket, totales, split bill y flujo de pago (tarjeta/efectivo). |
| Menu Editor     | `menu.html`      | Categorias, busqueda y alternar disponibilidad (86'd).  |
| Bar & Inventory | `inventory.html` | Stock, filtros y Quick Restock.                         |

## Correr localmente

Abre cualquiera de los `.html` directo en el navegador, o con un servidor estatico:

```bash
# Python
python -m http.server 8000

# Node
npx serve .
```

Luego visita `http://localhost:8000`.

## Deploy

El workflow en `.github/workflows/pages.yml` publica la rama `main` en GitHub Pages automaticamente en cada push.

Pasos una sola vez:

1. En el repo: **Settings → Pages → Source: "GitHub Actions"**.
2. La URL quedara en `https://voccelstudio.github.io/chambuos/`.

## Stack

- HTML + Tailwind CSS (CDN), vanilla JavaScript.
- Diseno base: "Artisan Hospitality Suite" (`stitch_restaurant_management_system`).