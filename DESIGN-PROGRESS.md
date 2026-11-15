# Progression — portfolio

## Favicon portrait

- Sofia : portrait rapproché, cadre violet, fond nuit, sans texte pour la lisibilité en onglet.
- Production : skill imagegen, outil intégré, photo locale comme cible. Prompt : préserver l'identité, recadrer visage/casquette, fond #080518, bordure #a970ef, icône carrée sans lettres. Image source générée conservée, copie dans assets/profile/favicon-elijah-master.png.
- Ibrahima : exports PNG 32, 180 et 192 px par tools/export-favicon.ps1 ; ancien favicon SVG remplacé dans index.html ; icône Apple ajoutée.
- Cherif : fichiers exportés présents, aperçu 192 px inspecté, git diff --check réussi. Aucun déploiement.

## Adaptation Abhishekworks — 15 novembre 2026

- Sofia : référence visitée dans le navigateur via portfolios.anav.dev puis www.abhishekworks.com. Observations : introduction étoilée, navigation vitrée, fond nuit/violet, nom manuscrit, métier tapé/effacé, mosaïque inclinée et animée, présentations de projets sur fond sombre. La direction ivoire/cuivre est remplacée.
- Ibrahima : reference-design.css et reference-motion.js créés ; CSS professional.css retiré du chargement (fichier conservé). Données, captures, CV et contacts d'Elijah conservés. Aucun témoignage, employeur, chiffre d'activité ou avatar d'Abhishek repris. Mouvements recréés en CSS/JavaScript local : pas de code source du site copié. Architecture monopage conservée plutôt que les routes séparées de la référence.
- Accessibilité : pause explicite de la mosaïque/étoiles/texte animé ; prefers-reduced-motion ; texte métier accessible sans lecture lettre par lettre ; introduction courte et bouton pour passer.
- Cherif / preuves : aperçu HTTP sur 127.0.0.1:8765 accessible. Accueil observé desktop et 390×844, pas de débordement horizontal mesuré. Menu mobile FR/EN testé ; titres traduits. Cockpit ouvert et réponse Momentum vérifiée. Galerie Sama CV puis VoteNow vérifiée en interface. Pause des trois colonnes confirmée via styles calculés.
- Bugs corrigés pendant la recette : second accès à .proj-preview absent sur Momentum ; ancien style masquant le libellé du lanceur ; cache des scripts corrigés ; ancrage de défilement du hero. Nouveau chargement versionné et absence d'erreurs console pour les ressources versionnées lors du contrôle bilingue.
- Tests : 13 tests du moteur réussis, syntaxe des scripts contrôlée, git diff --check réussi. Capture : C:/Users/eljah/.codex/visualizations/2026/11/15/01a1e066-929f-7e01-8eea-c732953a6b11/portfolio-reference.jpg.
- Limites : adaptation des effets observés, pas une duplication pixel pour pixel de toutes les pages et scènes 3D. Test mobile par viewport, pas sur téléphone physique. Police distante Google Fonts avec repli local. Aucun déploiement. Serveur local uniquement.

## Direction professionnelle — 15 novembre 2026

- Objectif / Sofia : portfolio destiné aux recruteurs et clients au Sénégal et à distance. Pas de classement national revendiqué. Direction retenue : éditorial ivoire/encre/cuivre, portrait, projets en premier, contact direct. Alternative plus animée écartée pour préserver la lisibilité.
- Compétence appliquée : design-uiux-frontend. Artist UX Analyzer, Artist Testeur et Cléa inspectés ; leurs campagnes complètes (issues GitHub / SaaS / playbooks) ne sont pas activées pour cette intégration ciblée.
- Architecture / Ibrahima : site statique conservé, professional.css pour les tokens et dispositions, professional.js pour l'ordre des contenus et les traductions via l'événement existant. Aucun service, dépendance ou secret ajouté.
- Réalisé : identité Dakar, accroche orientée produits, Sama CV mis en avant, portrait au repos avec commandes conservées, liste technique fixe, sections IA/Momentum bilingues, liens CV harmonisés vers le document Full Stack existant.
- Correction de code : la fiche Momentum n'a pas de capture ; project-explorer.js ignore son bouton absent et l'exclut des images de galerie. La recherche rapide peut conduire à sa fiche sans demander une image inexistante.
- Preuves / Cherif : 13 tests de conversation réussis, vérifications syntaxiques professional.js et project-explorer.js réussies, git diff --check réussi, aucune ressource locale manquante détectée dans index.html. Contrastes calculés texte/fond : 14,29:1 ; secondaire : 6,49:1 ; cuivre : 5,96:1 ; cuivre/surface : 5,42:1 ; accent sombre : 9,24:1.
- Limite : observation de l'onglet file:// refusée par la politique du navigateur. Aucun contournement. Le rendu desktop/mobile, le clavier et les parcours de galerie restent à vérifier visuellement sur une prévisualisation autorisée. La consultation Coolors a retourné HTTP 403 ; palette choisie localement et contrastes calculés.
- Agent Live : absence signalée précédemment, journal local maintenu. Aucun déploiement ni publication. Prochaine étape : recette visuelle sur URL de prévisualisation autorisée.

## Révision du cockpit après retour utilisateur

- Sofia : reprise de l'apparence, de la disposition et des accès aux réponses ; panneau à droite, une colonne, trois entrées ciblées.
- Ibrahima : styles dans cockpit.css, raccourcis profil/Momentum/IA, agrandissement et remise à zéro accessibles, sujet IA reconnu par le moteur. Correction des alias VoteNow auparavant dépendants de l'ordre des projets.
- Cherif : syntaxe JavaScript valide, 13 tests réussis, git diff --check réussi. Pas de vérification visuelle dans le navigateur effectuée ; prochaine étape : examiner le rendu mobile et desktop avec l'utilisateur.
- Aucun déploiement. Rôles tenus dans la session, sans agents séparés.

- Sofia : cadrage validé par la demande utilisateur — IA, automatisation, Docker, Momentum en développement, cockpit compact. Phrase éditoriale intégrée sans statistiques inventées.
- Ibrahima (profil de travail tenu dans cette session) : section IA, fiche Momentum et styles du cockpit ajoutés. Modifications préexistantes de index.html conservées.
- Preuves : index.html, studio.css. L'assistant reste un guide local ; aucune connexion à un modèle n'est revendiquée. Momentum ne présente pas de fausse capture ou de démonstration publique.
- Blocage : lanceur Agent Live absent au chemin fourni. Suivi local utilisé.
- Cherif : vérification syntaxique et tests du moteur de conversation ; validation visuelle et traductions des nouveaux textes restant à compléter.
