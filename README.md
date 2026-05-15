# JumpStone Web

Welcome to the official website for JumpStone.

## About the Project

This is a modern web application built with [Next.js](https://nextjs.org), designed to deliver a fast, accessible, and user-friendly experience. I use cutting-edge technologies such as TailwindCSS for styling and RadixUI components to build robust UI elements.

## Getting Started

### Prerequisites

Make sure you have Node.js installed on your system. I recommend using the latest LTS version.

### Installation

Clone the repository and install dependencies:

```bash
npm install
```

### Development Server

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application. The page will automatically reload as you make changes to the code.

## Project Structure

The project follows Next.js App Router conventions:

- **`src/app/`** — Main application pages and layouts
  - `page.tsx` — Homepage
  - `layout.tsx` — Root layout
  - `robots.ts` — SEO robots configuration
  - `sitemap.ts` — XML sitemap generation
  - Individual route directories for pages like `/contact`, `/legal`, and `/code-of-conduct`

- **`src/components/`** — Reusable React components
  - UI components for common elements (buttons, cards, navigation)
  - Layout components (header, footer, sections)
  - Theme provider for dark/light mode support

- **`src/lib/`** — Utility functions and helper modules

## Building and Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `.next` directory.

### Start Production Server

```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Linting

Run the linter to check code quality:

```bash
npm run lint
```

## Technology Stack

- **Framework:** Next.js 16.2.2 with App Router
- **UI Library:** React 19.2.4
- **Component Library:** RadixUI for accessible components
- **Styling:** TailwindCSS 4 with PostCSS
- **Icons:** Lucide React
- **Language:** TypeScript
- **Linting:** ESLint

## Key Features

- Modern React architecture with server and client components
- Fully responsive design with mobile-first approach
- Dark mode support with theme switching
- SEO-optimized with metadata and sitemap generation
- Accessible UI components from RadixUI
- Fast page loads and optimal performance with Next.js optimizations

## Contributing

We welcome contributions! If you'd like to improve the website, please feel free to submit pull requests or open issues to discuss proposed changes.

## License

This project is licensed under GNU GPLv3. For more information, visit the [LICENSE File](LICENSE).
Note: The old Website is licensed under CC BY NC SA 4.0. For more information, visit the [LICENSE File](legacy/LICENSE) of the old Website.

## Support

For questions, issues, or feedback about this website, please reach out through my [contact page](https://henrymeyer.de/contact).
