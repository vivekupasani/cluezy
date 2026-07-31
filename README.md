# Cluezy

Agentic Search Engine.

![capture](/app/opengraph-image.png)

## 🗂️ Overview

- 🛠 [Features](#-features)
- 🧱 [Stack](#-stack)
- 🚀 [Quickstart](#-quickstart)
- 🌐 [Deploy](#-deploy)
- 🔎 [Search Engine](#-search-engine)
- 💙 [Sponsors](#-sponsors)
- 👥 [Contributing](#-contributing)
- 📄 [License](#-license)

## 🛠 Features

### Core Search & Routing

- **AI-powered search with Generative UI** for instant, contextual answers
- **Intelligent Tool Routing**: Simply type your query, and Cluezy automatically understands which tools it needs to call
- **Multi-Source Support**: Search across multiple sources including the Web, Academic Papers, Twitter, Reddit, and GitHub
- **Multiple Search Provider Support** (Tavily, SearXNG, Exa, Firecrawl) for broad and reliable coverage
- **Deep Search Mode**:
  - Runs multi-step searches across sources
  - Cross-verifies information
  - Produces structured, citation-backed search reports
- **Live Data Retrieval**: Includes real-time weather and up-to-date information

### Content & Document Intelligence

- **Document Analysis & Chat**:
  - Upload **PDFs, Docs, and PPTs** to chat, ask questions, or fact-check information
  - **Syllabus Helper (for students)**: Upload an entire syllabus as a PDF to generate practice question papers covering the whole syllabus
  - **Multi-file Search**: Search across uploaded files for specific answers
- **Web & Video Summarization**:
  - Paste any YouTube link to get captions and structured summaries of the video
  - Paste any website URL to summarize or translate its content

### App Connectors

- **Integrations**: Connect external apps like Gmail, GitHub, Slack, Notion, and Google Drive
- **Unified Actions**: Perform tasks and search data across connected apps from a single interface

### Sharing & Export

- **Multi-Format Exports**: Download AI-generated answers as **PDF, DOCX, or Markdown** files for easy sharing and documentation
- **Conversation Sharing**: Share chats with other users via a secure, shareable link to view the entire conversation

### User Experience (UX) Enhancements

- **Source Filtering**: Exclude specific sources from searches
- **Enhance Prompt Button**: Automatically refine and improve prompts before searching
- **Keyboard Shortcuts**: Native hotkeys for fast navigation and ease of use
- **Multiple Themes**: Custom styling and theme options to personalize the UI

### Security & Rate Limiting

- **IP-based Usage Limiting**: Prevent abuse and protect API resources using IP-based request limits

### Authentication

- User authentication powered by [Supabase Auth](https://supabase.com/docs/guides/auth)
- Supports Email/Password sign-up and sign-in
- Supports Social Login with Google

### Chat & History

- Chat history functionality (Optional, powered by Redis)
- Redis support (Local/Upstash)

### AI Providers

The following AI providers are supported:

- OpenAI (Default)
- Google Generative AI
- Azure OpenAI
- Anthropic
- Ollama
- Groq
- DeepSeek
- Fireworks
- xAI (Grok)
- OpenAI Compatible

Models are configured in `public/config/models.json`. Each model requires its corresponding API key to be set in the environment variables. See [Configuration Guide](docs/CONFIGURATION.md) for details.

### Search Capabilities

- URL-specific search
- Video search support (Optional)
- SearXNG integration with:
  - Customizable search depth (basic/advanced)
  - Configurable engines
  - Adjustable results limit
  - Safe search options
  - Custom time range filtering

### Additional Features

- Docker deployment ready
- Browser search engine integration

## 🧱 Stack

### Core Framework

- [Next.js](https://nextjs.org/) - App Router, React Server Components
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vercel AI SDK](https://sdk.vercel.ai/docs) - Text streaming / Generative UI

### Authentication & Authorization (Updated Category)

- [Supabase](https://supabase.com/) - User authentication and backend services

### AI & Search

- [OpenAI](https://openai.com/) - Default AI provider (Optional: Google AI, Anthropic, Groq, Ollama, Azure OpenAI, DeepSeek, Fireworks)
- [Tavily AI](https://tavily.com/) - Default search provider
- Alternative providers:
  - [SearXNG](https://docs.searxng.org/) - Self-hosted search
  - [Exa](https://exa.ai/) - Neural search
  - [Firecrawl](https://firecrawl.dev/) - Web, news, and image search with crawling, scraping, LLM-ready extraction, and [open source](https://github.com/firecrawl/firecrawl).

### Data Storage

- [Upstash](https://upstash.com/) - Serverless Redis
- [Redis](https://redis.io/) - Local Redis option

### UI & Styling

- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components
- [Lucide Icons](https://lucide.dev/) - Beautiful & consistent icons

## 🚀 Quickstart

### 1. Fork and Clone repo

Fork the repo to your Github account, then run the following command to clone the repo:

```bash
git clone https://github.com/vivekupasani/cluezy.git
```

### 2. Install dependencies

```bash
cd cluezy
bun install
```

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in the required environment variables in `.env.local`:

```bash
# Required for Core Functionality
OPENAI_API_KEY=     # Get from https://platform.openai.com/api-keys
TAVILY_API_KEY=     # Get from https://app.tavily.com/home
```

For optional features configuration (Redis, SearXNG, etc.), see [CONFIGURATION.md](./docs/CONFIGURATION.md)

### 4. Run app locally

#### Using Bun

```bash
bun dev
```

#### Using Docker

Ensure you have configured your environment variables in `.env.local` first (see the step above).

##### Option A: Using Docker Compose (Recommended)

1. Build and start the container:
   ```bash
   docker compose up -d --build
   ```

2. Visit http://localhost:4000 in your browser.

*(Note: The default host port mapped in `docker-compose.yaml` is `4000` to avoid conflicts with standard local Next.js dev server. You can change this in `docker-compose.yaml` if needed.)*

##### Option B: Using Docker CLI (without Compose)

1. Build the Docker image manually:
   ```bash
   docker build -t cluezy .
   ```

2. Run the container using the environment file and port mapping:
   ```bash
   docker run -d -p 4000:3000 --env-file .env.local --name cluezy-app cluezy
   ```

3. Visit http://localhost:4000 in your browser.

## 🌐 Deploy

Host your own live version of cluezy with Vercel, Cloudflare Pages, or Docker.

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvivekupasani%2Fcluezy&env=OPENAI_API_KEY,TAVILY_API_KEY,UPSTASH_REDIS_REST_URL,UPSTASH_REDIS_REST_TOKEN)

### Docker Prebuilt Image

Prebuilt Docker images are available on GitHub Container Registry:

```bash
docker pull ghcr.io/miurla/cluezy:latest
```

You can use it with docker-compose:

```yaml
services:
  cluezy:
    image: ghcr.io/miurla/cluezy:latest
    env_file: .env.local
    ports:
      - '3000:3000'
    volumes:
      - ./models.json:/app/public/config/models.json # Optional: Override default model configuration
```

The default model configuration is located at `public/config/models.json`. For Docker deployment, you can create `models.json` alongside `.env.local` to override the default configuration.

## 🔎 Search Engine

### Setting up the Search Engine in Your Browser

If you want to use cluezy as a search engine in your browser, follow these steps:

1. Open your browser settings.
2. Navigate to the search engine settings section.
3. Select "Manage search engines and site search".
4. Under "Site search", click on "Add".
5. Fill in the fields as follows:
   - **Search engine**: cluezy
   - **Shortcut**: cluezy
   - **URL with %s in place of query**: `https://cluezy.sh/search?q=%s`
6. Click "Add" to save the new search engine.
7. Find "cluezy" in the list of site search, click on the three dots next to it, and select "Make default".

This will allow you to use cluezy as your default search engine in the browser.

## 👥 Contributing

We welcome contributions to cluezy! Whether it's bug reports, feature requests, or pull requests, all contributions are appreciated.

Please see our [Contributing Guide](CONTRIBUTING.md) for details on:

- How to submit issues
- How to submit pull requests
- Commit message conventions
- Development setup

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
