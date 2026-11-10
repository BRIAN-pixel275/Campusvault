# CampusVault

CampusVault is a student-first academic resource dashboard designed to keep lecture notes, revision materials, coursework, and past papers organized in one place.

Built with React, TypeScript, and Vite, the app presents a clean library-style interface that helps students manage their learning resources quickly and efficiently.

## Overview

The application currently focuses on the front-end experience for an academic workspace:

- A dashboard for recent resources and key academic stats
- Search and filter support for notes and papers
- A library-style layout for course materials
- A document upload section for adding study resources
- A modern, minimal design that feels organized and easy to scan

## Features

- Search across titles, course units, and categories
- View academic items grouped by type, including notes, revision materials, and past papers
- Add resource entries through a file-upload flow
- Monitor the collection with quick summary cards for total resources, units, past papers, and bookmarks
- Responsive layout built for desktop and smaller screens

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Lucide React icons

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm

### Install dependencies

```bash
npm install
```

### Run the app locally

```bash
npm run dev
```

The app will be available in the browser at the local Vite URL printed in the terminal.

### Build for production

```bash
npm run build
```

### Lint the project

```bash
npm run lint
```

## Project Structure

```text
campusvault/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── components/
├── public/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
└── README.md
```

## Notes

This project is currently a polished front-end prototype for an academic vault. The upload flow is wired for document selection, while persistent storage and backend integration can be added next depending on the product direction.

## License

This project is  currently for educational/demo use.
