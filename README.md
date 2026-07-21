# DebateMaster

Werkzeug zur Moderation von Debatten und Diskussionen mit Zeitsteuerung und Visualisierung der Redeanteile.

Live application: [https://debatemaster.haak3.de](https://debatemaster.haak3.de)

## Purpose

- **Educational problem**: Fair and structured debates require exact time management to ensure equal participation.
- **Intended users**: Schülerinnen und Schüler, Lehrkräfte, Debattiergruppen.
- **Shortest successful workflow**: Add participants, click on a participant's card to start their timer, click again to pause, click "Debatte stoppen" to end, and view the final speaking times chart.
- **Limitations**: All timers and debate states are currently stored in memory and will be lost on page reload unless exported.

## Privacy and storage

The core workflow runs in the browser without an account.

- **Local Storage**: Debate data is stored locally in the browser's `localStorage` to prevent accidental data loss during a session. No data is sent to any servers.
- **Uploads/Network**: No files leave the device. Network requests only occur when initially loading the application from Cloudflare Pages.
- **Data Deletion**: You can delete all saved data at any time by clicking "Debatte zurücksetzen" or by clearing your browser data.
- **Backup**: Users can create a durable backup by clicking "Als JSON exportieren".

Do not claim that no data is transmitted: the hosting provider necessarily processes technical connection data.

## Development

Requirements:

- Node.js `20`
- npm `10`

```bash
npm ci
npm run dev
```

## Verification

```bash
npm run test
npm run lint
npm run typecheck
npm run build
```

Replace these commands if the selected stack uses different scripts.

## Architecture

See [docs/architecture.md](docs/architecture.md).

## haak3 standard

This app follows the
[haak3 Web App Standard](https://github.com/ChristianHaake/haak3-webapp-standard).
Conformance and exceptions are documented in
[docs/standard-conformance.md](docs/standard-conformance.md).

## License

GNU General Public License v3.0 only. See [LICENSE](LICENSE).
