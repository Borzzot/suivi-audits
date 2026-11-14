# Journal d'usage de l'IA

**Outil utilisé : Claude (chat), pour toutes les étapes ci-dessous.**

| Étape | Ce que j'ai demandé | Ce que ça m'a apporté (ou non) | Ce que j'ai vérifié |
|---|---|---|---|
| 1. Clarification du besoin | 10 questions de cadrage | Une grille de questions, dont j'ai gardé les 2 qui me semblaient les plus importantes | J'ai transformé les réponses en hypothèses écrites dans le README |
| 2. Squelette HTML | Le HTML seul, avec explication de chaque balise | Une structure complète, que j'ai relue | Le rendu dans le navigateur, les labels, l'attribut `required` |
| 3. Données de test | 30 audits sur 10 sites avec cas limites | Un jeu de données couvrant retards, date du jour, `null` et un site sans audit à venir | Le comptage, la cohérence des dates et des statuts |
| 4. Règle de retard | Une fonction `estEnRetard` selon mon hypothèse écrite | La fonction, la gestion de la date du jour sans piège de fuseau, un badge distinct pour les audits sans date | 7 tests en console, nombre de lignes en retard recompté à l'écran, cas « aujourd'hui » testé. **Décisions perso :** la règle du retard et le choix d'inclure les audits sans date |
| 5. Filtres | Filtres site + statut combinés, options générées depuis les données | La logique `filter` et `Set`, le message « aucun résultat » | 7 combinaisons testées avec résultats attendus. **Choix perso :** case « Retards seulement » plutôt qu'une option de statut |
| 6. Formulaire d'ajout | Validation, nouvel id, ajout, rafraîchissement, explication de `preventDefault` | Le code et une règle d'id plus robuste que `length + 1` | 9 cas testés, test sans `preventDefault`. **Décisions perso :** j'ai demandé la règle « date obligatoire sauf pour un audit à planifier », puis j'ai ajouté moi-même « pas de date possible pour un audit à planifier ». L'IA a corrigé deux erreurs dans mon code (faute dans la valeur du statut, condition inversée) |
| 7. Modification d'un audit | Bouton « Modifier » qui préremplit le formulaire, sans doublon, avec explication de la recherche par id | La variable de mode `idEnModification`, `find`, la closure dans la boucle | 30 lignes conservées après modification, annulation, validation toujours active en mode modification. **Décisions perso :** tout est modifiable, confirmation obligatoire par bouton |
| 8. Persistance | `localStorage` avec chargement de `data.js` au premier lancement | Le schéma charger-sauvegarder, `JSON.stringify/parse`, le `try...catch`, le renommage de `audits` en `auditsInitiaux` | Survie au F5 et à la fermeture de l'onglet, contenu observé dans l'onglet Stockage, cas de sauvegarde corrompue. **Limites notées :** données propres à un navigateur, non sécurisées |
| 9. Mise en forme | CSS simple, statuts colorés, retards visibles, mobile | Variables CSS, media query, tableau en cartes via `data-label`, pastilles de statut | Rendu en mode responsive, retards repérables sans lire, absence de défilement horizontal.  | |

## Ce que je n'ai pas délégué à l'IA

J’ai décidé des règles (retard, validation d'une modification, version mobile).

## Quand l'IA ne m'a pas aidé (ou s'est trompée)

L'IA m'a parfois  donné des explications floues : confusion sur le test localStorage, ou la phrase sur « les dates qui vieillissent » que j'ai dû le faire réexpliquer.
