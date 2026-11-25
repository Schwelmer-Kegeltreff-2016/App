# Schwelmer Kegeltreff – App · Projektbeschreibung für Claude

> Stand: Version **1.4.1** (25.11.2026). Diese Datei ist das Gedächtnis des Projekts.
> Bei jeder größeren Änderung hier mitpflegen. Sie enthält **keine** persönlichen Daten oder Zugangsdaten
> und darf deshalb im öffentlichen Repo `App` liegen.

## 1. Worum es geht
Vereins-Web-App des **Schwelmer Kegeltreff** (gegründet 2016, ca. 16 Mitglieder, Kegeln im Restaurant Samos,
Wuppertal-Langerfeld, etwa alle 5 Wochen samstags 18 Uhr). Ersetzt das Excel-Kassenbuch „Kegeln 20xx.xlsm“.

- **Auftraggeber/Entwickler-Ansprechpartner:** Maximilian Wittgenstein („Max“) – kein Programmierer.
  Er möchte Anleitungen **Schritt für Schritt, Klick für Klick, auf Deutsch**, Ergebnisse statt Technik-Details.
- **Kassenwart / Haupt-Admin:** Dominik Ortelt („Ortelt“).
- Kommunikation in der App und mit dem Nutzer: **Deutsch**, Du-Form, locker-vereinsmäßig.

## 2. Hosting & Repos (GitHub-Organisation `Schwelmer-Kegeltreff-2016`)
| Repo | Sichtbarkeit | Inhalt |
|---|---|---|
| `App` | öffentlich | Programmcode, läuft über GitHub Pages: https://schwelmer-kegeltreff-2016.github.io/App/ |
| `App-Daten` | **privat** | Alle Vereinsdaten im Ordner `data/` (JSON). Nie Inhalte daraus ins öffentliche Repo kopieren! |

- Die App liest/schreibt `App-Daten` über die **GitHub Contents API** mit einem **Fine-grained Token**
  (nur Contents read/write auf `App-Daten`). Repo-Name und Owner sind fest im Code, nur der Token kommt per
  **Einladungslink** `…/App/#k=<token>` (alt: `#s=`), gespeichert in `localStorage.kt_cfg`.
- **Der Token hat ein Ablaufdatum** (auf GitHub nachsehen). Läuft er ab, kann niemand mehr speichern →
  neuen Token erstellen, im Admin-Bereich „Zugang“ neuen Einladungslink erzeugen und verteilen.
- Ohne Token: Demo-Modus (Daten nur im Browser, `localStorage kt_demo:<pfad>`).

### Dateien im Repo `App`
| Datei | Zweck |
|---|---|
| `index.html` | **die komplette App** (HTML + CSS + JS in einer Datei, ~260 KB, ~1800 Zeilen) |
| `sw.js` | Service Worker (Offline-Start, Updates, iPhone-Kalender, Mitteilungen). Cache-Name `kegeltreff-app-vN`, Zähler fürs App-Symbol in Cache `kegeltreff-badge` |
| `manifest.webmanifest`, `logo.png`, `icon-192.png`, `icon-512.png` | App-Icon / „Zum Home-Bildschirm“ |
| `README.md` | Kurzbeschreibung für GitHub |
| `CLAUDE.md`, `CHANGELOG.md` | diese Beschreibung, Versionsliste |

