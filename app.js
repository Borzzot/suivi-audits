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
    celluleVide.colSpan = 4;
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

    // Cellule d'actions avec le bouton "Modifier"
    const celluleActions = document.createElement("td");
    const boutonModifier = document.createElement("button");
    boutonModifier.type = "button";
    boutonModifier.textContent = "Modifier";

    // COMMENT ON RETROUVE L'AUDIT : on mémorise l'ID de CET audit dans la fonction
    // du clic. "audit" est la variable de la boucle for...of : à chaque tour elle
    // désigne un audit différent, et chaque bouton "se souvient" du sien (on appelle
    // ça une closure). Au clic, on transmet donc l'id exact de la ligne cliquée.
    boutonModifier.addEventListener("click", function () {
      demarrerModification(audit.id);
    });

    celluleActions.appendChild(boutonModifier);

    ligne.appendChild(celluleSite);
    ligne.appendChild(celluleDate);
    ligne.appendChild(celluleStatut);
    ligne.appendChild(celluleActions); 
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


// ------------------------------------------------------------
// 5 ter. Modification d'un audit (étape 7)
// ------------------------------------------------------------

// MÉMOIRE DU MODE : null = on ajoute ; un nombre = id de l'audit en cours de modification.
// "let" et non "const", car la valeur va changer.
let idEnModification = null;

const boutonValider = document.querySelector("#bouton-valider");
const boutonAnnuler = document.querySelector("#bouton-annuler");
const titreFormulaire = document.querySelector("#ajout h2"); // le <h2> de la section "ajout"

// Retrouve un audit à partir de son id.
// find() parcourt le tableau et renvoie le PREMIER élément pour lequel la fonction
// renvoie true (ou undefined si rien ne correspond).
// POURQUOI L'ID ET PAS LA POSITION DANS LE TABLEAU ? Quand un filtre est actif, la ligne
// n°1 affichée n'est pas forcément audits[0]. La position change, l'id jamais.
function trouverAudit(id) {
  return audits.find(function (audit) {
    return audit.id === id;
  });
}

// Appelée au clic sur "Modifier" : passe le formulaire en mode modification.
function demarrerModification(id) {
  const audit = trouverAudit(id);
  if (audit === undefined) {
    return; // sécurité : id introuvable, on ne fait rien
  }

  // 1. On mémorise quel audit on modifie (c'est ça qui évite le doublon, voir plus bas).
  idEnModification = id;

  // 2. On préremplit le formulaire avec les valeurs actuelles de l'audit.
  champSite.value = audit.site;
  champStatut.value = audit.statut;
  // datePrevue vaut null pour un audit "à planifier", mais un champ date attend "" :
  champDate.value = (audit.datePrevue === null) ? "" : audit.datePrevue;

  // 3. Changer .value par code ne déclenche PAS l'événement "change".
  // On le déclenche à la main pour que d'éventuels écouteurs (ex. : grisage du champ
  // date pour "À planifier") se mettent à jour. Sans effet si tu n'as pas cette option.
  champStatut.dispatchEvent(new Event("change"));

  // 4. On adapte l'interface pour que l'utilisateur sache qu'il est en mode modification.
  titreFormulaire.textContent = "Modifier l'audit n°" + id;
  boutonValider.textContent = "Confirmer la modification";
  boutonAnnuler.hidden = false;
  messageErreur.textContent = "";

  // 5. Le formulaire peut être en bas de page : on y fait défiler l'écran.
  formulaire.scrollIntoView({ behavior: "smooth" });
}

// Remet le formulaire en mode "ajout" (après une modification, ou un clic sur Annuler).
function terminerModification() {
  idEnModification = null;
  formulaire.reset();
  champStatut.dispatchEvent(new Event("change")); // met à jour l'état du champ date
  titreFormulaire.textContent = "Ajouter un audit";
  boutonValider.textContent = "Ajouter";
  boutonAnnuler.hidden = true;
  messageErreur.textContent = "";
}

boutonAnnuler.addEventListener("click", terminerModification);




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

    // 3. La date à enregistrer : null pour "à planifier", sinon la date saisie.
  const datePrevue = (statut === "a-planifier") ? null : date;

  // 4. DEUX CAS selon le mode :
  if (idEnModification !== null) {
    // MODE MODIFICATION : on retrouve l'audit existant et on change ses champs.
    // "audit" n'est pas une copie : c'est une référence vers l'objet qui est DANS
    // le tableau "audits". Modifier ses propriétés modifie donc directement le tableau.
    // On ne fait pas push() : l'audit existe déjà, il n'y a donc PAS de doublon.
    // On garde le même id : c'est ce qui identifie l'audit.
    const audit = trouverAudit(idEnModification);
    audit.site = site;
    audit.datePrevue = datePrevue;
    audit.statut = statut;
  } else {
    // MODE AJOUT : comme à l'étape 6, on crée un nouvel audit avec un nouvel id.
    audits.push({
      id: nouvelId(),
      site: site,
      datePrevue: datePrevue,
      statut: statut
    });
  }

  // 5. Rafraîchir l'affichage en respectant les filtres actifs.
  appliquerFiltres();

  // 6. Revenir en mode "ajout" et vider le formulaire (remplace l'ancien formulaire.reset()).
  terminerModification();
});





// ------------------------------------------------------------
// 6. Lancement au chargement de la page
// ------------------------------------------------------------

// Les listes de sites d'abord, puis le premier affichage (aucun filtre actif = tout s'affiche).
remplirListesSites();
appliquerFiltres();