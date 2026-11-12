// ============================================================
// app.js : logique de l'application
// ============================================================

// ------------------------------------------------------------
// 1. Récupérer l'élément HTML à remplir
// ------------------------------------------------------------

// document = la page entière, vue par JavaScript (c'est le "DOM").
// querySelector("#corps-tableau") cherche l'élément dont l'id est "corps-tableau"
// (le # signifie "id", comme en CSS). C'est le <tbody> de index.html.
// On le stocke dans une constante pour ne pas le rechercher à chaque fois.
const corpsTableau = document.querySelector("#corps-tableau");

// ------------------------------------------------------------
// 2. Tables de correspondance pour l'affichage des statuts
// ------------------------------------------------------------

// Dans les données, le statut est "a-planifier" (sans accent ni espace).
// À l'écran, on veut "À planifier". Cet objet sert de dictionnaire :
// libellesStatut["a-planifier"] renvoie "À planifier".
const libellesStatut = {
  "a-planifier": "À planifier",
  "planifie": "Planifié",
  "realise": "Réalisé"
};

// ------------------------------------------------------------
// 3. Mise en forme d'une date
// ------------------------------------------------------------

// Les données stockent "2026-12-15" (AAAA-MM-JJ). En France, on lit "15/12/2026".
// On découpe volontairement le texte au lieu d'utiliser new Date() :
// new Date("2026-12-15") est interprété en heure UTC et peut décaler d'un jour
// selon le fuseau horaire. Ici, on ne fait que du texte : aucun risque.
function formaterDate(dateTexte) {
  // Cas limite : un audit "à planifier" n'a pas de date (null).
  // Sans ce test, null.split(...) provoquerait une erreur et bloquerait tout l'affichage.
  if (dateTexte === null) {
    return "Non planifiée";
  }

  // split("-") coupe le texte à chaque tiret :
  // "2026-12-15" devient ["2026", "12", "15"].
  // La syntaxe [annee, mois, jour] = ... range chaque morceau dans une variable
  // (on appelle ça la "déstructuration").
  const [annee, mois, jour] = dateTexte.split("-");

  // Les backticks ` ` permettent d'insérer des variables avec ${ }.
  return `${jour}/${mois}/${annee}`;
}


// ------------------------------------------------------------
// 4 bis. Gestion des retards (étape 4)
// ------------------------------------------------------------

// Renvoie la date d'aujourd'hui au format "AAAA-MM-JJ", comme dans les données.
// On n'utilise PAS toISOString() : il donne la date en heure UTC, donc
// entre minuit et 1h (ou 2h) du matin en France, il renverrait la veille.
function aujourdhui() {
  const d = new Date();
  const annee = d.getFullYear();
  // getMonth() commence à 0 (janvier = 0), d'où le +1.
  // padStart(2, "0") complète avec un zéro : "3" devient "03".
  const mois = String(d.getMonth() + 1).padStart(2, "0");
  const jour = String(d.getDate()).padStart(2, "0");
  return `${annee}-${mois}-${jour}`;
}

// RÈGLE (mon hypothèse) : un audit est "en retard" si
//   - il n'est pas "réalisé", ET
//   - sa date prévue est strictement avant aujourd'hui, OU il n'a pas de date.
// Un audit prévu AUJOURD'HUI n'est donc pas en retard : la date n'est pas encore dépassée.
function estEnRetard(audit) {
  // Un audit réalisé n'est jamais en retard, quelle que soit sa date.
  if (audit.statut === "realise") {
    return false;
  }

  // Pas de date (null) : on le met dans les retards pour ne pas l'oublier.
  if (audit.datePrevue === null) {
    return true;
  }

  // Comparaison de deux textes au format AAAA-MM-JJ.
  // Ce format est fait pour ça : l'ordre alphabétique est aussi l'ordre chronologique
  // ("2026-10-20" < "2026-11-11" est vrai). Pas besoin de new Date(), donc pas de
  // piège de fuseau horaire.
  return audit.datePrevue < aujourdhui();
}

// Nombre de jours de retard (utile pour distinguer 1 jour de 4 mois).
// Renvoie null si l'audit n'a pas de date.
function joursDeRetard(audit) {
  if (audit.datePrevue === null) {
    return null;
  }

  // On transforme chaque date en nombre de millisecondes.
  // Date.UTC(année, mois, jour) travaille en UTC pour les DEUX dates :
  // pas de décalage dû à l'heure d'été. Le mois commence à 0, d'où le -1.
  const [a1, m1, j1] = audit.datePrevue.split("-").map(Number);
  const [a2, m2, j2] = aujourdhui().split("-").map(Number);
  const prevue = Date.UTC(a1, m1 - 1, j1);
  const aujourd = Date.UTC(a2, m2 - 1, j2);

  // Une journée = 24 h x 60 min x 60 s x 1000 ms = 86 400 000 ms.
  return Math.round((aujourd - prevue) / 86400000);
}


