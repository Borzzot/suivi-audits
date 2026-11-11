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
// 4. La fonction principale : afficher la liste
// ------------------------------------------------------------

// "liste" est un paramètre : le tableau d'audits à afficher.
// On le passe en paramètre (au lieu d'utiliser directement "audits") pour pouvoir
// afficher plus tard une liste FILTRÉE avec la même fonction (étape 5).
function afficherAudits(liste) {

  // On vide le tableau avant de le remplir. Sans cette ligne, chaque appel
  // ajouterait les lignes à la suite des anciennes (doublons).
  // innerHTML = le contenu HTML de l'élément ; "" = rien.
  corpsTableau.innerHTML = "";

  // LA BOUCLE : for...of parcourt le tableau, un élément à la fois.
  // À chaque tour, la variable "audit" contient l'audit courant,
  // par exemple { id: 1, site: "Toulouse", datePrevue: "2026-09-15", statut: "realise" }.
  for (const audit of liste) {

    // Création d'une ligne de tableau : équivalent de <tr></tr>.
    // Elle existe en mémoire mais n'est PAS encore dans la page.
    const ligne = document.createElement("tr");

    // Création des trois cellules : équivalent de <td></td>.
    const celluleSite = document.createElement("td");
    const celluleDate = document.createElement("td");
    const celluleStatut = document.createElement("td");

    // textContent = le texte affiché dans l'élément.
    // On préfère textContent à innerHTML pour du texte simple : il traite
    // le contenu comme du texte brut, jamais comme du code HTML
    // (c'est plus sûr, ça évite l'injection de code à l'étape du formulaire).
    celluleSite.textContent = audit.site;
    celluleDate.textContent = formaterDate(audit.datePrevue);
    celluleStatut.textContent = libellesStatut[audit.statut];

    // appendChild ajoute un élément À LA FIN d'un autre.
    // On assemble d'abord la ligne : <tr> <td/> <td/> <td/> </tr>
    ligne.appendChild(celluleSite);
    ligne.appendChild(celluleDate);
    ligne.appendChild(celluleStatut);

    // Enfin, on branche la ligne terminée dans le <tbody> : elle apparaît à l'écran.
    corpsTableau.appendChild(ligne);
  }
}

// ------------------------------------------------------------
// 5. Lancement au chargement de la page
// ------------------------------------------------------------

// "audits" vient de data.js, chargé avant app.js (voir l'ordre des <script>).
// Cet appel affiche les 30 audits dès l'ouverture de la page.
afficherAudits(audits);