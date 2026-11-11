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
// 5. Lancement au chargement de la page
// ------------------------------------------------------------

// "audits" vient de data.js, chargé avant app.js (voir l'ordre des <script>).
// Définir une fonction ne l'exécute pas : il faut l'APPELER.
// Cet appel affiche les 30 audits dès l'ouverture de la page.
afficherAudits(audits);