### Daten in `App-Daten/data/`
| Datei | Inhalt |
|---|---|
| `verein.json` | Name, Ort, `rhythmusWochen` 5, `wochenbeitrag` 5, `pauschaleAusfall` 15, `teuerSchwelle` 20 (Admin einstellbar), `startSaldoStichtag`, `strafen[]`, `mitglieder[]` (id, spitzname, vorname, nachname, nr, eintritt, aktiv, rollen, startSaldo, figurVergessenGesamt, schnapsrundenBezahlt), `admin` {salt, iter, hash} |
| `termine.json` | `termine[]`: id (=Datum bei Kegelterminen), datum, uhrzeit, status (geplant/ausgefallen/abgeschlossen), art/emoji für Sondertermine, `zusagen{id:{status ja/vl/nein, anreise, plaetze, mitBei, abholen, holtAb, …}}`, nach Abschluss `abrechnung`, `stats`, `strafen`, `figur`, `gaeste`, `abwesend`, `spieleErg`; `inStartSaldo` = alter Abend aus Excel |
| `abende/<datum>.json` | laufende Strichliste eines Abends |
| `spiele/<datum>.json` | Sitzordnung (`sitz` Tafelseite/Türseite) + Spiele-Ergebnisse des Abends |
| `bestellungen/<datum>.json` | Essensbestellungen des Abends |
| `kasse.json` | `buchungen[]`, `konten`, `toepfe`, `ausgaben`, `gaesteStart`, `kontenStand`, `excelUebernommen` |
| `excel-stand.json` | Kassenstand aus Excel (Konten, Töpfe, Gäste-Start) zum Übernehmen |
| `historie.json` | alle Excel-Jahre 2017–2026: `abende`, `terminBetraege`, `jahreswerte`, `rekorde`, `saisons` (2020+2021 zusammen), `namen`, `mitglieder` |
| `speisekarte.json` | ~100 Samos-Gerichte mit Nummer (noch ohne Preise) |
| `bestellhistorie.json` | Favoriten je Person (Top 3 inkl. Sonderwunsch) |
| `kontakte.json` | Telefon, E-Mail, Adresse, Geburtstag je Mitglied |
| `excel-kontakte.json` | Kontaktdaten aus Excel, einmalig per Admin-Knopf übernehmen (füllt nur leere Felder) |
| `spielekatalog.json` | eigene Spiele |
| `nutzung.json` | wer die App wann/mit welchem Gerät/welcher Version geöffnet hat (Admin-Übersicht) |
| `bemerkungen.json` | Pinnwand-Einträge (kat app/allg/hinweis, `bis` max. 30 Tage, `votes{id:±1}`, `fotos[]` = Dateinamen auf Zweig `fotos`) |
| `inventar.json` | Vereinsgegenstände (Beamer, Soundbox, Starlink …) mit `lager`, `ort`, `leihe{wer,seit,bis,tage,notiz}`, `verlauf[]` |
| `minispiel.json` | Minispiel-Statistik je Person (w, holz, neun, kranz, pudel) |
| `push.json` | Mitteilungen: `geraete{k:{who,sub,ua,ts}}` (Push-Abo je Gerät), `prefs{who:{thema:bool}}`, `tests[]` |
| `push-log.json` | nur vom GitHub-Ablauf geschrieben: bereits verschickte Erinnerungen (`gesendet{schlüssel:datum}`, 60 Tage) |

Fehlende Dateien entstehen beim ersten Speichern von selbst (Standardinhalt in `defFor()`).

## 3. Architektur von `index.html`
Abschnitte sind mit Kommentar-Bannern markiert (`/* ---------------- KASSE ---------------- */` usw.), u. a.:
Speicher, Update-Hinweis, Offline-Warteschlange, Zustand, Admin-Bereich, Berechnungen, Rahmen, Wischgesten,
TERMINE, ABEND/STRICHLISTE, Abschluss-Animation, ESSEN, KASSE, TERMIN-FORMULAR, STARTSEITE, MINISPIEL,
Vereinsgegenstände, Pinnwand, KALENDER (ICS) & WHATSAPP-BERICHT, SPIELE, KASSENSTAND, STATISTIKEN,
ANLEITUNG & RUNDGANG, MEHR, Einrichtung, DARSTELLUNG.

- **Zustand** im globalen Objekt `S` (verein, termine, abend, me, tab, sub, …). Aktionen in `act.*` (onclick-Handler).
- **Rendern:** `shell()` (Kopf + Leiste), `render()` / `rerender()` (Hauptbereich), Ansichten `vStart`, `vTermine`,
  `vAbend`, `vEssen`, `vSpiele`, `vMehr` und Unterseiten (`subs`: anleitung, inventar, kasse, statistik, kassenstand,
  strafen, admin, profil). `afterHooks` laufen nach dem Rendern (Nachladen, Tafel).
- **Reiter (`TABS`):** start, termine, abend, essen, spiele, mehr.
- **Store:** `Store.get(path)` (Netz → Cache `kt_cache:` → Overlay der Warteschlange), `Store.put`, `Store.mutate(path, fn)`
  mit sha-Konfliktbehandlung (Retry bei 409/422). `save()` braucht Netz.
