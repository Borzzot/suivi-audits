## Mini projet suivi d'audits
Quand un audit est-il « en retard » : quand la date prévue est dépassée et qu’il n’est pas « réalisé » ? Un audit « à planifier » (sans date) peut-il être en retard ? Ici, je fais l’hypothèse qu’un audit est en retard quand la date prévue est dépassé et pas terminé. Un audit sans date sera mi dans en retard avec la mention à planifier pour ne pas oublier de le regarder. Cela permet au responsable de juste regarder les retards pour s’informer sur la situation et ne pas oublier ce cas.

Qu’est-ce qui ferait dire « cet outil me fait gagner du temps » ? Le gain de temps est ici la connaissance de l’avancé des audits sur l’ensemble de l’usine en quelques secondes.

Je fais l'application en version pc mais aussi mobile car c'est plus pratique pour consulter si le responsable est en déplacement.

J'utilise le localStorage pour garder les sauvegardes mais une vraie application utiliserait une base de données côté serveur. Dans une vraie version pour SEAC, les données sensibles des audits seraient sur un serveur (Node.js + PostgreSQL) avec une authentification : le navigateur ne recevrait que ce que l’utilisateur a le droit de voir.

## Compréhension du stages et des missions
Pour le stage développeur Web assisté par IA à SEAC, j'ai compris que je vais concevoir et développer à l'aide de l'IA pour répondre aux besoins de l'entreprise et de l'usine. Je vais être accompagné par le Responsable des Systèmes d'Information et par l'alternant développeur de l'entreprise.

Dans ce stage je vais utiliser l'architecture MVC, apprendre à documenter mon travail et à suivre une méthodologie de développement structurée, découvrir l'interrogation de bases de données DB2 ou PostgreSQL, collaborer avec l'alternant et les équipes utilisatrices des usines pour comprendre les besoins et tester les fonctionnalités développées.



## Lancer le projet

Application web 100 % front-end (HTML, CSS, JavaScript), sans serveur, sans base de données
et sans installation de paquets.

### Option 1 : ouvrir directement le fichier (le plus simple)

1. Télécharger ou cloner le dépôt :
   `git clone https://github.com/Borzzot/suivi-audits.git`
2. Ouvrir le dossier `suivi-audits`.
3. Double-cliquer sur `index.html` : la page s'ouvre dans le navigateur.

### Option 2 : avec Live Server (VS Code)

1. Ouvrir le dossier dans VS Code.
2. Installer l'extension **Live Server**.
3. Clic droit sur `index.html`, puis **Open with Live Server**.
4. La page s'ouvre sur `http://127.0.0.1:5500` et se rafraîchit à chaque modification.

### Version en ligne

https://borzzot.github.io/suivi-audits/

### Prérequis

Un navigateur récent (Firefox, Chrome, Edge, Safari). Aucun autre outil.

### Données

- Les données sont **fictives** (fichier `data.js`, 30 audits sur 10 sites).
- Les ajouts et modifications sont enregistrés dans le `localStorage` du navigateur :
  ils restent sur ce navigateur et cette adresse uniquement.
- Le bouton **« Réinitialiser les données »** efface la sauvegarde et recharge les données
  de départ. Si tu modifies `data.js` et que rien ne change, utilise ce bouton.

### Structure du projet

| Fichier | Rôle |
|---|---|
| `index.html` | Structure de la page (filtres, tableau, formulaire) |
| `style.css` | Mise en forme, couleurs de statut, affichage mobile |
| `data.js` | Données de départ fictives (`auditsInitiaux`) |
| `app.js` | Logique : affichage, retards, filtres, ajout, modification, sauvegarde |
| `JOURNAL-IA.md` | Journal d'usage de l'IA |