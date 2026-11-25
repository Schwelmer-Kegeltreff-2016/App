# Schwelmer Kegeltreff – App

Web-App des Schwelmer Kegeltreffs (seit 2016), läuft über GitHub Pages:
https://schwelmer-kegeltreff-2016.github.io/App/

- **Start**: nächster Kegelabend, eigenes Konto, Pinnwand, Leih-Erinnerung, Minispiel
- **Termine**: Zu-/Absagen, Anreise & Fahrgemeinschaften, Sondertermine, Kalender-Export
- **Abend**: digitale Strichliste (auch offline und im Querformat), Sitzordnung, Spiele, Tafel, Samos-Rechnung, WhatsApp-Bericht
- **Essen**: Bestellung nach Gerichtnummer + Sonderwunsch, Favoriten, Sammelliste fürs Samos
- **Mehr**: Kasse, Kassenstand, Statistiken, Vereinsgegenstände & Verleih, Anleitung, Profil, Admin-Bereich

## Wichtig: Hier liegen keine Vereinsdaten
Dieses Repository enthält nur den Programmcode und ist öffentlich.
Alle Daten (Mitglieder, Kasse, Strichlisten, Bestellungen, Kontakte) liegen im **privaten** Repository
`App-Daten` im Ordner `data/`. Die App greift mit einem Zugangsschlüssel (Fine-grained Token) aus dem
Einladungslink darauf zu. Ohne Schlüssel gibt es nur die Anmeldeseite bzw. den Demo-Modus.

## Dateien
| Datei | Zweck |
|---|---|
| `index.html` | die komplette App |
| `sw.js` | Offline-Start, Updates, Kalender-Export |
| `manifest.webmanifest`, `icon-*.png`, `logo.png` | App-Icon / „Zum Home-Bildschirm“ |
| `CLAUDE.md` | ausführliche Projektbeschreibung (Aufbau, Regeln, Arbeitsweise) |
| `CHANGELOG.md` | alle Versionen |
