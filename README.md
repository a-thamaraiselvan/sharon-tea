# Sharon Tea Stall — Premium Web Platform

> **"Every Cup, A Moment to Savour."**  
> Serving over 8,000+ cups daily, Sharon Tea Stall brings traditional artisanal chai, filter coffee, fresh herbal infusions, and savory snacks to a modern digital platform.

---

## Architecture Overview

This repository is organized as a high-performance **pnpm Monorepo** managed with **Turborepo**:

```
sharon-website/
├── apps/
│   ├── web/               # Customer-facing website (React 18, Vite 6, Tailwind CSS 3.4)
│   └── admin/             # Admin management portal (React 18, Vite 6, Ant Design 5)
├── services/
│   └── api/               # Backend API service (Node.js, Express, PostgreSQL, JWT, AWS S3)
├── packages/
│   ├── shared/            # Shared types, Zod schemas, brand constants, utilities
│   ├── tsconfig/          # Shared TypeScript configurations (base, react, node)
│   └── eslint-config/     # Unified ESLint configuration
├── pnpm-workspace.yaml    # Monorepo workspace configuration
├── turbo.json             # Turborepo build pipeline
└── package.json           # Root package.json
```

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Monorepo** | Turborepo, pnpm Workspaces |
| **Frontend (`@sharon/web`)** | React 18, TypeScript, Vite 6, Tailwind CSS 3.4, React Router DOM 6, TanStack Query 5, Zustand, React Hook Form + Zod, Lucide Icons |
| **Admin (`@sharon/admin`)** | React 18, TypeScript, Vite 6, Ant Design 5, Recharts, TanStack Query 5, Zustand, React Hook Form + Zod |
| **Backend (`@sharon/api`)** | Node.js, Express 4, TypeScript, PostgreSQL (pg driver), Argon2, JWT, Multer, Sharp, AWS S3 SDK, Helmet, Morgan, CORS, Zod |
| **Shared (`@sharon/shared`)** | TypeScript interfaces, Zod validation schemas, Brand tokens & constants |

---

## Brand Colors

| Swatch | Color Name | Hex Code | Purpose |
|---|---|---|---|
| ![#241C24](https://placehold.co/15x15/241C24/241C24.png) | **Primary (Off-Black)** | `#241C24` | Primary brand background, heavy text |
| ![#1C4C34](https://placehold.co/15x15/1C4C34/1C4C34.png) | **Forest Green** | `#1C4C34` | Brand headers, primary accent |
| ![#34A43C](https://placehold.co/15x15/34A43C/34A43C.png) | **Fresh Leaf Green** | `#34A43C` | Badges, success states, accents |
| ![#A44C14](https://placehold.co/15x15/A44C14/A44C14.png) | **Chai Brown** | `#A44C14` | Tea accents, buttons, secondary branding |
| ![#7C2C0C](https://placehold.co/15x15/7C2C0C/7C2C0C.png) | **Deep Rust** | `#7C2C0C` | Warm shadows, borders, dark accents |
| ![#FC9C34](https://placehold.co/15x15/FC9C34/FC9C34.png) | **Amber Highlight** | `#FC9C34` | Highlights, badges, callouts |
| ![#541424](https://placehold.co/15x15/541424/541424.png) | **Burgundy/Maroon** | `#541424` | Deep contrast, royal badges |
| ![#FAF7F2](https://placehold.co/15x15/FAF7F2/FAF7F2.png) | **Warm Cream** | `#FAF7F2` | Body background, card surfaces |
| ![#D4D4D4](https://placehold.co/15x15/D4D4D4/D4D4D4.png) | **Light Grey** | `#D4D4D4` | Dividers, subtle borders |
| ![#FFFFFF](https://placehold.co/15x15/FFFFFF/FFFFFF.png) | **White** | `#FFFFFF` | Card backgrounds, pure contrast |

---

## Key Features

- **WhatsApp-First Ordering**: Instant order routing directly to WhatsApp via pre-filled links formatted with items, quantities, and customer details (`wa.me` integration).
- **Interactive Menu & Category Navigation**: Filterable categories across Teas, Black Teas, Milk, Coffee, Cold Menu, Herbal Tea, and Add-ons.
- **Franchise Inquiry System**: Complete multi-step franchise application process with validated lead capture.
- **Store & Outlet Locator**: Multi-outlet directory with Google Maps integration, operating hours, and live status.
- **Admin Management Portal**: Real-time management of menus, products, outlets, franchise inquiries, gallery images, and business settings.
- **Image Optimization Pipeline**: Automatic image processing via Multer + Sharp, uploaded to AWS S3.
- **Secure Authentication**: Argon2 password hashing and JWT access/refresh token lifecycle.

---

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.15.0
- PostgreSQL >= 15

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd sharon-website

# Install all dependencies across the monorepo
pnpm install
```

### Development Scripts

```bash
# Run all applications simultaneously
pnpm dev

# Run only the public web application
pnpm dev:web

# Run only the admin dashboard
pnpm dev:admin

# Run only the backend API
pnpm dev:api

# Type-check all packages
pnpm turbo typecheck

# Lint all packages
pnpm lint

# Production build across all applications
pnpm build
```

---

## License

Private and proprietary. All rights reserved by **Sharon Tea Stall**.
