# HMT Clan Admin Dashboard

Das Admin-Dashboard unter `/admin` der `hmt-clan`-App erlaubt autorisierten
Mitgliedern, die Inhalte der Website direkt zu pflegen. Jede Änderung wird als
Git-Commit über die GitHub-API geschrieben – GitHub bleibt die „Source of
Truth“ und das Deployment (Vercel) wird automatisch angestoßen.

## Architektur

```
/admin                  → Admin-UI (client, ohne öffentliches Chrome)
/api/admin/*            → Admin-REST-API (serverseitig, jede Route prüft Auth)
src/lib/auth/           → Discord-OAuth, JWT-Sessions, Allowlist, CSRF, Rate-Limit
src/lib/github/         → GitHub-Content-API (lesen/schreiben/löschen/Commits)
src/lib/admin/          → Schemas (zod), Content-Services, Pfade, HTTP-Helfer
docs/admin.md           → diese Dokumentation
```

- **Login:** Discord OAuth2 · Redirect-URI ist `{NEXT_PUBLIC_URL}/api/admin/auth/callback`.
- **Session:** signiertes JWT (HS256) in einem HttpOnly/`SameSite=Lax`-Cookie
  (`hmt_admin_session`, 7 Tage).
- **Autorisierung:** Für *jede* Admin-API und das `/admin`-Layout wird die
  Discord-ID gegen die Allowlist `DISCORD_ALLOWED_USER_IDS` serverseitig geprüft.
  Eingeloggte, aber nicht freigeschaltete Nutzer sehen eine „Access denied“
  –Seite.
- **GitHub:** Ein Bot-Token (`HMT_GITHUB_TOKEN`) schreibt `events.json`,
  `crew.json`, `season.json` und Event-Markdown-Dateien direkt in das Repository.
  Schreibende Requests gehen über die typisierten Admin-Content-Services – es
  gibt kein generisches „Write-any-file“-Endpoint.

## Env-Variablen (`apps/hmt-clan/.env.local`)

| Variable | Pflicht | Beschreibung |
| --- | --- | --- |
| `NEXT_PUBLIC_URL` | ja | Öffentliche Basis-URL der App (z. B. `https://hmt-clan.vercel.app`). |
| `AUTH_SECRET` | ja | Min. 32 Zeichen. Erzeugen: `openssl rand -base64 32`. |
| `DISCORD_CLIENT_ID` | mit Login | Discord-Anwendungs-ID. |
| `DISCORD_CLIENT_SECRET` | mit Login | Discord-Client-Secret. |
| `DISCORD_REDIRECT_URI` | mit Login | Exakt `{NEXT_PUBLIC_URL}/api/admin/auth/callback`. |
| `DISCORD_ALLOWED_USER_IDS` | mit Login | Kommagetrennte Discord-User-IDs, die Zugriff haben. |
| `HMT_GITHUB_TOKEN` | mit Speicherung | GitHub-PAT (classic) mit `repo`- oder `contents`-Scope für den Bot-Account. |
| `HMT_GITHUB_OWNER` | optional | Standard: `henrymmey`. |
| `HMT_GITHUB_REPOSITORY` | optional | Standard: `henrymeyer.de`. |
| `HMT_GITHUB_BRANCH` | optional | Standard: `main`. |

Kopiere `apps/hmt-clan/.env.example` nach `apps/hmt-clan/.env.local` und fülle
die Werte.

## Einrichtung

### 1. Discord-Anwendung

1. [Discord Developer Portal](https://discord.com/developers/applications) →
   *New Application*.
2. Unter *OAuth2* → *Redirects* die URL `https://<deine-domain>/api/admin/auth/callback`
   eintragen.
3. *OAuth2* → *General* notieren: Client-ID und Client-Secret.
4. **Scopes:** `identify` (`guilds` ist nicht nötig).

### 2. Discord-User-IDs

Die erlaubten User-IDs ermitteln (z. B. Discord in Entwicklermodus → Rechtsklick
auf den Benutzer → *Copy User ID*) und kommagetrennt in
`DISCORD_ALLOWED_USER_IDS` eintragen.

### 3. GitHub-Bot-Token

1. Im GitHub-Konto des Bot-Accounts: *Settings* → *Developer settings* →
   *Personal access tokens* → *Tokens (classic)* → *Generate new token*.
2. Scope `repo` (oder gezielt `contents:write` + `contents:read`) setzen.
3. Als `HMT_GITHUB_TOKEN` hinterlegen.
4. Der Token muss Schreibrechte auf `{HMT_GITHUB_OWNER}/{HMT_GITHUB_REPOSITORY}`
   (Standard: `henrymmey/henrymeyer.de`) haben.

Der Bot commitet als „admin: …“ – wer als Autor erscheint, hängt vom Token-Account ab.

## Bedienung

- **Events:** Liste mit Suche/Filter (Alle / Veröffentlicht / Entwurf),
  Veröffentlichungs-Toggle, Duplizieren, Löschen. Editor für Stammdaten
  (`events.json`) und ein separater Markdown-Editor mit Live-Vorschau für die
  Detailseite (`src/content/events/{slug}.md`).
- **Crew:** Reihenfolge per Pfeilen ändern (schreibt `priority` in `crew.json`),
  Mitglieder anlegen/bearbeiten/löschen.
- **Seasons:** Seasons mit Zeitraum verwalten.
- **Dashboard:** Statistiken, aktuelle Season, GitHub-Status inkl. letzter Commits.

### Mapping „Status“

- **Veröffentlicht** = `show: true` · **Entwurf** = `show: false`.
- **Vergangen** = `done: true`.

## Sicherheit

- Session-Cookie ist `httpOnly` und `SameSite=Lax`; zusätzlich prüfen
  mutierende Requests den `Origin`-Header (CSRF).
- OAuth-Flow nutzt einen `state`-Parameter; Login und Callback sind
  rate-limited (in-memory).
- Secrets (`DISCORD_CLIENT_SECRET`, `HMT_GITHUB_TOKEN`, `AUTH_SECRET`) werden
  nie an den Client gesendet und nur serverseitig verwendet.
- Der Markdown-Editor rendert die Vorschau mit `react-markdown` ohne
  `rehype-raw` (wie die öffentliche Seite) – kein Blind-HTML.

## Fehlerbehebung

- **„GitHub API is not configured“** → `HMT_GITHUB_TOKEN` fehlt.
- **„Not authenticated“** → Session abgelaufen; neu einloggen.
- **„Forbidden“** → Discord-ID fehlt in `DISCORD_ALLOWED_USER_IDS`.
- **HTTP 409 beim Speichern** → Datei hat sich in der Zwischenzeit auf GitHub
  geändert. Seite neu laden und erneut speichern.