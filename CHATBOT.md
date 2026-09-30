# Guide du portfolio — Forge

Lancer `python3 -m http.server 4173 --bind 127.0.0.1`, puis ouvrir http://localhost:4173/?assistant=1.

Le guide fonctionne entièrement dans le navigateur, sans API, clé, modèle génératif ni stockage de conversation. La fermeture conserve la conversation en mémoire ; « Nouvelle conversation » ou le rechargement l’efface. Les réponses prédéfinies s’appuient sur les contenus publics du portfolio. Il ne prétend pas répondre à toute question ni déduire une compétence à partir d’un simple nom de technologie.

## Contenus et comportement

`index.html` reste la source des descriptions, projets, technologies, rôles, statuts, coordonnées, FAQ, formations et niveaux de langue. Le guide extrait ces contenus à la demande. Les changements de langue via `portfolio-language` actualisent l’interface et les réponses de la conversation ; les questions libres du visiteur restent inchangées. Les titres officiels de certifications sont conservés tels que publiés.

`chatbot.js` contient le moteur de sujets et l’interface. La fonction pure `route` est exportée pour les tests Node. Un nouveau sujet explicite prime sur le précédent. Les relances reconnues restent dans le contexte ; une question inconnue propose le contact direct. Les technologies des projets sont vérifiées uniquement à partir des étiquettes publiées. Une technologie absente est annoncée comme non confirmée, jamais comme une incapacité.

Les liens de source ouvrent les sections repliées, notamment les FAQ et certifications. Les liens de fiches projets déclenchent `portfolio-show-project` avec `{id}` pour réinitialiser les filtres éventuels. Les liens de démonstration et de CV proviennent du DOM. Tous les sujets et projets sont accessibles dans le panneau « Sujets » sur mobile et dans la colonne latérale sur ordinateur.

## Vérification

- `node --check chatbot.js`
- `node --test tests/chatbot.test.js`
- `python3 build.py` : copie le fichier autonome et sa feuille de style dans `dist`.

La couverture du moteur porte sur CV/mots courts, accents/pluriels, priorités des projets, nouveaux sujets, relances, technologies, questions inconnues et formulations FR/EN. Compléter par une vérification navigateur : mobile, clavier, sources repliées, changement de langue, copie et ouverture du CV.

## Évolution vers une IA

Pour une conversation libre, ajouter un endpoint serveur avec clé privée, corpus public sourcé, limites de consommation et réponse locale de secours. Le petit volume de contenu ne nécessite pas de base vectorielle. Préserver les inconnues explicites, les références et les liens existants. L’état actuel ne réalise aucun appel externe pour traiter les messages.