- **Offline-Warteschlange:** `enqueue(path, op, msg, delay)` → `OUT.list` (persistiert in `kt_outbox`; der früheste Sendetermin gewinnt) →
  `flushOutbox()` gruppiert je Datei und wendet die Operationen aus `OPS` per `mutate` an.
  `OPS`: zusage, zusageDel, bestAdd, bestDel, bhAdd, bhDel, spielAdd, spielDel, sitz, nachz, nutz, bemAdd, bemDel,
  bemVote, invAdd, invEdit, invDel, invLeihe, invZurueck, miniWurf. `lokal()/setLokal()` halten die lokale Kopie aktuell.
  Kopfzeile zeigt „📴 Offline · n wartet“, Antippen = jetzt senden; Wiederholung alle 30 s.
- **Strichliste offline:** lokal in `kt_abend_backup`, „schmutzig“-Flag `kt_abend_dirty`; nur ein Gerät führt die
  Tafel (`act.uebernehmen`). Abschließen braucht kurz Netz.
- **localStorage-Schlüssel:** kt_cfg, kt_me, kt_tab, kt_stil, kt_farbe (alt: kt_theme → wird migriert), kt_tafel_open,
  kt_fold_*, kt_abend_backup, kt_abend_dirty, kt_outbox, kt_cache:*, kt_admin_bis, kt_tour, kt_nutz, kt_mini, kt_mini_ts.

## 4. Fachliche Regeln (Kasse & Strafen)
- Strafen (`verein.strafen`): Pudel 0,10 € · Glöckchen 0,10 € · **Alle Neune 0,50 € und Kranz 1 € zahlen die anderen**
  (nur Anwesende, Gäste eingeschlossen) · Figur vergessen 1 € · Einsatz verpasst (Rauchen) 1 € · Teamspiel verloren 1 €.
- Spiele: Platzierung 0,10 € × (Platz − 1); verlorenes Teamspiel 1 €; manuelle Spielstrafen (je Spieler / pro Kopf / gesamt).
- Teamspiele immer **Tafelseite gegen Türseite** (Sitzordnung einmal pro Abend auslosen, Nachzügler kommen auf die kleinere Seite).
- **Abwesende Mitglieder zahlen die höchste Strafe des Abends** (der Anwesenden).
- **Wochenbeitrag 5 €** pro Woche; **15 € Pauschale** pro ausgefallenem Termin (Juli–Sep Samos geschlossen).
- Samos-Rechnung (ab 1.4, `rechnung.v=2`: gesamt, essen, trinkgeld, extras[{pid,betrag}], runden[{pid,betrag}], ohneEssen[]),
  berechnet in `topfRechnung()`:
  Topf 1 = (gesamt − essen) − Schnapsrunden + Trinkgeld → durch alle Anwesenden (Gäste inkl.);
  Topf 2 = essen − Zuschläge → durch alle, die gegessen haben. Teures Essen: Preis je Person, Zuschlag = Preis − 20 €
  (`verein.teuerSchwelle`, beim Abschließen in `rechnung.schw` eingefroren) zahlt die Person; Schnapsrunde zahlt der Spender. Alte Abende ohne `v:2` → altes Verfahren
  (Gesamt + Trinkgeld − teures Essen komplett, durch alle). Rundung je Person auf Cent (Summe kann um Cent abweichen).
  Teures Essen wird **je Person summiert**, dann Zuschlag = Summe − 20 €.
- **Kassenzettel-Foto** (`act.bonFoto` → `bonErkennen` → `bonLesen`): Bild auf ~1200–2200 px skalieren, `bonAufbereiten`
  (farbiger Hintergrund weiß, Otsu-Schwelle), tesseract.js 7.0.0 (`deu`, PSM 6) lazy von jsDelivr (`OCR`-Objekt, Pfade
  überschreibbar für Tests). Samos-Kasse: Speisen = Steuerklasse **B**, Getränke/Kegelbahn = **A**. Essen = Total − (NETTO 19 % +
  MWST 19 %), wenn MwSt zum Netto passt; sonst Summe der A-Positionen bzw. B-Positionen. Getestet mit echtem Zettel
  (Total 540,30 / Essen 167,30) inkl. schief/klein/dunkel. Foto wird nie hochgeladen.
- Kontostand: `startSaldo` (Excel-Stichtag 08.11.2026, positiv = offen) + Wochenbeiträge + Abende + Buchungen.
  Anzeige: grün = Guthaben, rot = zu überweisen.
