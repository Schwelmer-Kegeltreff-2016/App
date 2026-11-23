# Schwelmer Kegeltreff – App

Web-App des Schwelmer Kegeltreffs (seit 2016), läuft über GitHub Pages.

- **Termine**: Zu-/Absagen, Anreise, Fahrgemeinschaften, Gäste
- **Abend**: digitale Strichliste (Pudel, Glöckchen, Alle Neune, Kranz, Figur, Rauchen, Teamspiel, Spiele-Beträge), Live-Tafel, Abrechnung inkl. Getränke/Trinkgeld/Essen
- **Essen**: Bestellung je Person mit Gerichtnummer + Sonderwunsch, Sammelbestellung fürs Samos (kopieren / per WhatsApp teilen), Speisekarte
- **Kasse**: Kontostand je Mitglied (Übertrag aus Excel, Wochenbeiträge, Ausfall-Pauschale, Abende, Einzahlungen)
- **Mehr**: Strafenkatalog, Termine/Mitglieder/Speisekarte verwalten, Einladungslink

## Wichtig: Hier liegen keine Vereinsdaten
Dieses Repository enthält nur den Programmcode und ist öffentlich.
Alle Daten (Mitglieder, Kasse, Strichlisten, Bestellungen) liegen im **privaten** Repository
`kegeltreff-daten` im Ordner `data/`. Die App greift mit einem Zugangsschlüssel (Fine-grained Token) darauf zu.
Ohne Schlüssel sieht man nur die Anmeldeseite bzw. den Demo-Modus.

## Dateien
| Datei | Zweck |
|---|---|
| `index.html` | die komplette App |
| `manifest.webmanifest`, `icon-*.png`, `logo.png` | App-Icon / „Zum Startbildschirm hinzufügen“ |
