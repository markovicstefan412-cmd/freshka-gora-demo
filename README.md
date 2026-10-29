# Freshka Gora, demo e-prodavnica

Uživo: https://markovicstefan412-cmd.github.io/freshka-gora-demo/

Statički sajt (HTML, CSS, JavaScript) napravljen po dizajnu „Freshka Gora redizajn“. Korpa, omiljeni, pretraga, filteri i porudžbina rade u pregledaču, bez baze. Porudžbine i poruke se nigde ne šalju (demo).

## Pokretanje

Potreban je samo Node.js (bez instalacije paketa).

```bash
npm start
```

Napravi sajt u `docs/` i otvori pregled na http://localhost:8080.

Samo ponovno pravljenje sajta, bez servera:

```bash
npm run build
```

## Šta gde stoji

| Putanja | Šta je |
| --- | --- |
| `src/data/products.json` | proizvodi, cene, kategorije i slajdovi na početnoj |
| `src/templates/` | šabloni stranica (početna, prodavnica, proizvod, kontakt, 404) |
| `src/assets/` | CSS, JavaScript, fontovi i slike |
| `build.mjs` | pravi gotov sajt u `docs/` |
| `docs/` | gotov sajt koji ide na GitHub Pages (ne menjati ručno) |

Promena cene ili opisa: izmeni `src/data/products.json`, pa `npm run build`. Nova slika proizvoda ide u `src/assets/img/p/<id>.webp`.

## Stranice

- `/` početna (slider, kategorije, prodavnica, priča na skrol, o nama, poklon paketi, pitanja)
- `/prodavnica/` svi proizvodi, filter preko adrese, npr. `/prodavnica/#sapuni`
- `/kupi/<naziv>-<broj>/` stranica svakog proizvoda (iste adrese kao na freshkagora.rs)
- `/kontakt/` kontakt forma
- `404.html` stranica za pogrešne adrese

## Objavljivanje na GitHub Pages

1. Napravi repozitorijum na GitHubu i pošalji ceo ovaj folder (uključujući `docs/`).
2. Na GitHubu: Settings, pa Pages, pa Source: *Deploy from a branch*, grana `main`, folder `/docs`.
3. Posle minut-dva sajt je na `https://<korisnik>.github.io/<repozitorijum>/`.

Posle svake izmene pokreni `npm run build` i pošalji promene, GitHub sam osveži sajt.

Dok je sajt demo, sakriven je od Google pretrage (`DEMO = true` u `src/templates/parts.mjs`). Kad ide na pravi domen, stavi `false` i ponovo pokreni build.