- Statistik: Pokale nach Schnitt pro Abend (mind. 2 Abende, wenn N ≥ 4); „Pudelkönig“ = **wenigste** Pudel;
  Platz 1–3 Kasse = niedrigste Strafen, nur Ganzjahresmitglieder. Saison 2020+2021 zusammengefasst.

## 5. Rollen & Admin-Bereich
- Admin ist, wer auf dem Gerät das **Admin-Passwort** eingegeben hat (nicht über die Person). In `verein.admin`
  liegt nur ein PBKDF2-SHA256-Prüfwert (150 000 Iterationen). Auto-Sperre nach **30 Min.** ohne Tippen (`kt_admin_bis`).
- Erst-Einrichtung des Passworts nur für Mitglieder mit Rolle `admin` (Max, Ortelt). Vergessen → in `verein.json`
  den Abschnitt `admin` löschen und neu festlegen.
- **Nur mit Passwort** (Liste im Sicherheitsnetz vor `boot()`): Abend zurücksetzen, Buchungen, Ausgaben, Kassenstand,
  Mitglieder, Kegeltermine/Serien/Ausfall, Speisekarte, Einladungslink, Kontakte-Import, Gegenstand löschen, Grenze teures Essen,
  Sitzordnung zurücksetzen, Zusagen für andere.
- **Für alle:** Zusagen, Fahrer setzt andere in sein Auto / lässt sie aussteigen (`act.einsteigen`, `act.rauslassen`), Essen, Strichliste führen, **Abend abschließen und wieder öffnen**, Sondertermine, eigene
  Spiele, Pinnwand, Verleih, Profil. Gesperrte Knöpfe bleiben sichtbar (🔒) und fragen nach dem Passwort.

## 6. Design
- Zwei Einstellungen pro Gerät: **Stil** (`kt_stil`: auto, vereinsheim = hell, flutlicht = dunkel, anzeigetafel = plakativ)
  × **Farbwelt** (`kt_farbe`: sg = Vereinsfarben Schwarz-Gelb, bvb = Schwarz-Gelb mit BVB-Sprüchen, rw = Rot-Weiß mit Bayern-Sprüchen).
  Umsetzung über `data-stil` / `data-farbe` am `<html>` und CSS-Variablen (`--gelb` = Akzent, `--on-accent`, `--dark`,
  `--ink`, `--card`, `--bg`, …). 🌙/☀️ oben schaltet Vereinsheim ↔ Flutlicht.
- Schriften je Stil von Google Fonts (Plus Jakarta Sans / Space Grotesk / Barlow + Barlow Condensed), vom SW gecacht.
- **Keine offiziellen Vereinslogos** (BVB/FCB) – nur Farben und Sprüche; eigenes Wappen `logo.png`.
- Mobile first. Untere Leiste immer volle Breite, beim Scrollen nur per `transform` niedriger (keine Höhenänderung –
  sonst springt sie auf dem iPhone). Fenster (`#sheet`) sitzen über Leiste und Tastatur (`--vvb` aus `visualViewport`),
  dahinter ist die Seite gesperrt (`html.modal` + `body` position:fixed mit `top:-scrollY`, `modalSperre()`).
  `closeSheet()` nimmt vorher den Fokus weg (Tastatur zu), `focusout` rückt die iPhone-Ansicht zurück – sonst
  „hängt“ die App nach dem Schließen eines Fensters mit Eingabefeld.
- Strichliste: links Strafarten (`.katnav`), rechts Spieler-Kacheln (`.tap`), Tafel unten eingeklappt; Querformat
  auf Handy/Tablet ist der Haupt-Einsatzfall am Abend.
- Wischgesten: links/rechts = Reiter wechseln, auf Unterseiten rechts = zurück.
- **Kontrast prüfen**: In allen 6 Kombinationen (3 Stile × sg/rw) darf keine Schrift < 3:1 haben (Testskript `kontrast`).

## 7. Updates & Service Worker (wichtig!)
- Jede Lieferung: `APP_VERSION` hochzählen und `APP_NEU` (eine Zeile „Was ist neu“) setzen. Die App prüft
  `index.html?vcheck=…` beim Start, beim Zurückholen (max. alle 2 Min.), alle 10 Min. und per Knopf
  „🔄 Auf Updates prüfen“ (Startseite unten, Mehr). Neuere Version → gelber Hinweis „Jetzt aktualisieren“:
  lädt offene Eingaben hoch, meldet den SW ab (**nicht**, wenn ein Push-Abo besteht – dann nur `update()`), leert den Cache, lädt mit `?u=<version>` neu.
