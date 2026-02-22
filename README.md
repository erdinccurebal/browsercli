# webcli

Headless browser CLI for AI coding agents. Control a real Chromium browser from the command line.

Built for [Claude Code](https://claude.com/claude-code) and similar AI-powered development tools that need to interact with web pages programmatically.

[![npm](https://img.shields.io/npm/v/@erdinccurebal/webcli?color=58a6ff&style=flat-square)](https://www.npmjs.com/package/@erdinccurebal/webcli)
[![license](https://img.shields.io/github/license/erdinccurebal/webcli?color=bc8cff&style=flat-square)](./LICENSE)
[![node](https://img.shields.io/badge/node-%3E%3D22-3fb950?style=flat-square)](https://nodejs.org)

## Links

| | |
|---|---|
| **npm** | [npmjs.com/package/@erdinccurebal/webcli](https://www.npmjs.com/package/@erdinccurebal/webcli) |
| **Website** | [erdinccurebal.github.io/webcli](https://erdinccurebal.github.io/webcli/) |
| **GitHub** | [github.com/erdinccurebal/webcli](https://github.com/erdinccurebal/webcli) |
| **ClawHub** | [clawhub.ai/skills/webcli](https://clawhub.ai/skills/webcli) |
| **Skills.sh** | `npx skills add erdinccurebal/webcli` |

## Features

- **30+ commands** — navigate, read page content, interact with elements, take screenshots
- **Persistent daemon** — browser stays open between commands, no startup overhead
- **Multi-tab** — manage multiple named browser tabs simultaneously
- **Anti-detection** — realistic user-agent, webdriver flag removal, configurable viewport
- **Session persistence** — cookies and localStorage persist across daemon restarts
- **JSON output** — structured output for programmatic consumption
- **Headed/headless** — toggle via config for sites with bot detection
- **Agent skill** — works as a skill for Claude Code, Cursor, Copilot, Codex, Windsurf and 30+ other agents

## Installation

### As npm package

```bash
npm install -g @erdinccurebal/webcli
npx playwright install chromium
```

### As agent skill

**Skills.sh** (Claude Code, Cursor, Copilot, Codex, Windsurf + 30 more):
```bash
npx skills add erdinccurebal/webcli
```

**ClawHub** (OpenClaw):
```bash
clawhub install webcli
```

## Quick Start

```bash
webcli go https://example.com          # Navigate (auto-starts daemon)
webcli source                           # Read page text
webcli links                            # List all links
webcli click "More information..."      # Click by visible text
webcli screenshot -o page.png           # Take screenshot
webcli stop                             # Stop daemon
```

## Commands

### Navigation

| Command | Description |
|---------|-------------|
| `webcli go <url>` | Navigate to URL |
| `webcli back` | Go back in history |
| `webcli forward` | Go forward in history |
| `webcli reload` | Reload current page |

Options for `go`: `-w, --wait <strategy>` — `domcontentloaded` (default), `networkidle`, `load`

### Reading

| Command | Description |
|---------|-------------|
| `webcli source` | Get visible text content of the page |
| `webcli html <selector>` | Get innerHTML of a specific element |
| `webcli attr <selector> <attribute>` | Get an element's attribute value |
| `webcli links` | List all links (text + href) |
| `webcli forms` | List all forms with their inputs |
| `webcli eval <js>` | Execute JavaScript and return result |

### Interaction

| Command | Description |
|---------|-------------|
| `webcli click <text>` | Click element by visible text |
| `webcli clicksel <selector>` | Click element by CSS selector |
| `webcli focus <selector>` | Focus element by CSS selector |
| `webcli type <text>` | Type text with keyboard |
| `webcli fill <selector> <value>` | Fill an input field |
| `webcli select <selector> <value>` | Select a dropdown option |
| `webcli press <key>` | Press a keyboard key (Enter, Tab, Escape...) |

### Waiting

| Command | Description |
|---------|-------------|
| `webcli wait <selector>` | Wait for CSS selector to become visible |
| `webcli waitfor <text>` | Wait for text to appear on page |
| `webcli sleep <ms>` | Sleep for specified milliseconds |

### Cookies & Browser

| Command | Description |
|---------|-------------|
| `webcli cookie export` | Export cookies as JSON |
| `webcli cookie import <file>` | Import cookies from JSON file |
| `webcli viewport <width> <height>` | Change viewport size |
| `webcli useragent <string>` | Change user agent |
| `webcli network [on\|off]` | Toggle request/response logging |
| `webcli screenshot` | Take a full-page screenshot |

### Tab & Daemon Management

| Command | Description |
|---------|-------------|
| `webcli tabs` | List all open tabs |
| `webcli quit` | Close a tab |
| `webcli status` | Show daemon status (PID, uptime, tabs) |
| `webcli stop` | Stop the daemon and close browser |

### Global Options

| Option | Description |
|--------|-------------|
| `-t, --tab <name>` | Target tab (default: `"default"`) |
| `--json` | Output as JSON |
| `--timeout <ms>` | Command timeout (default: `30000`) |
| `--verbose` | Enable debug logging |

## Configuration

Create `~/.webcli/config.json`:

```json
{
  "headless": true,
  "browser": "chromium",
  "userDataDir": "~/.webcli/browser-data",
  "viewport": { "width": 1280, "height": 800 },
  "locale": "en-US",
  "timezoneId": "America/New_York",
  "waitAfterClick": 500,
  "waitAfterPress": 300,
  "idleTimeout": 300000,
  "defaultTimeout": 30000
}
```

Set `"headless": false` to use headed mode (required for sites with aggressive bot detection like X/Twitter).

## Architecture

```
CLI Client (webcli)
    │
    │── Unix Socket (~/.webcli/daemon.sock)
    │
    ▼
Daemon (background process)
    │
    ├── Playwright Browser (Chromium/Firefox/WebKit)
    │   ├── Tab: "default" → Page
    │   ├── Tab: "search"  → Page
    │   └── Tab: "login"   → Page
    │
    ├── Tab Manager (named page instances)
    ├── Handler Registry (action dispatch)
    └── Auto-shutdown after 5min idle
```

The daemon starts automatically on the first command and persists in the background. All commands communicate via a Unix domain socket using newline-delimited JSON.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup and guidelines.

## License

[MIT](./LICENSE)
