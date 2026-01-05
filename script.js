/* ============================
   COMPTE EPARGNE
============================ */
function calculEpargne() {
  let C = parseFloat(document.getElementById("capital").value);
  let t = parseFloat(document.getElementById("taux").value) / 100;
  let j = parseFloat(document.getElementById("jours").value);
  let base = parseFloat(document.getElementById("base").value);

  let I = C * t * (j / base);
  let V = C + I;

  document.getElementById("resultEpargne").innerHTML =
    `✅ Intérêt = <b>${I.toFixed(2)} DT</b><br>
     ✅ Valeur acquise = <b>${V.toFixed(2)} DT</b>`;
}

/* ============================
   DECOUVERT
============================ */
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

/* ============================
   ESCOMPTE
============================ */
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

/* ============================
   ANNUITES
============================ */
function calculAnnuites() {
  let A = parseFloat(document.getElementById("A").value);
  let i = parseFloat(document.getElementById("i").value) / 100;
  let n = parseFloat(document.getElementById("n").value);

  let Vn = A * ((Math.pow(1+i, n) - 1) / i);
  let V0 = A * ((1 - Math.pow(1+i, -n)) / i);

  document.getElementById("resultAnnuites").innerHTML =
    `✅ Valeur acquise Vn = <b>${Vn.toFixed(2)} DT</b><br>
     ✅ Valeur actuelle V0 = <b>${V0.toFixed(2)} DT</b>`;
}