- `sw.js` (aktuell v5): Seiten **network-first am HTTP-Cache vorbei** (`new Request(url,{cache:'no-store'})` – NIE
  `fetch(navigateRequest, init)`, das wirft auf Navigationsanfragen und lieferte früher immer die alte Version!),
  5 s Timeout → gespeicherte Version, frische im Hintergrund nachladen. `?vcheck` nur Netz. `kalender.ics?d=<base64url>`
  erzeugt eine echte .ics-Datei (iPhone-Kalender). `sw.js` nur ändern, wenn nötig, dann Cache-Namen hochzählen.
- iPhone: data:-Links und Blob-Downloads funktionieren in der Home-Bildschirm-App nicht → Kalender über SW-Adresse;
  Android: Google-Kalender-Vorlage-Link.

## 8. Weitere Funktionen (Überblick)
Start (nächster Abend, Konto, Pinnwand mit 👍/👎, Leih-Erinnerung, Minispiel-Karte, Geburtstage/Titelträger),
Termine (Zusagen, Anreise/Fahrgemeinschaft, Sondertermine mit Emoji, ICS), Abend (Strichliste, Sitzordnung,
Spiele heute, Tafel, Samos-Rechnung, Abschluss mit „Gut Holz!“-Animation, WhatsApp-Bericht), Essen (Nummer +
Sonderwunsch, Favoriten, Sammelliste), Spiele (Katalog + eigene), Kasse, Kassenstand, Statistiken (alle Excel-Jahre),
Anleitung & Rundgang (Bilder aus echten UI-Bausteinen, keine Screenshots mit echten Daten), Vereinsgegenstände &
Verleih, Minispiel „Ein Wurf“ (Pudel 15 %, Alle Neune 10 %, Kranz 6 %, sonst 1–8 Holz; beim Start max. alle 3 Std.,
abschaltbar im Profil, nicht im Reiter Abend), Admin (Übersicht „Wer nutzt die App?“, Kontakte-Import).

## 9. Arbeitsweise & Lieferung
1. Änderung in `index.html` (und nur bei Bedarf `sw.js`), `APP_VERSION` + `APP_NEU` anpassen, ggf. Anleitung (`ANL`) ergänzen.
2. Syntax prüfen: Skript-Teil aus `index.html` extrahieren und `node --check`.
3. Tests (siehe `App-Daten/dev/README.md`): Offline-Sync, Admin, Update mit echtem Service Worker, Kontrast,
   betroffene Funktion. Neue `act.*`-Funktionen **nach** `const act={}` definieren (sonst Absturz beim Start).
4. Lieferung an Max: Datei(en) + kurze deutsche Anleitung, wohin hochladen (Repo **App** = Code, **App-Daten/data** = Daten).
   Mit Claude Code: Pull Request statt direkt auf `main` (main = sofort live).

## 10. Start in einem neuen Chat (bis Claude Code verfügbar ist)
1. Aktuellen Code holen: `git clone https://github.com/Schwelmer-Kegeltreff-2016/App` (öffentlich).
   Version steht in `index.html` unter `const APP_VERSION`.
2. Vereinsdaten nur bei Bedarf (für Tests/Statistik): Max lädt `App-Daten` als ZIP hoch (GitHub → Code → Download ZIP).
   Tests dann aus `App-Daten/dev/` (siehe dortige README).
3. Arbeiten, testen, Dateien mit kurzer Upload-Anleitung liefern; `CLAUDE.md`/`CHANGELOG.md` mitpflegen.

## 11. Offene Punkte / Ideen
- Samos-Speisekarte mit aktuellen Preisen (Fotos von Max stehen aus).
- Vollständige 2025-Excel (Pudel Aug–Dez fehlen im Detail).
- Laptop/Tablet-Ansicht: Seitenmenü und mehrspaltige Seiten (bisher eine Spalte in der Mitte).
- Token-Ablaufdatum im Blick behalten; monatliche ZIP-Sicherung von `App-Daten` empfohlen.