function afficherAudits(liste) {
    corpsTableau.innerHTML = "";

  // Cas limite : aucun audit ne correspond aux filtres.
  // Sans ce test, le tableau serait simplement vide, ce qui ressemble à un bug.
  if (liste.length === 0) {
    const ligneVide = document.createElement("tr");
    const celluleVide = document.createElement("td");
    // colSpan = 3 : la cellule s'étend sur les 3 colonnes du tableau
    celluleVide.colSpan = 3;
    celluleVide.textContent = "Aucun audit ne correspond aux filtres.";
    ligneVide.appendChild(celluleVide);
    corpsTableau.appendChild(ligneVide);
    // return : on sort de la fonction, il n'y a rien d'autre à afficher
    return;
  }

  for (const audit of liste) {
    const ligne = document.createElement("tr");
    const celluleSite = document.createElement("td");
    const celluleDate = document.createElement("td");
    const celluleStatut = document.createElement("td");

    celluleSite.textContent = audit.site;
    celluleDate.textContent = formaterDate(audit.datePrevue);
    celluleStatut.textContent = libellesStatut[audit.statut];

    // NOUVEAU : si l'audit est en retard, on repère la ligne et on ajoute un badge.
    if (estEnRetard(audit)) {
      // classList.add ajoute une classe CSS à la ligne (le style sera dans style.css).
      ligne.classList.add("ligne-retard");

      // <span> = petit bloc de texte en ligne, idéal pour un badge.
      const badge = document.createElement("span");
      badge.classList.add("badge-retard");

      if (audit.datePrevue === null) {
        // Cas "à planifier" : pas de date, donc pas de nombre de jours.
        badge.textContent = "À planifier !";
        badge.classList.add("badge-sans-date");
      } else {
        const jours = joursDeRetard(audit);
        // Accord : "1 jour" mais "2 jours".
        badge.textContent = `En retard de ${jours} jour${jours > 1 ? "s" : ""}`;
      }

      celluleStatut.appendChild(badge);
    }

    ligne.appendChild(celluleSite);
    ligne.appendChild(celluleDate);
    ligne.appendChild(celluleStatut);
    corpsTableau.appendChild(ligne);
  }
}

// ------------------------------------------------------------
// 5. Les filtres (étape 5)
// ------------------------------------------------------------

// On récupère les éléments HTML dont on va lire la valeur.
const filtreSite = document.querySelector("#filtre-site");
const filtreStatut = document.querySelector("#filtre-statut");
const filtreRetard = document.querySelector("#filtre-retard");
const champSite = document.querySelector("#champ-site"); // le <select> du formulaire d'ajout

// Génère les options des listes de sites À PARTIR DES DONNÉES.
// Avantage : si un site apparaît dans les données, il apparaît dans la liste,
// sans rien écrire à la main dans le HTML.
function remplirListesSites() {
  // audits.map(...) crée un nouveau tableau ne contenant que les noms de sites
  // (avec des doublons : "Toulouse" apparaît 3 fois).
  const tousLesSites = audits.map(function (audit) {
    return audit.site;
  });

  // new Set(...) est une collection qui ne garde qu'UNE fois chaque valeur : elle supprime les doublons.
  // [...ensemble] (opérateur "spread") la retransforme en tableau classique.
  // sort(...) trie par ordre alphabétique ; localeCompare gère correctement les accents.
  const sitesUniques = [...new Set(tousLesSites)].sort(function (a, b) {
    return a.localeCompare(b, "fr");
  });

  for (const site of sitesUniques) {
    // Une <option> pour le filtre...
    const option = document.createElement("option");
    option.value = site;          // valeur lue par le JavaScript
    option.textContent = site;    // texte visible dans la liste
    filtreSite.appendChild(option);

    // ...et une copie pour le formulaire d'ajout (étape 6).
    // cloneNode(true) duplique l'élément : un même élément ne peut être qu'à un seul endroit.
    champSite.appendChild(option.cloneNode(true));
  }
}

// LA LOGIQUE DES FILTRES : on lit l'état des 3 contrôles, puis on garde
// uniquement les audits qui respectent TOUTES les conditions.
function appliquerFiltres() {
  const siteChoisi = filtreSite.value;           // "" = "Tous les sites"
  const statutChoisi = filtreStatut.value;       // "" = "Tous les statuts"
  const retardSeulement = filtreRetard.checked;  // true ou false

  // filter() parcourt le tableau et garde les éléments pour lesquels la fonction renvoie true.
  // Elle crée un NOUVEAU tableau : le tableau "audits" d'origine n'est jamais modifié.
  const resultat = audits.filter(function (audit) {

    // Chaque test dit : "si ce filtre est actif ET que l'audit ne correspond pas, on l'écarte".
    // Dès qu'un test échoue, on renvoie false (audit éliminé) sans vérifier la suite.
    if (siteChoisi !== "" && audit.site !== siteChoisi) {
      return false;
    }
    if (statutChoisi !== "" && audit.statut !== statutChoisi) {
      return false;
    }
    if (retardSeulement && !estEnRetard(audit)) {
      return false;
    }

    // L'audit a passé tous les tests : on le garde.
    return true;
  });

  // On réutilise la fonction de l'étape 3, qui prend une liste en paramètre.
  afficherAudits(resultat);
}

