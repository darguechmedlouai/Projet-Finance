/* =======================================
   ✅📌 COMPTE EPARGNE AVANCE
======================================= */

let operations = []; // stocke les opérations

// ✅📌 ✅ PLUS DE PROMPT : lecture directe depuis le formulaire HTML
function ajouterOperation() {
  let date = document.getElementById("opDate").value;
  let type = document.getElementById("opType").value;
  let montant = parseFloat(document.getElementById("opMontant").value);

  if (!date || !type || isNaN(montant) || montant <= 0) {
    alert("❌ Veuillez remplir tous les champs correctement !");
    return;
  }

  operations.push({ date, type, montant });

  // ✅ vider champs après ajout
  document.getElementById("opDate").value = "";
  document.getElementById("opMontant").value = "";

  afficherOperations();
}

function supprimerOperation(index) {
  operations.splice(index, 1);
  afficherOperations();
}

function afficherOperations() {
  let tbody = document.querySelector("#tableOps tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  let solde = parseFloat(document.getElementById("soldeInitial").value) || 0;

  operations.forEach((op, index) => {
    if (op.type === "DEPOT" || op.type === "CREDIT") solde += op.montant;
    if (op.type === "RETRAIT" || op.type === "CHARGES") solde -= op.montant;

    let row = `
      <tr>
        <td>${index + 1}</td>
        <td>${op.date}</td>
        <td>${op.type}</td>
        <td>${op.montant.toFixed(2)}</td>
        <td>${solde.toFixed(2)}</td>
        <td><button onclick="supprimerOperation(${index})">❌</button></td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

function calculerBilanEpargne() {
  let soldeInitial = parseFloat(document.getElementById("soldeInitial").value) || 0;
  let taux = (parseFloat(document.getElementById("tauxEpargne").value) || 0) / 100;
  let jours = parseFloat(document.getElementById("joursEpargne").value) || 0;

  let solde = soldeInitial;

  let totalDepot = 0;
  let totalRetrait = 0;
  let totalCharges = 0;
  let totalCredit = 0;

  operations.forEach(op => {
    if (op.type === "DEPOT") { solde += op.montant; totalDepot += op.montant; }
    if (op.type === "CREDIT") { solde += op.montant; totalCredit += op.montant; }
    if (op.type === "RETRAIT") { solde -= op.montant; totalRetrait += op.montant; }
    if (op.type === "CHARGES") { solde -= op.montant; totalCharges += op.montant; }
  });

  // ✅📌 Intérêts simples
  let interets = solde * taux * (jours / 360);
  let soldeFinal = solde + interets;

  // ✅📌 Affichage classique HTML (avec emojis)
  if (document.getElementById("resultBilan")) {
    document.getElementById("resultBilan").innerHTML = `
      ✅ Total Dépôts : <b>${totalDepot.toFixed(2)} DT</b><br>
      ✅ Total Crédit : <b>${totalCredit.toFixed(2)} DT</b><br>
      ❌ Total Retraits : <b>${totalRetrait.toFixed(2)} DT</b><br>
      ❌ Total Charges : <b>${totalCharges.toFixed(2)} DT</b><br><br>
      📌 Solde avant intérêts : <b>${solde.toFixed(2)} DT</b><br>
      📌 Intérêts simples : <b>${interets.toFixed(2)} DT</b><br><br>
      ✅ <b>Solde final (avec intérêts) : ${soldeFinal.toFixed(2)} DT</b>
    `;
  }

  // ✅📌 Remplir le tableau bilan HTML
  if (document.getElementById("bDepot")) {
    document.getElementById("bDepot").innerText = totalDepot.toFixed(2) + " DT";
    document.getElementById("bCredit").innerText = totalCredit.toFixed(2) + " DT";
    document.getElementById("bRetrait").innerText = totalRetrait.toFixed(2) + " DT";
    document.getElementById("bCharges").innerText = totalCharges.toFixed(2) + " DT";
    document.getElementById("bSoldeAvant").innerText = solde.toFixed(2) + " DT";
    document.getElementById("bInterets").innerText = interets.toFixed(2) + " DT";
    document.getElementById("bSoldeFinal").innerText = soldeFinal.toFixed(2) + " DT";
  }
}

/* =======================================
   ✅📌 EXPORT PDF - EPARGNE (TABLEAUX)
   ✅ CORRIGÉ : pas d'emojis dans le PDF
======================================= */

function exporterPDFEpargne() {
  calculerBilanEpargne();

  if (!window.jspdf) {
    alert("❌ jsPDF n'est pas chargé ! Vérifie les CDN dans epargne.html");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let soldeInitial = document.getElementById("soldeInitial").value;
  let taux = document.getElementById("tauxEpargne").value;
  let jours = document.getElementById("joursEpargne").value;

  doc.setFontSize(18);
  doc.text("Bilan Compte Epargne", 14, 18);

  doc.setFontSize(12);
  doc.text(`Solde initial : ${soldeInitial} DT`, 14, 30);
  doc.text(`Taux annuel : ${taux}%`, 14, 38);
  doc.text(`Duree : ${jours} jours`, 14, 46);

  // ✅ TABLEAU DES OPERATIONS
  doc.setFontSize(14);
  doc.text("Operations :", 14, 60);

  let opsData = operations.map((op, i) => [
    i + 1,
    op.date,
    op.type,
    op.montant.toFixed(2) + " DT"
  ]);

  doc.autoTable({
    startY: 65,
    head: [["#", "Date", "Type", "Montant"]],
    body: opsData
  });

  // ✅ TABLEAU BILAN (SANS EMOJIS pour éviter Ø=ÜÌ)
  let bilanY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.text("Bilan final :", 14, bilanY);

  let bilanData = [
    ["Total Depots", document.getElementById("bDepot").innerText],
    ["Total Credits", document.getElementById("bCredit").innerText],
    ["Total Retraits", document.getElementById("bRetrait").innerText],
    ["Total Charges", document.getElementById("bCharges").innerText],
    ["Solde Avant Interets", document.getElementById("bSoldeAvant").innerText],
    ["Interets Simples", document.getElementById("bInterets").innerText],
    ["Solde Final", document.getElementById("bSoldeFinal").innerText]
  ];

  doc.autoTable({
    startY: bilanY + 5,
    head: [["Element", "Valeur"]],
    body: bilanData
  });

  doc.save("bilan_compte_epargne.pdf");
}

/* =======================================
   ✅📌 MODULE DECOUVERT
======================================= */

function calculDecouvert() {
  let M = parseFloat(document.getElementById("montantDec").value);
  let t = parseFloat(document.getElementById("tauxDec").value) / 100;
  let j = parseFloat(document.getElementById("joursDec").value);
  let comm = parseFloat(document.getElementById("commDec").value);
  let tva = parseFloat(document.getElementById("tvaDec").value) / 100;

  let interets = M * t * (j / 360);
  let totalHT = interets + comm;
  let TVA = totalHT * tva;
  let total = totalHT + TVA;

  document.getElementById("resultDecouvert").innerHTML =
    `📌 Intérêts = <b>${interets.toFixed(2)} DT</b><br>
     📌 Commission = <b>${comm.toFixed(2)} DT</b><br>
     📌 TVA = <b>${TVA.toFixed(2)} DT</b><br><br>
     ✅ <b>Total Ticket d’Agios = ${total.toFixed(2)} DT</b>`;
}

/* =======================================
   ✅📌 MODULE ESCOMPTE
======================================= */

function calculEscompte() {
  let nominal = parseFloat(document.getElementById("nominal").value);
  let taux = parseFloat(document.getElementById("tauxEsc").value) / 100;
  let jours = parseFloat(document.getElementById("joursEsc").value);
  let comm = parseFloat(document.getElementById("commEsc").value);
  let tva = parseFloat(document.getElementById("tvaEsc").value) / 100;

  let interets = nominal * taux * (jours / 360);
  let totalHT = interets + comm;
  let TVA = totalHT * tva;
  let agios = totalHT + TVA;

  let net = nominal - agios;
  let tauxReel = (agios / net) * (360 / jours) * 100;

  document.getElementById("resultEscompte").innerHTML =
    `📌 Intérêts = <b>${interets.toFixed(2)} DT</b><br>
     📌 Commission = <b>${comm.toFixed(2)} DT</b><br>
     📌 TVA = <b>${TVA.toFixed(2)} DT</b><br>
     ✅ Agios Totaux = <b>${agios.toFixed(2)} DT</b><br><br>
     ✅ Montant Net Reçu = <b>${net.toFixed(2)} DT</b><br>
     ✅ Taux Réel = <b>${tauxReel.toFixed(2)} %</b>`;
}

/* =======================================
   ✅📌 MODULE ANNUITES
======================================= */

function calculAnnuites() {
  let A = parseFloat(document.getElementById("A").value);
  let i = parseFloat(document.getElementById("i").value) / 100;
  let n = parseFloat(document.getElementById("n").value);

  let Vn = A * ((Math.pow(1 + i, n) - 1) / i);
  let V0 = A * ((1 - Math.pow(1 + i, -n)) / i);

  document.getElementById("resultAnnuites").innerHTML =
    `✅ Valeur acquise Vn = <b>${Vn.toFixed(2)} DT</b><br>
     ✅ Valeur actuelle V0 = <b>${V0.toFixed(2)} DT</b>`;
}
