// ============================================================
// data.js : données fictives des audits
// ============================================================

// "const" déclare une variable qui ne sera pas réassignée.
// Mais le CONTENU du tableau pourra être modifié (push, etc.) : on s'en servira à l'étape 6.
// Un tableau se note avec des crochets [ ... ], et chaque audit est un objet { ... }.
//
// Champs d'un audit :
//   id         : numéro unique (sert à retrouver l'audit pour le modifier)
//   site       : nom de l'usine (texte)
//   datePrevue : date au format "AAAA-MM-JJ" (texte), ou null s'il n'y a pas de date
//   statut     : "a-planifier", "planifie" ou "realise"
//                (ce sont les mêmes valeurs que les value="" des <option> du HTML)
//
// "null" signifie "volontairement vide". Ce n'est ni une chaîne vide "" ni la valeur 0.
// Il faudra donc tester datePrevue avant de la comparer à une date (étape 4).

const audits = [

  // ---------- Toulouse ----------
  { id: 1,  site: "Toulouse",         datePrevue: "2026-09-15", statut: "realise" },
  { id: 2,  site: "Toulouse",         datePrevue: "2026-11-05", statut: "planifie" },    // EN RETARD (6 jours)
  { id: 3,  site: "Toulouse",         datePrevue: "2027-01-20", statut: "planifie" },

  // ---------- Bordeaux ----------
  { id: 4,  site: "Bordeaux",         datePrevue: "2026-10-02", statut: "realise" },
  { id: 5,  site: "Bordeaux",         datePrevue: "2026-10-20", statut: "planifie" },    // EN RETARD (22 jours)
  { id: 6,  site: "Bordeaux",         datePrevue: null,         statut: "a-planifier" }, // pas de date

  // ---------- Lyon ----------
  { id: 7,  site: "Lyon",             datePrevue: "2026-08-27", statut: "realise" },
  { id: 8,  site: "Lyon",             datePrevue: "2026-11-11", statut: "planifie" },    // AUJOURD'HUI : en retard ou non ? (ton hypothèse)
  { id: 9,  site: "Lyon",             datePrevue: "2027-02-10", statut: "planifie" },

  // ---------- Nantes ----------
  { id: 10, site: "Nantes",           datePrevue: "2026-07-14", statut: "realise" },
  { id: 11, site: "Nantes",           datePrevue: "2026-12-03", statut: "planifie" },
  { id: 12, site: "Nantes",           datePrevue: null,         statut: "a-planifier" }, // pas de date

  // ---------- Tarbes ----------
  { id: 13, site: "Tarbes",           datePrevue: "2026-06-30", statut: "planifie" },    // RETARD LONG (plus de 4 mois)
  { id: 14, site: "Tarbes",           datePrevue: "2026-10-08", statut: "realise" },
  { id: 15, site: "Tarbes",           datePrevue: null,         statut: "a-planifier" }, // pas de date

  // ---------- Limoges ----------
  { id: 16, site: "Limoges",          datePrevue: "2026-11-12", statut: "planifie" },    // DEMAIN (utile pour l'alerte avant échéance)
  { id: 17, site: "Limoges",          datePrevue: "2026-09-09", statut: "realise" },
  { id: 18, site: "Limoges",          datePrevue: "2027-03-04", statut: "planifie" },

  // ---------- Montpellier ----------
  { id: 19, site: "Montpellier",      datePrevue: "2026-11-09", statut: "planifie" },    // EN RETARD (2 jours)
  { id: 20, site: "Montpellier",      datePrevue: "2026-10-14", statut: "realise" },
  { id: 21, site: "Montpellier",      datePrevue: null,         statut: "a-planifier" }, // pas de date

  // ---------- Clermont-Ferrand ----------
  { id: 22, site: "Clermont-Ferrand", datePrevue: "2026-11-25", statut: "planifie" },
  { id: 23, site: "Clermont-Ferrand", datePrevue: "2026-05-19", statut: "realise" },
  { id: 24, site: "Clermont-Ferrand", datePrevue: "2026-11-18", statut: "planifie" },    // dans 7 jours

  // ---------- Rennes ----------
  { id: 25, site: "Rennes",           datePrevue: "2026-10-27", statut: "planifie" },    // EN RETARD (15 jours)
  { id: 26, site: "Rennes",           datePrevue: "2026-12-17", statut: "planifie" },
  { id: 27, site: "Rennes",           datePrevue: "2026-11-30", statut: "realise" },     // INCOHÉRENT : "réalisé" mais date future (volontaire, pour tester)

  // ---------- Dijon ----------
  // Dijon n'a QUE des audits réalisés : aucun audit à venir ni à planifier.
  // C'est le cas "usine sans audit planifié" (difficile à repérer, car c'est une absence).
  { id: 28, site: "Dijon",            datePrevue: "2026-04-22", statut: "realise" },
  { id: 29, site: "Dijon",            datePrevue: "2026-11-03", statut: "realise" },
  { id: 30, site: "Dijon",            datePrevue: "2026-09-01", statut: "realise" }

];