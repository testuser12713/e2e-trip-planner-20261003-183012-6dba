# Reiseplaner

Eine umfangreiche Single-Page-Web-App zum Planen von Reisen. Der Nutzer verwaltet mehrere Reisen mit Ziel und Zeitraum, plant pro Reise tagesweise Aktivitäten mit Uhrzeit, Ort, Kosten und Kategorie, behält das Budget je Kategorie als einfaches Balkendiagramm im Blick und hakt eine Packliste ab. Alle Daten liegen persistent im localStorage, die Navigation erfolgt über React Router, Formulare validieren mit klaren Fehlermeldungen, und das ruhige, moderne, responsive Design skaliert von Mobil bis Desktop.

## Tech-Stack

- **Sprache**: TypeScript
- **Framework**: React
- **Build**: Vite
- **Routing**: React Router
- **Testing**: Vitest + Testing Library
- **Datenhaltung**: localStorage
- **Styling**: reines CSS (ohne Chart-Bibliothek)

## Installation

```bash
npm ci
```

## Entwicklung

```bash
npm run dev
```

Der Dev-Server startet und öffnet die App unter `http://localhost:5173`.

## Build für Produktion

```bash
npm run build
```

Das gebaute, statische Ergebnis liegt danach in `dist/` und kann mit `npm run preview` unter `http://localhost:4173` ausgeliefert werden.

## Tests

```bash
npm test
```

## Bedienung

Die App gliedert sich in folgende Ansichten:

- **Reiseliste** (`/`): Startseite mit allen angelegten Reisen.
- **Neue Reise** (`/trips/new`): Formular zum Anlegen einer Reise mit Ziel sowie Start- und Enddatum.
- **Reise-Detail** (`/trips/:tripId`): öffnet automatisch den Tagesplan und stellt drei Reiter bereit:
  - **Tagesplan** (`/trips/:tripId/plan`): Aktivitäten je Reisetag.
  - **Budget** (`/trips/:tripId/budget`): Kostenübersicht je Kategorie.
  - **Packliste** (`/trips/:tripId/packing`): abhakbare Packliste mit Fortschritt.

Die Navigation zwischen Reiseliste, Tagesplan, Budget und Packliste erfolgt über die Kopfzeile bzw. die Reiter; die aktive Seite ist dabei hervorgehoben. Deep-Links (direktes Öffnen einer Unterseite) und Zurück-Navigation werden vollständig unterstützt.

## Features

- Mehrere Reisen mit Ziel und Zeitraum verwalten
- Tagespläne mit Aktivitäten (Uhrzeit, Ort, Kosten, Kategorie, Notiz)
- Budgetübersicht je Kategorie als Balkendiagramm
- Packliste mit Fortschrittsanzeige
- Persistente Datenhaltung im localStorage mit Cross-Tab-Sync
- Responsive Darstellung von ~320px bis Desktop
- Validierung mit verständlichen Fehlermeldungen
