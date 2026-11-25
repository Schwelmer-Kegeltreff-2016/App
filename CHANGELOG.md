# Änderungsliste – Schwelmer Kegeltreff App

## 1.3.1 · 25.11.2026
- Fehler behoben: Eine später eingereihte Meldung (z. B. Minispiel-Wurf) verzögerte das Hochladen eiliger Änderungen um bis zu 15 Sekunden.
- Projektbeschreibung (`CLAUDE.md`), Änderungsliste und Testpaket angelegt.

## 1.3.0 · 24.11.2026
- Minispiel „Ein Wurf“: beim App-Start (max. alle 3 Std., abschaltbar im Profil) und jederzeit über die Startseite;
  Ergebnisse Pudel, 1–8 Holz, Kranz, Alle Neune; Statistik und Bestenliste im Profil (`minispiel.json`).

## 1.2.1 · 24.11.2026
- Untere Leiste bleibt fest am Rand (kein Springen beim Scrollen auf dem iPhone).
- Fenster sitzen immer über Leiste und Tastatur; die App dahinter ist gesperrt, bis das Fenster erledigt ist.
- Pinnwand: 👍/👎 je Mitglied, nochmal tippen nimmt die Bewertung zurück.

## 1.2.0 · 24.11.2026
- Update-Fehler behoben: Der Service Worker (v3/v4) holte beim Öffnen immer die alte gespeicherte Version.
- Knopf „🔄 Auf Updates prüfen“ (Startseite unten, Mehr); Aktualisieren leert den alten Offline-Speicher.
- Kalender repariert: echte .ics-Datei mit allen Details (iPhone über SW-Adresse), Google-Kalender-Link (Android).
- Admin: Übersicht „Wer nutzt die App?“ (`nutzung.json`).
- Pinnwand auf der Startseite (App-Wunsch / Allgemein / Hinweis; 24 Std., 1 Woche, 1 Monat).
- Vereinsgegenstände & Verleih (Beamer, Soundbox, Starlink): ausleihen, Rückgabefrist, Erinnerung auf der Startseite.
- „Abend zurücksetzen“ immer sichtbar (🔒, fragt nach Passwort).
- Wischgesten (Reiter wechseln, zurück); Datums-/Uhrzeitfelder im Admin-Bereich nicht mehr zu breit.

## 1.1.1 · 23.11.2026
- Lesbarkeit im Dunkel-Design (Spruch auf Start, „+ Neu“-Knopf); Leiste wird beim Scrollen schmaler (nur Symbole).

## 1.1.0 · 23.11.2026
- Hinweis bei neuen Versionen („Was ist neu“), Anleitung & Hilfe unter Mehr, Rundgang beim ersten Start.

## 1.0.4 · 23.11.2026
- Untere Leiste deckend, dockt beim Scrollen an.

## 1.0.3 · 23.11.2026
- Kontaktdaten aus der Excel per Admin-Knopf übernehmen (`excel-kontakte.json`, nur leere Felder).

## 1.0.2 · 23.11.2026
- Abend: Datum, Anwesende und Sitzordnung in voller Breite, Anwesende als gleichmäßiges Raster, Gäste doppelt breit.

## 1.0.1 · 23.11.2026
- Abend abschließen und wieder öffnen ohne Admin-Passwort.

## 1.0.0 · 23.11.2026
- Admin-Bereich mit Passwort (PBKDF2-Prüfwert, Auto-Sperre nach 30 Min.).
- Design-System: Stile Vereinsheim / Flutlicht / Anzeigetafel × Farbwelten Schwarz-Gelb / BVB / Rot-Weiß.
- Abschluss-Animation „Gut Holz!“ (Kugel räumt neun Kegel ab, Konfetti).

## 0.9.x · 22.–23.11.2026
- Offline-Erfassung: Warteschlange für Zusagen, Bestellungen, Spiele, Sitzordnung; Strichliste lokal; automatischer Abgleich.
- Service Worker für Offline-Start.
- Querformat/Tablet: Strafarten links, Spieler-Kacheln rechts, Tafel unten eingeklappt, Sitzordnung einklappbar.
- Kassenstand aus der Excel übernommen, Rangliste 2026 korrigiert.

## 0.1–0.8 · 20.–22.11.2026 (Aufbau)
- GitHub Pages + privates Daten-Repo, Einladungslink mit Token, Demo-Modus.
- Termine mit Zu-/Absagen, Anreise, Fahrgemeinschaften; Sondertermine mit Emoji; ICS-Export; Startseite.
- Digitale Strichliste mit Strafen, Live-Tafel, Gäste, Abwesende zahlen höchste Strafe, Samos-Rechnung + Trinkgeld.
- Essen nach Nummer mit Sonderwünschen und Favoriten.
- Kasse je Mitglied (Wochenbeitrag 5 €, Ausfall 15 €), Kassenstand mit Konten und Töpfen.
- Statistiken aus allen Excel-Jahren 2017–2026, Pokale, Ehrentafel.
- Kontaktdaten je Mitglied, Spiele-Katalog + eigene Spiele, Ergebnisse im Abend, Sitzordnung Tafelseite/Türseite.
- WhatsApp-Bericht nach dem Abend, Themes, Reset-Knopf, manuelle Spielstrafen, gebündeltes Speichern.