// Les événements : "change" se déclenche quand l'utilisateur change la valeur
// d'une liste ou coche/décoche une case. À ce moment-là, on relance le filtrage.
// On passe appliquerFiltres SANS parenthèses : on donne la fonction, on ne l'exécute pas encore.
filtreSite.addEventListener("change", appliquerFiltres);
filtreStatut.addEventListener("change", appliquerFiltres);
filtreRetard.addEventListener("change", appliquerFiltres);


// ------------------------------------------------------------
// 5 bis. Ajout d'un audit (étape 6)
// ------------------------------------------------------------

const formulaire = document.querySelector("#formulaire-audit");
const champDate = document.querySelector("#champ-date");
const champStatut = document.querySelector("#champ-statut");
const messageErreur = document.querySelector("#message-erreur");

// Calcule un nouvel id unique : le plus grand id existant + 1.
// On n'utilise PAS audits.length + 1 : si un jour on supprime un audit
// (ex. l'id 5 sur 30), length + 1 redonnerait 30, qui existe déjà -> doublon.
function nouvelId() {
  // audits.map(...) : tableau des ids [1, 2, 3, ... 30]
  // Math.max(...tableau) : le plus grand ; le "..." (spread) passe chaque id comme argument
  const ids = audits.map(function (audit) {
    return audit.id;
  });
  return Math.max(...ids) + 1;
}

// Vérifie les champs. Renvoie un message d'erreur (texte) ou "" si tout est valide.
// Le HTML (required) fait déjà une première vérification, mais on revérifie en JavaScript :
// la validation du navigateur peut être contournée, et notre règle métier
// ("planifié => date obligatoire") ne peut pas s'écrire en HTML seul.
function verifierFormulaire(site, date, statut) {
  if (site === "") {
    return "Choisis un site.";
  }
  // règle 1 : un audit planifié ou réalisé doit avoir une date.
  if (statut === "planifie" && date === "" || statut === "realise" && date === "") {
    return "La date est obligatoire pour un audit planifié ou réalisé.";
  }

  // règle 2 : un audit à planifier ne peut pas avoir de date
  if (statut === "a-planifier" && date !== ""){
    return "Pas de date possible pour un audit à planifier."
  }

  return "";
}

// L'événement "submit" se déclenche quand on clique sur "Ajouter" (ou qu'on appuie sur Entrée).
// "evenement" est un objet que le navigateur nous donne, avec des infos sur ce qui s'est passé.
formulaire.addEventListener("submit", function (evenement) {

  // preventDefault() : par défaut, un formulaire envoyé RECHARGE la page
  // (il enverrait les données à un serveur). Ici il n'y a pas de serveur :
  // la page rechargée effacerait notre tableau en mémoire, donc l'audit ajouté
  // disparaîtrait aussitôt. On annule ce comportement pour gérer l'envoi nous-mêmes.
  evenement.preventDefault();

  // 1. Lire les valeurs saisies (.value = ce que l'utilisateur a choisi ou tapé).
  const site = champSite.value;
  const date = champDate.value;     // "" si aucune date, sinon "AAAA-MM-JJ"
  const statut = champStatut.value;

  // 2. Valider. S'il y a une erreur, on l'affiche et on s'arrête (return).
  const erreur = verifierFormulaire(site, date, statut);
  messageErreur.textContent = erreur;   // vide si pas d'erreur : le message disparaît
  if (erreur !== "") {
    return;
  }

  // 3. Construire le nouvel audit, avec la même forme que ceux de data.js.
  // MA DÉCISION : un audit "à planifier" n'a pas de date, on force donc null.
  // Pour les autres statuts, une date vide est déjà refusée plus haut (planifié),
  // sinon on la garde. "date === '' ? null : date" signifie : si vide, null, sinon la date.
  const nouvelAudit = {
    id: nouvelId(),
    site: site,
    datePrevue: statut === "a-planifier" ? null : date,
    statut: statut
  };

  // 4. Ajouter au tableau. push() ajoute à la fin. Le tableau est "const",
  // mais seule la variable est figée : son contenu reste modifiable.
  audits.push(nouvelAudit);

  // 5. Rafraîchir l'affichage. On passe par appliquerFiltres (et non afficherAudits(audits)),
  // pour que les filtres actifs restent respectés.
  appliquerFiltres();

  // 6. Remettre le formulaire à zéro, prêt pour une nouvelle saisie.
  formulaire.reset();
});





// ------------------------------------------------------------
// 6. Lancement au chargement de la page
// ------------------------------------------------------------

// Les listes de sites d'abord, puis le premier affichage (aucun filtre actif = tout s'affiche).
remplirListesSites();
appliquerFiltres();