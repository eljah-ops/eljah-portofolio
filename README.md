# Portfolio — Elijah Ismael Diallo

Portfolio statique bilingue (français / anglais), en HTML, CSS et JavaScript, sans dépendance de compilation.

## Aperçu local

```sh
python3 -m http.server 8000
```

Ouvrir http://localhost:8000.

## Organisation

- `index.html` : contenu, traductions et interactions de navigation.
- `portfolio.js` : carrousel, filtres des projets et copie de l’e-mail.
- `life-cards.js` : pile de cartes illustrées « La vie hors du terminal », navigation tactile, souris et clavier.
- `build.py` : préparation des fichiers publics dans `dist/` pour l’hébergement.
- `styles.css` : styles, thèmes clair / sombre et adaptations mobiles.
- `assets/projects/` : captures originales des projets présentés.
- `cv.pdf/` et `attestation/` : documents téléchargeables.

Le contact reprend la disposition de la référence : titre « On discute ? », indicateur à trois points animés, e-mail avec bouton Copier et carte « En bref » avec les informations personnelles, le téléphone et les liens LinkedIn / GitHub / Credly. Le lien e-mail ouvre la messagerie. Les anciens fichiers `contact-handler.js` et `contact-styles.css` sont conservés dans les sources mais ne sont plus chargés ni inclus dans la version générée.

## Présentation et interactions

Refonte inspirée de https://www.serahabijo.com/ : fond ivoire, accents bordeaux, titres Playfair Display, navigation horizontale fixe et carrousel vertical avec miniatures. Le carrousel s’ouvre sur la photo personnelle d’Elijah, puis présente les captures des projets. La même photo apparaît dans la section À propos, dans un cadre carré arrondi avec un badge de salut animé. La photo originale est conservée dans `assets/profile/elijah-diallo.jpeg` ; le cadrage est réalisé en CSS.

Le carrousel avance toutes les huit secondes, avec pause, boutons précédent/suivant, miniatures, flèches du clavier et balayage tactile. Il s’arrête pendant le survol, le focus clavier ou lorsque l’onglet est masqué. La réduction des animations désactive la lecture automatique. Une sélection manuelle met la lecture en pause.

Les projets se filtrent par développement web ou UI/UX. Les captures s’ouvrent dans un aperçu agrandi, refermable avec le bouton « Fermer » ou Échap. Les liens vers les sites, le CV et les certificats sont conservés. L’e-mail peut être copié, avec sélection manuelle si le presse-papiers est indisponible.

Le thème clair/sombre et la langue français/anglais sont mémorisés localement. Les témoignages et questions restent accessibles dans un volet dépliable.

La dernière section, « La vie hors du terminal », reprend la présentation en cartes illustrées empilées de la référence : titre façon terminal, photos en plein cadre, légendes sur dégradé, points de navigation et compteur. Elle présente les animés (Naruto), le football, le basket et le gaming. Glisser une carte, cliquer sur ses bords ou utiliser les flèches du clavier permet de changer de passion ; Début et Fin vont à la première et à la dernière carte. La réduction des animations désactive la frappe du titre et les transitions. Sans JavaScript, les quatre cartes restent lisibles à la suite. Les crédits des images sont dans `assets/interests/SOURCES.md`.

## Animations et SEO

`interactions.js` ajoute des apparitions au défilement et un survol lumineux avec une légère inclinaison sur les appareils équipés d’une souris. Les effets respectent la réduction des animations ; le contenu reste visible sans JavaScript.

Le HTML inclut une description, des métadonnées Open Graph / Twitter et des données structurées `ProfilePage` / `Person`. `robots.txt` autorise l’exploration. À la mise en ligne, ajouter l’URL publique aux balises canonique et `og:url`, puis créer un sitemap avec cette URL et le déclarer dans `robots.txt`. Aucun domaine fictif n’est utilisé.

L’ancienne animation d’entrée `entrance.js` est conservée dans les sources mais n’est plus chargée, afin d’afficher immédiatement la page.

## Système visuel

La typographie utilise Inter et Playfair Display. Les thèmes partagent les mêmes composants et variables CSS. Voir `DESIGN.md`.

## Préparer la version hébergée

```sh
python3 build.py
```

Le dossier `dist/` contient seulement les fichiers publics et documents du portfolio. `.openai/hosting.json` identifie l’aperçu Sites privé.
