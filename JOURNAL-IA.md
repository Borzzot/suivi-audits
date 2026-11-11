1. Outil et étape 
2. Ce que vous avez demandé 
3. Ce que ça vous a apporté (ou non)
4. Ce que vous avez vérifié

Ajoutez une ligne sur ce que vous avez choisi de ne pas déléguer à l'IA. Dites-nous franchement quand elle ne vous a pas aidé : c'est aussi une information précieuse.

Je n'ai pas délégué à l'IA les modifications directes du projets par lui même.

outil : Claude / étape : clarification du besoin / demandé : 10 questions de cadrage / apporté : une grille de questions, dont j’ai gardé 3 quesitons qui me semblent les plus importantes. vérifié : j’ai transformé les réponses en hypothèses écrites dans le README.

Outil : Claude / étape : squelette HTML / demandé : le HTML seul avec explication de chaque balise / apporté : une structure complète, que j’ai relue et testée dans le navigateur / vérifié : le rendu, les labels, le required

Outil : Claude / étape : génération des données de test / demandé : 30 audits sur 10 sites avec cas limites / apporté : un jeu de données couvrant retards, date du jour, null et un site sans audit à venir / vérifié : comptage, cohérence des dates et des statuts.

Outil : Claude / étape : règle de retard / demandé : une fonction estEnRetard selon mon hypothèse écrite / apporté : la fonction, la gestion de la date du jour sans piège de fuseau, un badge distinct pour les audits sans date / vérifié : 7 tests en console, 9 lignes en retard comptées à l’écran, cas « aujourd’hui » testé. Et dans « ce que j’ai décidé moi-même » : la règle du retard et le choix d’inclure les audits sans date.

Outil : Claude / étape : filtres / demandé : filtres site + statut combinés, options générées depuis les données / apporté : la logique filter et Set, le message « aucun résultat » / vérifié : 7 combinaisons testées avec résultats attendus ; choix perso : case « Retards seulement » plutôt qu’une option de statut.


