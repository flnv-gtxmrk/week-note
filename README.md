# Report Writer

Daily · Weekly · Monthly — one click away.

A lightweight report writing tool built with **Vue 3 + Java (TeaVM)**, deployed on GitHub Pages.

## Features

### Core

- **Daily / Weekly / Monthly Reports** — switch report type with one click
- **Smart Decomposition** — automatically parse work items into structured sections
- **12 Built-in Templates** — covering all report types with multiple styles
- **Custom Templates** — create your own with a step-by-step editor
- **Quality Scoring** — real-time report quality analysis
- **Keyword Extraction** — auto-extract key terms from input
- **History Management** — save, search, filter, and reload past reports
- **Data Dashboard** — trend charts, type distribution, keyword cloud
- **Multi-format Export** — TXT, Markdown, HTML
- **Bilingual** — Chinese / English, switch instantly
- **Dark / Light Theme** — eye-friendly in any environment

### Templates

| Type | Templates |
|------|-----------|
| Daily | Standard Daily, Quick Daily, Learning Daily |
| Weekly | Standard Weekly, STAR Method, Minimalist, Manager View, OKR Review, Sprint Retro |
| Monthly | Standard Monthly, Monthly OKR, Growth Monthly |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vue 3 + Vite + TypeScript |
| UI | Element Plus + Custom SCSS (EduWay style) |
| State | Pinia |
| i18n | Vue I18n |
| Charts | ECharts + echarts-wordcloud |
| Animation | GSAP |
| Storage | localStorage |
| Java Engine | TeaVM (compiled to JavaScript) |
| Deploy | GitHub Actions → GitHub Pages |

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── common/          # NavBar, LangSwitch
│   └── editor/          # WorkInput, TemplateSelector, ReportPreview, ActionToolbar
├── composables/         # useWasmEngine (Java bridge + JS fallback)
├── i18n/                # zh-CN, en-US
├── stores/              # reportStore, templateStore, historyStore, settingsStore
├── styles/              # variables, global, animations
├── types/               # TypeScript interfaces
├── views/               # Home, Write, History, Dashboard, Templates, Settings
├── App.vue
└── main.ts
java-core/               # Java business logic (TeaVM compilation)
├── pom.xml
└── src/main/java/com/weekreport/
    ├── core/            # ReportEngine, TemplateParser, QualityScorer
    ├── parser/          # WorkItemParser, KeywordExtractor
    └── wasm/            # ExportedApi (JSO bridge)
```

## Deployment

### GitHub Pages

1. Push code to `main` branch
2. Go to **Settings → Pages → Source: GitHub Actions**
3. GitHub Actions auto-builds and deploys

### Custom Domain

1. Add your domain to `public/CNAME`
2. Configure DNS A records pointing to GitHub Pages IPs
3. Update `base` in `vite.config.ts` to `'/'`

## Development

### Prerequisites

- Node.js 18+
- Java 17+ (for TeaVM compilation)
- Maven 3.9+

### Build Java Engine

```bash
cd java-core
mvn clean package -DskipTests
cp target/javascript/classes.js ../public/week-report-core.js
```

### Local Development

```bash
npm run dev
```

The app runs at `http://localhost:5173/week-note/`

## License

MIT
