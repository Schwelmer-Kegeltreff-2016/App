# Änderungsliste – Schwelmer Kegeltreff App

## 1.4.2 · 25.11.2026
- **Speisekarte neu** (`App-Daten/data/speisekarte.json`, von den Fotos der Samos-Karte): 140 Gerichte mit Nr. und Preis,
  61 Getränke (ohne Nr., `getraenk:true`, nur zum Nachschauen).
- **⭐ Eigene Favoriten:** rechts neben jedem Gericht ein Stern. Jeder markiert seine Gerichte selbst; sie stehen oben
  unter „⚡ Schnell hinzufügen“ (vor den bisherigen Top-3 aus der Bestellhistorie) und in der Gruppe „⭐ Meine Favoriten“.
  Gespeichert in `bestellhistorie.json` → `sterne{person:[nr|'n:'+name]}` (Op `stern`, offline-fähig).
- Reiter Essen → Speisekarte: Kategorien beim Öffnen **eingeklappt** (Anzahl + Preisspanne im Kopf), „⭐ Meine Favoriten“
  oben, Getränke darunter. Suche zeigt alle Treffer aufgeklappt. Bestellungen bekommen jetzt automatisch den Preis
  → „Aus Bestellung übernehmen“ in der Abrechnung erkennt teures Essen.
- Admin „Speisekarte pflegen“: 6. Spalte Merkmal (`getraenk`) bleibt beim Export/Import erhalten.

## 1.4.1 · 25.11.2026
- **📷 Fotos auf der Pinnwand:** bis zu 2 Fotos pro Eintrag, auf dem Handy auf max. 720 px / ca. 50 KB verkleinert.
  Gespeichert in App-Daten auf dem Zweig `fotos` (Ordner `fotos/`), nicht im normalen Datenverlauf. Der GitHub-Ablauf
  baut den Zweig 2× täglich ohne Verlauf neu auf und behält nur Fotos sichtbarer Einträge (`mitteilungen/fotos.cjs`).
  Löschen eines Eintrags löscht die Fotos sofort mit. Antippen zeigt das Foto groß. Nur mit Internet.
- Pinnwand-Fenster: Auswahl (Art, Dauer) schaltet direkt um, ohne dass das Fenster neu aufgebaut wird; darunter steht
  „Verschwindet am … um … Uhr“. Nach dem Anpinnen: „sichtbar bis …“.
- **Dunkles Design (Flutlicht):** ausgewählte Auswahl-Knöpfe waren kaum zu erkennen (Kontrast 1,1:1) → jetzt gelb.

## 1.4.0 · 25.11.2026
- **🔔 Mitteilungen (Push)** auf iPhone (ab iOS 16.4, als Home-Bildschirm-App) und Android: Mehr → Profil → „Mitteilungen
  erlauben“, je Person abschaltbar: Noch nicht abgestimmt (3 Tage vorher), Fahrgemeinschaft, Pinnwand, Termine,
  Kegeltag (aus), Verleih, Abend abgerechnet (aus). Zahl am App-Symbol, Antippen öffnet die passende Stelle,
  Test-Mitteilung. Abo je Gerät in `push.json`; Versand per GitHub-Ablauf in App-Daten (`mitteilungen/senden.cjs`,
  `.github/workflows/mitteilungen.yml`, Secret `VAPID_PRIVATE`). `sw.js` v5 (push, notificationclick, Badge).
  „Aktualisieren“ meldet den Service Worker nicht mehr ab, wenn ein Abo besteht (sonst wäre es weg).
- Samos-Rechnung nach den Regeln des Kassenwarts, in zwei Töpfen:
  - **Topf 1 Getränke & Co.** (Gesamt − Essen + Trinkgeld − Schnapsrunden) → durch alle Anwesenden.
  - **Topf 2 Essen** (Essen − Zuschläge) → nur durch die, die gegessen haben („Wer hat mitgegessen?“ zum Antippen).
  - **Teures Essen:** Preis eintragen (mehrere Zeilen je Person werden addiert), die Person zahlt nur den Teil über 20 € extra (25 € → 5 €).
  - **Schnapsrunden** (z. B. Geburtstag) zahlt allein, wer sie ausgibt.
  - „Aus Bestellung übernehmen“ setzt Esser/Nicht-Esser und teures Essen (Summe je Person) aus der Essensbestellung.
- **📷 Kassenzettel fotografieren:** Texterkennung direkt auf dem Handy (tesseract.js, beim ersten Mal ca. 10 MB von
  jsDelivr, danach gespeichert). Liest „Total“, trennt Essen (Steuer B, 7 %) von Getränken/Kegelbahn (A, 19 %) – abgesichert
  über die Zeilen NETTO/MWST 19 % – und listet Gerichte über 20 € zum Zuordnen. Das Foto wird nicht hochgeladen.
- **Grenze „teures Essen“ einstellbar** (Admin: Mehr → Strafenkatalog & Grenzen, `verein.teuerSchwelle`, Standard 20 €).
  Beim Abschließen wird die Grenze im Abend gespeichert (`rechnung.schw`), spätere Änderungen gelten nur für offene Abende.
- **Fahrgemeinschaften:** Fahrer setzen Leute selbst ins Auto („🚗 Nehme ich mit“ bei Suchenden, „+ Mitfahrer einsteigen
  lassen“ mit Auswahl: zuerst Suchende – wer abgeholt werden will, ganz oben –, dann Zugesagte ohne Mitfahrt, dann Offene)
  und können Mitfahrer wieder aussteigen lassen. Mitfahrer: „🏠 Bitte zu Hause abholen“ (Fahrer sieht dann die Adresse aus
  dem Profil mit Karten-Link), Fahrer: „🏠 Ich hole auch zu Hause ab“.
  - WhatsApp-Bericht, Strafenkatalog und Anleitung angepasst. Abende vor 1.4 werden unverändert nach altem Verfahren gerechnet.

## 1.3.2 · 25.11.2026
- iPhone: Fenster (z. B. „Gegenstand hinzufügen“) hängen nicht mehr fest. Ursache: Schloss das Fenster bei offener
  Tastatur, blieb die Ansicht verschoben und Tipps landeten daneben. Jetzt wird die Seite hinter dem Fenster fest
  gesperrt (body fixed), die Tastatur vor dem Schließen eingeklappt und die Ansicht danach zurückgerückt.
- Formular „Gegenstand“: Beschriftungen „Symbol“ und „Name“ auf einer Höhe.

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