## 12. Fahrgemeinschaften
- Zusage-Felder: `anreise` selbst/mitfahrt/…, Fahrer `plaetze` + `holtAb`, Mitfahrer `mitBei` + `abholen`. Op `zusage` setzt
  `mitBei/abholen` zurück, wenn Anreise ≠ mitfahrt, und `holtAb`, wenn ≠ selbst; fällt ein Fahrer weg, werden seine Mitfahrer wieder „suchend“.
- Fahrer darf die Zusage anderer ändern (nur ins eigene Auto setzen / herausnehmen), mit Platz-Prüfung.
- Adresse (aus `kontakte.json`) sieht ein Fahrer nur, wenn der Mitfahrer `abholen` gewählt hat und in seinem Auto sitzt.

## 13. Mitteilungen (Push)
- App: Abschnitt `MITTEILUNGEN` in `index.html`. `MITT` = Themen mit Voreinstellung (abstimmen, fahrt, pinnwand, termine,
  verleih an; kegeltag, abrechnung aus). Profil-Karte `mitteilungenKarte()`, `act.pushAn/pushAus/pushPref/pushTest`,
  `pushPruefen()` (beim Start, ordnet das Gerät der aktuellen Person zu, meldet verlorene Abos still neu an).
  Antippen → `?go=<reiter|unterseite>` → `gehe()`; läuft die App schon, schickt der SW `postMessage({go})`.
- **VAPID:** öffentlicher Schlüssel steht in `index.html` (`VAPID_PUB`) und in `senden.cjs`:
  `BN00qq-k0jGVypudHpvPojBEfANo8w4sv3A1TmKfSo5lhS4ZfC7Qeer9Epz7YFW0JnpN7_-AMjXImMMGZKNiEH8`
  Der private Schlüssel liegt **nur** als GitHub-Secret `VAPID_PRIVATE` in App-Daten (nie in ein Repo/Dokument!).
  Neues Schlüsselpaar ⇒ alle müssen Mitteilungen neu erlauben.
- **Versand** (Repo App-Daten): `mitteilungen/senden.cjs` + `.github/workflows/mitteilungen.yml`.
  Auslöser: Push auf `data/termine.json|bemerkungen.json|push.json` (vergleicht `github.event.before` mit neu) und
  zeitgesteuert `17 6,16 * * *` UTC (Erinnerungen: abstimmen 1–3 Tage vorher einmalig, Kegeltag morgens, Verleih
  morgen/heute/überfällig alle 3 Tage). Akteur = Spitzname vor „:“ in der Commit-Nachricht bzw. `von` im Eintrag →
  bekommt keine eigene Mitteilung. 404/410 vom Push-Dienst ⇒ Gerät aus `push.json` entfernt.
- Testen: `DRY_RUN=1 DATA_DIR=… BEFORE_DIR=… EVENT=push|schedule HEUTE=JJJJ-MM-TT STUNDE=8 node mitteilungen/senden.cjs`.
- iPhone: nur als Home-Bildschirm-App (iOS ≥ 16.4); Erlaubnis nur nach Tippen. Android: Badge meist nur Punkt.

## 14. Pinnwand-Fotos
- Max. 2 pro Eintrag (`FOTO_MAX`), Canvas auf 720 px, JPEG q 0,6 (bis ~110 KB Base64 runter auf q 0,3) → ca. 30–60 KB.
- Ablage: App-Daten, **Zweig `fotos`**, Pfad `fotos/<eintrag-id>-<n>.jpg` (Contents API mit `branch`/`ref`). Der Zweig wird
  beim ersten Foto aus `main` angelegt (`fotoZweig()`); `fotos.cjs` im Ablauf ersetzt ihn 2× täglich durch einen Commit
  ohne Vorgänger mit nur den Fotos sichtbarer Einträge (+ Fotos jünger als 3 Std.), `--force-with-lease`.
- Anzeige: `img[data-foto]` → `fotosNachladen()` (afterHook) → `fotoHol()` (Speicher → Cache `kegeltreff-fotos` → API).
  Löschen des Eintrags → `fotoWeg()`. Upload nur online, vor dem Eintrag; Eintrag selbst über die Warteschlange.
- Flutlicht: `.chip.on` gelb (Regel steht vor `.hero .chip.on`, damit der Kopfbereich seine Farbe behält).
