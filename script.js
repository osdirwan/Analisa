
// =====================================================
// SESSION QUIZ
// =====================================================

if (!sessionStorage.getItem("quizActive")) {

  // TAB / BROWSER BARU
  localStorage.removeItem("quizState");

}
let isReadonlyMode = false;
window.pesertaList = [];
let questions = [];
let current = 0;
let score = 0;
let userAnswers = [];
let timerInterval;
let startTime;

isReadonlyMode = true;

window.loggedInEmail = null; // 🆕 Menyimpan email login
const params = new URLSearchParams(window.location.search);
const emailFromURL = params.get("email");
if (emailFromURL) {
  window.loggedInEmail = emailFromURL.toLowerCase();
}


declareVariables();
async function loadKelasPeserta(email) {

  const kelasInput =
    document.getElementById("kelas");

  kelasInput.innerHTML =
    '<option>Memuat...</option>';

  try {

    const url =
      "https://opensheet.elk.sh/15rUUAyWjGOMrT3Nz1hEbBQgn1OYY0OB-xUx4hHOcnfQ/Sheet1";

    const res =
      await fetch(url);

    const data =
  await res.json();

const rows =
  data.filter(r =>
    (r.Email || "")
      .toString()
      .trim()
      .toLowerCase()
    ===
    email
      .trim()
      .toLowerCase()
  );
    const res2 = await fetch(
    "https://opensheet.elk.sh/15rUUAyWjGOMrT3Nz1hEbBQgn1OYY0OB-xUx4hHOcnfQ/Sheet2"
  );

  const data2 =
    await res2.json();
    kelasInput.innerHTML = "";
    kelasInput.innerHTML =
  '<option value="">Pilih paket yang dibeli</option>';

const paketUnik = new Set();

rows.forEach(row => {

  const paket = (row.Paket || "").trim();

  const rowsPaket =
  data2
    .filter(r =>

      (r.Email || "")
        .trim()
        .toLowerCase()

      ===

      email
        .trim()
        .toLowerCase()

      &&

      (r.Paket || "")
        .trim()

      ===

      paket

    )
    .sort(
      (a,b) =>
        new Date(b.Tanggal) -
        new Date(a.Tanggal)
    );

const aktif =
  rowsPaket[0] &&
  (rowsPaket[0].Keaktifan || "")
    .toUpperCase() === "AKTIF" &&
  (rowsPaket[0].Permission || "")
    .toUpperCase() === "OK";

  if (!aktif) return;

  // CEGAH DUPLIKAT
  if (paketUnik.has(paket)) return;

  paketUnik.add(paket);

  const option = document.createElement("option");

  option.value = paket;
  option.textContent = paket;

  kelasInput.appendChild(option);

});

  } catch (err) {

    console.error(err);

    kelasInput.innerHTML =
      '<option value="">Gagal memuat kelas</option>';

  }

}


// Ambil data peserta dari spreadsheet
fetch("https://opensheet.elk.sh/18mQe0-u4ma9mEemc5L6zN6AWe6IbfopdDIlhUKM1WEE/PESERTA")
  .then(res => res.json())
  .then(data => {
    window.pesertaList = data.map(row => ({
      email: (row.Email || "").trim().toLowerCase(),
      nama: row.Nama || "",
      asalSekolah: row["Asal Sekolah"] || "",
      kelas: row.Kelas || "",
      password: row.Password || "",
      pesan: row["Pesan Pribadi"] || ""
      
    }));

    if (window.loggedInEmail) {
      emailInput.value = window.loggedInEmail;
      emailInput.dispatchEvent(new Event("blur"));
    }
  })
  .catch(err => console.error("❌ Gagal memuat data peserta:", err));

const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email =
  document.getElementById("login-email")
    .value
    .trim()
    .toLowerCase();

const password =
  document.getElementById("login-password")
    .value
    .trim();

if (!email) {
  alert("Silakan isi Email");
  return;
}

if (!password) {
  alert("Silakan isi Password");
  return;
}

const regexEmail =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!regexEmail.test(email)) {
  alert("Format Email tidak valid");
  return;
}

const peserta =
  window.pesertaList?.find(
    p => p.email === email
  );

// EMAIL TIDAK TERDAFTAR
// EMAIL TIDAK TERDAFTAR
if (!peserta) {

  const daftar = confirm(
    "Kamu belum membuat Akun, silakan Sign Up terlebih dahulu.\n\nKlik OK untuk Sign Up.\nKlik Cancel untuk mencoba Trial Version."
  );

  document
    .querySelectorAll(
      ".halaman,.halaman-konten,#identity-form"
    )
    .forEach(
      el => el.style.display = "none"
    );

  if (daftar) {

    // OK → SIGN UP
    document
      .getElementById("signup-page")
      .style.display = "block";

  } else {

    // CANCEL → TRIAL VERSION
alert("Anda masuk mode Trial.");

window.isTrialMode = true;

// tampilkan halaman identitas
document
  .querySelectorAll(
    ".halaman,.halaman-konten,#identity-form"
  )
  .forEach(el =>
    el.style.display = "none"
  );

document.getElementById(
  "identity-form"
).style.display = "block";

// isi email login
const emailLogin =
  document.getElementById(
    "login-email"
  ).value.trim();

document.getElementById(
  "email"
).value = emailLogin;

// isi paket trial
document.getElementById(
  "kelas"
).innerHTML = `
  <option value="">Pilih paket yang dibeli</option>
  <option value="BAHASA INGGRIS Trial">BAHASA INGGRIS Trial</option>
  <option value="MATEMATIKA Trial">MATEMATIKA Trial</option>
  <option value="PENDIDIKAN PANCASILA Trial">PENDIDIKAN PANCASILA Trial</option>
`;

    startBtn.disabled = false;

  }

  return;
}
const user = peserta;

// LANJUTKAN KODE LOGIN
if (
  (user.status || "")
    .trim()
    .toUpperCase() === "OK"
) {

  alert(
`✅ Login berhasil

Selamat datang ${user.nama}`
  );

  window.loggedInEmail =
    user.email;

  window.loggedInNama =
    user.nama;
  window.loggedInEmail = user.email;

  window.loggedInNama = user.nama;

 setTimeout(() => {

  updateInfoPaketTombol();

}, 1500);
  document
    .querySelectorAll(
      ".halaman,.halaman-konten,#identity-form"
    )
    .forEach(
      el =>
        el.style.display =
          "none"
    );

  document
  .querySelectorAll(
    ".halaman, .halaman-konten, #identity-form"
  )
  .forEach(el => {
    el.style.display = "none";
  });

document
  .getElementById(
    "beranda"
  )
  .style.display = "block";

  // Isi otomatis data peserta
  emailInput.value =
    user.email || "";

  nameInput.value =
    user.nama || "Belum diketahui";

  sekolahInput.value =
    user.asalSekolah ||
    "Belum diketahui";

  passwordInput.value =
    user.password || "";

  // Reset dropdown
  mapelInput.innerHTML =
    '<option value="">Pilih Mata Pelajaran</option>';

  babInput.innerHTML =
    '<option value="">Pilih Bab Materi</option>';

  paketInput.innerHTML =
    '<option value="">Pilih Paket</option>';

  // Muat paket yang dibeli
  loadKelasPeserta(
    user.email
  );

  // Validasi password
  validatePassword();

} else {

  if (
    confirm(
      "❗ Anda belum membeli paket.\nBelilah paket untuk mendapatkan lebih banyak soal\n\nKlik OK untuk kembali ke Beranda dan klik menu Beli Paket\nKlik Cancel untuk mencoba Soal Trial"
    )
  ) {

    document
      .querySelectorAll(
        ".halaman,.halaman-konten,#identity-form"
      )
      .forEach(
        el =>
          el.style.display =
            "none"
      );

    document
      .getElementById(
        "beranda"
      )
      .style.display =
        "block";

  } else {

  alert(
    "Anda masuk mode Trial."
  );

  window.loggedInEmail =
    user.email;

  window.loggedInNama =
    user.nama;

  window.isTrialMode = true; // MODE TRIAL
  
  document
    .querySelectorAll(
      ".halaman,.halaman-konten,#identity-form"
    )
    .forEach(
      el =>
        el.style.display =
          "none"
    );

  document
    .getElementById(
      "login-page"
    )
    .style.display =
      "none";

  document
  .getElementById(
    "identity-form"
  )
  .style.display =
    "block";
// ==============================
// IDENTITAS TRIAL
// ==============================

emailInput.value = user.email || "";

nameInput.value =
  user.nama || "Belum diketahui";

sekolahInput.value =
  user.asalSekolah || "Belum diketahui";

passwordInput.value =
  user.password || "";

// ==============================
// PAKET TRIAL
// ==============================

kelasInput.disabled = false;
kelasInput.style.opacity = "1";
kelasInput.style.pointerEvents = "auto";

kelasInput.innerHTML = `
  <option value="" selected>
    Pilih Paket yang dibeli
  </option>
  <option value="BAHASA INGGRIS Trial">
    BAHASA INGGRIS Trial
  </option>
  <option value="MATEMATIKA Trial">
    MATEMATIKA Trial
  </option>
  <option value="PENDIDIKAN PANCASILA Trial">
    PENDIDIKAN PANCASILA Trial
  </option>
`;

// ==============================
// RESET DROPDOWN
// ==============================

mapelInput.innerHTML = `
  <option value="">
    Pilih Mata Pelajaran
  </option>
`;

babInput.innerHTML = `
  <option value="">
    Pilih Bab Materi
  </option>
`;

paketInput.innerHTML = `
  <option value="">
    Pilih Paket
  </option>
`;

paketInput.disabled = false;

// aktifkan tombol mulai
passwordMessage.textContent = "";
startBtn.disabled = false;
// ==============================
// ISI OTOMATIS IDENTITAS PESERTA
// ==============================

emailInput.value = user.email || "";
nameInput.value =
  user.nama || "Belum diketahui";

sekolahInput.value =
  user.asalSekolah || "Belum diketahui";
passwordInput.value = user.password || "";


emailInput.readOnly = true;

passwordInput.readOnly = true;

// Aktifkan tombol MULAI
passwordMessage.textContent = "";
startBtn.disabled = false;

// ==============================
// ISI OTOMATIS PAKET TRIAL
// ==============================

kelasInput.innerHTML = `
  <option value="">Pilih paket yang dibeli</option>
  <option value="BAHASA INGGRIS Trial">BAHASA INGGRIS Trial</option>
  <option value="MATEMATIKA Trial">MATEMATIKA Trial</option>
  <option value="PENDIDIKAN PANCASILA Trial">PENDIDIKAN PANCASILA Trial</option>
`;



// trigger agar mapel terisi
kelasInput.dispatchEvent(
  new Event("change")
);

}

}


  });
}

// TOMBOL BELAJAR/TRYOUT AKTIFKAN FORM IDENTITAS DENGAN VALIDASI LOGIN

document.addEventListener(
  "click",
  function(e){

    const btn =
      e.target.closest(
        ".tombol-3d"
      );

    if (!btn) return;

    if (!window.loggedInEmail) {

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      alert(
        "Silakan login terlebih dahulu"
      );

      document
        .querySelectorAll(
          ".halaman,.halaman-konten,#identity-form,#daftar-paket"
        )
        .forEach(el => {
          el.style.display = "none";
        });

      document
        .getElementById(
          "login-page"
        )
        .style.display = "block";

      return false;
    }

  },
  true
);

function declareVariables() {
  nameInput = document.getElementById("name");
  emailInput = document.getElementById("email");
  sekolahInput = document.getElementById("sekolah");
  
  kelasInput = document.getElementById("kelas");
  mapelInput = document.getElementById("mapel");
  babInput = document.getElementById("bab");
  paketInput = document.getElementById("paket");
  jumlahSoalInput = document.getElementById("jumlahSoal");
  durasiInput = document.getElementById("durasi");
  passwordInput = document.getElementById("password");
  startBtn = document.getElementById("start-btn");
  passwordMessage = document.getElementById("password-message");
  identityForm = document.getElementById("identity-form");
  quizBox = document.getElementById("quiz-box");
  questionEl = document.getElementById("question");
  optionsEl = document.getElementById("options");
  feedbackEl = document.getElementById("feedback");
  scoreEl = document.getElementById("score");
  timerEl = document.getElementById("timer");
  navigation = document.getElementById("navigation");
}

// Ambil data peserta dari spreadsheet
document.addEventListener("DOMContentLoaded", () => {
  const semuaHalaman = document.querySelectorAll(".halaman");
  semuaHalaman.forEach(hal => hal.style.display = "none");

  const halamanBeranda = document.getElementById("beranda");
  if (halamanBeranda) {
    halamanBeranda.style.display = "block";
  }

  fetch("https://opensheet.elk.sh/18mQe0-u4ma9mEemc5L6zN6AWe6IbfopdDIlhUKM1WEE/PESERTA")
    .then(res => res.json())
    .then(data => {
      window.pesertaList = data.map(row => ({
  email: (row.Email || "").trim().toLowerCase(),
  nama: row.Nama || "",
  asalSekolah: row["Asal Sekolah"] || "",
  
  kelas: row.Kelas || "",
  password: row.Password || "",
  pesan: row["Pesan Pribadi"] || "",
  status: row.Status || ""
}));
    })
    .catch(err => console.error("❌ Gagal memuat data peserta:", err));
});

// Autofill data berdasarkan email
emailInput.addEventListener("blur", () => {

  const email =
    emailInput.value.trim().toLowerCase();

  const peserta =
    window.pesertaList.find(
      p => p.email === email
    );

  if (peserta) {

    nameInput.value =
      peserta.nama || "Belum diketahui";

    sekolahInput.value =
      peserta.asalSekolah || "Belum diketahui";

    // HANYA UNTUK USER BERBAYAR
    if (!window.isTrialMode) {
      loadKelasPeserta(email);
    }

    passwordInput.value =
      peserta.password;

    document.getElementById(
      "pesan-motivasi"
    ).innerText =
      peserta.pesan || "Semangat ya!";

    validatePassword();

  }

});

passwordInput.addEventListener("input", validatePassword);
emailInput.addEventListener("input", validatePassword);

// Fungsi untuk memuat mapel
function loadMapelList(kelas) {

  const url =
    `https://script.google.com/macros/s/AKfycbzcFz3Tm6C9-TPHK7M5NqNykCEiXxROkOtYxZxTpaPsmnS1cxsfprG89cfz9C9DukGc/exec?kelas=${encodeURIComponent(kelas)}`;
  mapelInput.innerHTML = '<option>Memuat...</option>';

  fetch(url)
    .then(res => res.json())
    .then(data => {
    if (!Array.isArray(data) || data.length === 0) {

    mapelInput.innerHTML =
      '<option value="">Tidak ada mapel ditemukan</option>';

    return;
  }

  // 🔽 SORT ASCENDING
  const sortedMapel = data.sort((a, b) =>

    a.localeCompare(b, 'id', {
      numeric: true,
      sensitivity: 'base'
    })

  );

  mapelInput.innerHTML =
    '<option value="">Pilih Mata Pelajaran</option>';

  sortedMapel.forEach(nama => {

    const option =
      document.createElement("option");

    option.value = nama;

    option.textContent = nama;

    mapelInput.appendChild(option);

  });

})
    .catch(err => {
      console.error("Fetch error:", err);
      mapelInput.innerHTML = '<option value="">Gagal memuat mapel</option>';
    });
}

// Trigger saat kelas diubah (input atau blur)
["input", "blur"].forEach(evt => {
  kelasInput.addEventListener(evt, () => {
    const selectedKelas = kelasInput.value.trim();
    if (selectedKelas) {
    loadMapelList(selectedKelas);
  }
  });
});



//INPUT NAMA BAB MATERI
const selectedSpreadsheetName = mapelInput.value; // ambil nama dari input
const sheetApiBaseUrl = "https://script.google.com/macros/s/AKfycbxMuFkeVk7gN6anQ79i37Whstx2k95FMWoaqOAwX8-6OaGjlj6_E66eDGczG8M9CTZO5Q/exec";


function loadSheetList(selectedSpreadsheetName) {
  if (!selectedSpreadsheetName) {
    babInput.innerHTML = '<option value="">Pilih Materi</option>';
    return;
  }

  // Buat URL dinamis berdasarkan pilihan mata pelajaran
  const sheetApiUrl = `${sheetApiBaseUrl}?action=getSheets&spreadsheetName=${encodeURIComponent(selectedSpreadsheetName)}`;

  babInput.innerHTML = '<option value="">Memuat Bab Materi...</option>';

  fetch(sheetApiUrl)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(sheetNames => {
      babInput.innerHTML = '<option value="">Pilih Bab Materi</option>';

      if (Array.isArray(sheetNames) && sheetNames.length > 0) {
        sheetNames
      .filter(name => !/^Sheet\d*/i.test(name)) // menyaring nama sheet yang diawali "Sheet"
      .forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        babInput.appendChild(option);
      });
      } else {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "Bab Materi tidak ditemukan";
        babInput.appendChild(option);
      }
    })
    .catch(err => {
      console.error("Gagal memuat daftar BAB:", err);
      babInput.innerHTML = '<option value="">Gagal memuat bab</option>';
    });
}

// Listener untuk perubahan pada input MATA PELAJARAN
if (mapelInput) {
  mapelInput.addEventListener("change", function() {
    const selectedSpreadsheet = mapelInput.value;
    loadSheetList(selectedSpreadsheet);
  });
}

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
const sheetURL = "https://opensheet.elk.sh/1-XMEFrfkLfxd9AWi-EfLuGo8dnjO_kzYUCJ2gy9C-zs/Sheet2";
const pesertaURL = "https://opensheet.elk.sh/18mQe0-u4ma9mEemc5L6zN6AWe6IbfopdDIlhUKM1WEE/PESERTA";

babInput.addEventListener("change", () => {
  const selectedBab = babInput.value.trim();

  if (!selectedBab) {
    jumlahSoalInput.value = "";
    durasiInput.value = "";
    return;
  }

  // Ambil status peserta dulu
  fetch(pesertaURL)
    .then(res => res.json())
    .then(pesertaData => {
      const emailLogin = (window.loggedInEmail || "").trim().toLowerCase();
      const peserta = pesertaData.find(p => (p.Email || "").trim().toLowerCase() === emailLogin);
      const status = (peserta?.Status || "").trim().toUpperCase();

      const belumOK = status !== "OK";

      // Lanjut ambil data bab dari Sheet2
      return fetch(sheetURL).then(res => res.json()).then(sheetData => {
        const matchedRow = sheetData.find(row => row["Nama Sheet"]?.trim() === selectedBab);

        if (matchedRow) {
  const jumlahSoal = belumOK ? "10" : (matchedRow["Jumlah Soal Per Paket"] || "");
  const paketKe = belumOK ? "1" : (matchedRow["Paket Ke"] || "");
 
  jumlahSoalInput.value = jumlahSoal;
  paketInput.value = paketKe;
  durasiInput.value = matchedRow["Durasi"] || "";
 
  // 🔒 Disable input paket jika hanya 1 pilihan
  paketInput.disabled =
  !window.isTrialMode &&
  paketKe === "1";
 
} else {
  jumlahSoalInput.value = "";
  paketInput.value = "";
  durasiInput.value = "";
  jumlahSoalInput.disabled = false;
  paketInput.disabled = false;
  console.warn("BAB MATERI tidak ditemukan di Sheet2.");
}
      });
    })
    .catch(error => {
      console.error("Gagal mengambil data:", error);
      jumlahSoalInput.value = "";
      durasiInput.value = "";
    });
});


//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
async function updatePaketDropdown(babMateriDipilih) {
  const paketInput = document.getElementById("paket");
  if (!paketInput) return;

  const email = (emailInput.value || "").trim().toLowerCase();
  const mapel = (mapelInput.value || "").trim().toLowerCase();
  const bab = (babMateriDipilih || "").trim().toLowerCase();

  paketInput.innerHTML = '<option value="">Memuat Paket...</option>';

  try {
    // 1) Ambil master jumlah paket per BAB
    const resMaster = await fetch('https://opensheet.elk.sh/1-XMEFrfkLfxd9AWi-EfLuGo8dnjO_kzYUCJ2gy9C-zs/Sheet2');
    if (!resMaster.ok) throw new Error("Fetch master gagal: " + resMaster.status);
    const dataMaster = await resMaster.json();

    const baris = dataMaster.find(r =>
      (r["Nama Sheet"] || "").trim().toLowerCase() === bab
    );

    if (!baris) {
      paketInput.innerHTML = '<option value="">BAB tidak ditemukan</option>';
      return;
    }

    const jumlahPaket = parseInt(baris["Paket Ke"], 10);
    if (isNaN(jumlahPaket) || jumlahPaket < 1) {
      paketInput.innerHTML = '<option value="">Data paket tidak valid</option>';
      return;
    }

    // 2) Tentukan default (fallback = 1)
    let paketDefault = 1;

    // 3) Ambil riwayat peserta (opsional tapi direkomendasikan)
    try {
      const resHasil = await fetch('https://opensheet.elk.sh/1sW3Yw1Ge_6yibNqXXvpyIzGgzrOnMzIePfIjqCHbqM0/DATANILAI');
      if (resHasil.ok) {
        const dataHasil = await resHasil.json();

        const riwayat = dataHasil.filter(r =>
          (r["email"] || "").trim().toLowerCase() === email &&
          (r["mapel"] || "").trim().toLowerCase() === mapel &&
          (r["bab"] || "").trim().toLowerCase() === bab
        );

        let maxPaket = 0;
        for (const r of riwayat) {
          const p = parseInt(r["paket"], 10);
          if (!isNaN(p) && p > maxPaket) maxPaket = p;
        }

        paketDefault = maxPaket + 1; // inti progres
      }
    } catch (e) {
      console.warn("Gagal ambil riwayat, fallback ke paket 1");
    }

    // 4) Render semua paket (tidak di-lock)
    paketInput.innerHTML = '<option value="">Pilih Paket</option>';

    for (let i = 1; i <= jumlahPaket; i++) {
      const opt = document.createElement("option");
      opt.value = String(i);
      opt.textContent = `Paket ${i}`;

      if (i === paketDefault && paketDefault <= jumlahPaket) {
        opt.selected = true; // set default
      }

      paketInput.appendChild(opt);
    }

    // 5) Final set value (memastikan default benar-benar terpilih)
    if (paketDefault <= jumlahPaket) {
      paketInput.value = String(paketDefault);
    } else {
      // Semua paket sudah dikerjakan → tidak memaksa pilihan
      paketInput.value = "";
      console.info("Semua paket sudah dikerjakan");
    }

  } catch (err) {
    console.error("Gagal memuat paket:", err);
    paketInput.innerHTML = '<option value="">Gagal memuat paket</option>';
  }
}

// URL sheet menggunakan OpenSheet
const pesertaSheetURL = "https://opensheet.elk.sh/18mQe0-u4ma9mEemc5L6zN6AWe6IbfopdDIlhUKM1WEE/PESERTA";

// Fungsi validasi password berdasarkan email
function validatePassword() {
  const email = emailInput.value.trim();
  const enteredPassword = passwordInput.value.trim();

  if (!email || !enteredPassword) {
    passwordMessage.textContent = "";
    startBtn.disabled = true;
    return;
  }

  fetch(pesertaSheetURL)
    .then(response => response.json())
    .then(data => {
      const user = data.find(row => row["Email"]?.trim().toLowerCase() === email.toLowerCase());

      if (!user) {
        passwordMessage.textContent = "Email tidak ditemukan.";
        startBtn.disabled = true;
      } else if (user["Password"]?.trim() === enteredPassword) {
        passwordMessage.textContent = "";
        startBtn.disabled = false;
      } else {
        passwordMessage.textContent = "SALAH PASSWORD";
        startBtn.disabled = true;
      }
    })
    .catch(error => {
      console.error("Gagal mengambil data password:", error);
      passwordMessage.textContent = "Terjadi kesalahan saat memeriksa password.";
      startBtn.disabled = true;
    });
}

// Event listener saat password atau email berubah
passwordInput.addEventListener("input", validatePassword);
emailInput.addEventListener("input", validatePassword);


function toProperCase(text) {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
startBtn.addEventListener("click",async () => {
  if (window.isTrialMode) {

  if (
    !emailInput.value ||
    !kelasInput.value ||
    !mapelInput.value ||
    !babInput.value ||
    !paketInput.value ||
    !durasiInput.value
  ) {
    alert("Harap lengkapi data terlebih dahulu!");
    return;
  }

} else {

  if (
    !nameInput.value ||
    !emailInput.value ||
    !sekolahInput.value ||
    !kelasInput.value ||
    !mapelInput.value ||
    !babInput.value ||
    !paketInput.value ||
    !durasiInput.value
  ) {
    alert("Harap lengkapi semua data terlebih dahulu!");
    return;
  }

}
//TOMBOL MULAI KUIZ
  try {
  await cekBatasPaketPerHari(); // ✅ Validasi batas 8 paket/hari
  await cekRiwayatKuis();       // ✅ Validasi riwayat sebelumnya
  startQuiz();                  // ✅ Lanjut kuis
  } catch (err) {
    console.warn("Start dibatalkan:", err);
  }
 
  
});


function saveQuizState() {

  sessionStorage.setItem(
    "quizActive",
    "true"
  );

  localStorage.setItem(
    "quizState",

    JSON.stringify({

      email: emailInput.value || "",

      nama: nameInput.value || "",

      sekolah: sekolahInput.value || "",

      kelas: kelasInput.value || "",

      mapel: mapelInput.value || "",

      bab: babInput.value || "",

      paket: paketInput.value || "",

      jumlahSoal:
        document.getElementById("jumlahSoal").value || "",

      durasi:
        durasiInput.value || "",

      current,

      score,

      userAnswers,

      startTime:
        startTime
          ? startTime.getTime()
          : Date.now(),

      questions

    })

  );

}
//MASUK KE HALAMAN KUIZ
function startQuiz() {
  fetchQuestions().then(() => {
  startTime = new Date(); // waktu mulai dicatat di sini  
  // Tampilkan label info peserta

document.getElementById("label-nama-siswa").textContent = (toProperCase(nameInput.value) || '').substring(0, 15);
document.getElementById("label-asal-sekolah").textContent = (sekolahInput.value || '').substring(0, 15);
document.getElementById("label-kelas").textContent = (kelasInput.value || '').substring(0, 15);
document.getElementById("label-nama-paket").textContent = (paketInput.value || '').substring(0, 15);
document.getElementById("label-bab-materi").textContent = (babInput.value || '').substring(0, 15);

  identityForm.style.display = "none";
    quizBox.style.display = "flex";
    userAnswers = Array(questions.length).fill(null);
    createNavigation();
    loadQuestion(0);
    startTimer(parseInt(durasiInput.value));
  });
}

function fetchQuestions() {
  const bab = babInput.value.trim();
  const mapel = mapelInput.value.trim();

  const mappingUrl = `https://opensheet.elk.sh/15R8bAIdfe9kGQu__Uois7Myc0fFY9rPzP5KBKZjxkY0/Sheet2`;

  console.log("Memfetch mapping dari:", mappingUrl);

  return fetch(mappingUrl)
    .then(mappingResponse => mappingResponse.json())
    .then(mappingData => {
      console.log("Data mapping:", mappingData);

      // Sesuaikan dengan nama kolom baru
      const mapping = mappingData.find(row => row["Nama File"] === mapel);

      if (!mapping) {
        alert(`❌ Nama file "${mapel}" tidak ditemukan di data mapping.`);
        throw new Error('Nama file tidak ditemukan');
      }

      console.log("Spreadsheet ID ditemukan:", mapping["ID File"]);

      const spreadsheetId = mapping["ID File"];
      const soalUrl = `https://opensheet.elk.sh/${spreadsheetId}/${bab}`;

      console.log("URL soal:", soalUrl);

      return fetch(soalUrl);
    })
    .then(soalResponse => soalResponse.json())
    .then(soalData => {
      console.log("Data soal:", soalData);

      const paketKe = parseInt(paketInput.value);
      const soalPerPaket = parseInt(document.getElementById("jumlahSoal").value) || 0;
      const startIndex = 1 + (paketKe - 1) * soalPerPaket;
      const endIndex = startIndex + soalPerPaket;
      const slicedData = soalData.slice(startIndex, endIndex);

      questions = slicedData.map(row => {
        const keyMap = { A: "1", B: "2", C: "3", D: "4", E: "5" };
        const answerKey = keyMap[row.Kunci?.toUpperCase()] || "1";

        const rawOptions = [
          {
            key: "1",
            value: row.Option1,
            explanation: row.PenjelasanOpsiA,
            image: row["GambarOpsiA"] || null
          },
          {
            key: "2",
            value: row.Option2,
            explanation: row.PenjelasanOpsiB,
            image: row["GambarOpsiB"] || null
          },
          {
            key: "3",
            value: row.Option3,
            explanation: row.PenjelasanOpsiC,
            image: row["GambarOpsiC"] || null
          },
          {
            key: "4",
            value: row.Option4,
            explanation: row.PenjelasanOpsiD,
            image: row["GambarOpsiD"] || null
          },
          {
            key: "5",
            value: row.Option5,
            explanation: row.PenjelasanOpsiE,
            image: row["GambarOpsiE"] || null
          }
        ].filter(opt => opt.value);

        const shuffled = rawOptions.sort(() => Math.random() - 0.5);

        const labeledOptions = shuffled.map((opt, index) => ({
          ...opt,
          label: String.fromCharCode(65 + index) // A-E
        }));

        const formattedExplanation = labeledOptions.map(opt => {
          const icon = opt.key === answerKey ? "✅" : "❌";
          return `${icon} <strong>Pilihan ${opt.label}</strong><br> ${opt.explanation}`;
        }).join("<br><br>");

        return {
          question: row.Soal,
          image: row["gambar soal"] || null,
          options: labeledOptions,
          answer: answerKey,
          explanation: formattedExplanation,
          pembahasanImageUrl: row["gambar penyelesaian"] || null
        };
      });
    })
    .catch(err => {
      console.error('Error detail:', err);
      alert(`❌ Gagal mengambil soal. Pastikan data tersedia dan formatnya benar.`);
    });
}

//MEMBUAT TOMBOL NAVIGASI SOAL
function createNavigation() {
  navigation.innerHTML = "";

  // Tambahkan tombol nomor soal
  
  questions.forEach((_, i) => {
    const btn = document.createElement("button");
    btn.id = `nav-btn-${i}`;
    btn.textContent = i + 1;
    btn.addEventListener("click", () => loadQuestion(i));
    navigation.appendChild(btn);
  });

  // Kontainer untuk tombol navigasi bawah
 // Baris 1: KEMBALI dan LANJUT
const navTopRow = document.createElement("div");
navTopRow.className = "nav-controls";

const backBtn = document.createElement("button");
backBtn.textContent = "⬅️ KEMBALI";
backBtn.addEventListener("click", () => {
  if (current > 0) loadQuestion(current - 1);
});

const nextBtn = document.createElement("button");
nextBtn.textContent = "LANJUT ➡️";
nextBtn.addEventListener("click", () => {
  if (current < questions.length - 1) loadQuestion(current + 1);
});

navTopRow.appendChild(backBtn);
navTopRow.appendChild(nextBtn);

// Baris 2: REFRESH dan SELESAI
const navBottomRow = document.createElement("div");
navBottomRow.className = "nav-controls";

const refreshBtn = document.createElement("button");
refreshBtn.textContent = "🔄 REFRESH";
refreshBtn.addEventListener("click", () => {
  const konfirmasi = confirm("Kembali ke halaman identitas? Semua jawaban akan hilang.");
  if (konfirmasi) {
    clearInterval(timerInterval); // hentikan timer
    quizBox.style.display = "none";
    identityForm.style.display = "block";
    navigation.innerHTML = ""; // bersihkan navigasi soal
    userAnswers = [];
    score = 0;
    current = 0;
    scoreEl.textContent = "Skor: 0";
    timerEl.textContent = "00:00";
  }

});

const finishBtn = document.createElement("button");
finishBtn.textContent = "✅ KELUAR";
finishBtn.addEventListener("click", () => {
  const yakin = confirm("Yakin ingin keluar dari aplikasi?");
  if (yakin) {
     window.open('', '_self');
      window.location.href = "https://google.com";
  }
});

navBottomRow.appendChild(refreshBtn);
navBottomRow.appendChild(finishBtn);

// Tambahkan keduanya ke navigasi
navigation.appendChild(navTopRow);
navigation.appendChild(navBottomRow);
}

//ACAK OPTION SOAL
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

//MULAI TAMPILKAN SOAL
function loadQuestion(index) {
  current = index;
  saveQuizState();
  // Reset semua tombol navigasi
document.querySelectorAll("#navigation button").forEach(btn => {
  btn.classList.remove("active");
});

// Tandai tombol soal yang sedang dibuka
const navBtn = document.getElementById(`nav-btn-${index}`);
if (navBtn) {
  navBtn.classList.add("active");

  // Jika BELUM dijawab, pastikan tetap hijau (bukan biru)
  if (userAnswers[index] === null) {
    navBtn.classList.remove("answered");
  }
}

  const q = questions[current];
  const currentAnswer = userAnswers[current];

  questionEl.innerHTML = `
    <h3>Nomor ${index + 1}</h3>
    ${q.image ? `<img src="${q.image}" alt="Gambar Soal" style="max-width: 50%; margin: 10px 0;" />` : ""}
    <div class="soal-teks">${renderMarkdown(q.question)}</div>
  `;
  optionsEl.innerHTML = "";
  feedbackEl.innerHTML = "";

  q.options.forEach((opt) => {
    const label = document.createElement("label");
    label.innerHTML = `
      <input type="radio" name="option" value="${opt.key}" data-label="${opt.label}" ${isReadonlyMode ? "disabled" : ""}>
      ${opt.label}. <span class="option-text">${renderMarkdown(opt.value)}</span>
      ${opt.image ? `<br><img src="${opt.image}" alt="Gambar Opsi" style="max-width: 100px; margin-top: 5px;">` : ""}
    `;
    optionsEl.appendChild(label);
  });
  
  const inputs = optionsEl.querySelectorAll("input");
  
  if (currentAnswer !== null) {
    showAnswerResult(q, currentAnswer, inputs, current);
  } else if (!isReadonlyMode) {
    inputs.forEach(input => {
      input.addEventListener("click", () => {
        const userConfirmed = confirm("Apakah kamu yakin dengan jawabanmu?");
        if (!userConfirmed) {
          input.checked = false;
          return;
        }
        
        const selectedKey = input.value;
        const isCorrect = selectedKey === q.answer;
        
        userAnswers[current] = {
          isCorrect,
          selectedKey
        };

        if (isCorrect) {
          score++;
          scoreEl.textContent = `Skor: ${score}`;
        }

        inputs.forEach(inp => inp.disabled = true);
        document.getElementById(`nav-btn-${current}`).classList.add("answered");

        showAnswerResult(q, userAnswers[current], inputs, current);
        saveQuizState();
        if (userAnswers.every(ans => ans !== null)) {
          clearInterval(timerInterval);
          showSummary();
        }
      });
    });
  }
}


function showAnswerResult(q, answerObj, inputs, index) {
  const { isCorrect, selectedKey } = answerObj;

  inputs.forEach(input => {
    const isSelected = input.value === selectedKey;
    const isCorrectAnswer = input.value === q.answer;

    input.disabled = true;

    if (isCorrectAnswer) {
      input.closest("label").classList.add("correct"); // Hijau
    }

    if (isSelected && !isCorrectAnswer) {
      input.closest("label").classList.add("selected"); // Merah
    }

    if (isSelected) {
      input.checked = true;
    }
  });

  // Warna tombol navigasi
  const navBtn = document.getElementById(`nav-btn-${index}`);
  if (navBtn) {
    navBtn.classList.remove("answered");
    navBtn.classList.add(isCorrect ? "correct-answer" : "wrong-answer");
  }

  // Tampilkan feedback dan pembahasan
  feedbackEl.innerHTML = `
    <span style="font-size: 24px;">${isCorrect ? "✅ Benar!" : "❌ Salah!"}</span><br>
    ${q.pembahasanImageUrl ? `<img src="${q.pembahasanImageUrl}" alt="Gambar Pembahasan" style="max-width: 50%; height: auto; margin-top: 10px;"><br>` : ""}
    <strong style="display: block; margin-top: 20px;">Pembahasan:</strong><br>
    <p style="margin-top: 0px;">${q.explanation}</p>
  `;
  feedbackEl.style.color = isCorrect ? "green" : "green";
}





function startTimer(duration) {
  let timeLeft = duration * 60;
  updateTimer(timeLeft);
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer(timeLeft);
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      showSummary();
    }
  }, 1000);
}

function updateTimer(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  timerEl.textContent = `${m}:${s}`;
}

// Fungsi showSummary diperbaiki untuk mengirim hasil ke spreadsheet
function showSummary() {
  const selesai = new Date();
  const durasiMenit = Math.round((selesai - startTime) / 60000);
  const waktuSelesai = selesai.toLocaleString("id-ID");

  const jumlahSoal = questions.length;
  const jumlahBenar = userAnswers.filter(a => a && a.isCorrect).length;
  const jumlahSalah = jumlahSoal - jumlahBenar;
  const nilai = Math.round((jumlahBenar / jumlahSoal) * 100);

  const dataHasil = {
    nama: nameInput.value,
    email: emailInput.value,
    sekolah: sekolahInput.value,
    
    kelas: kelasInput.value,
    mapel: mapelInput.value,
    bab: babInput.value,
    paket: paketInput.value,
    jumlah_soal: jumlahBenar + jumlahSalah,
    benar: jumlahBenar,
    salah: jumlahSalah,
    nilai: nilai,
    waktu_selesai: waktuSelesai,
    durasi: durasiMenit
  };

  console.log("Mengirim data:", dataHasil);

  fetch("https://script.google.com/macros/s/AKfycbwiqaI9IKl2jOgm_iEiwT1SZOW5niPEg0fepR26rLGqeBXvrc2KKdWSuipDmhnC0SZ5/exec", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(dataHasil)
  }).then(() => {
    fetch("https://script.google.com/macros/s/AKfycbwfL1qOAcg2qwY_irdKi938Sm0GwAQgTWYbl0yvJ2wsbocEtEFo-oCr7XLMAd8SYm5UEg/exec", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(dataHasil)
    }).then(() => {
      fetch(`https://opensheet.elk.sh/18mQe0-u4ma9mEemc5L6zN6AWe6IbfopdDIlhUKM1WEE/PESERTA`)
        .then(res => res.json())
        .then(pesertaData => {
          const peserta = pesertaData.find(p => p.Email === dataHasil.email);
          const nomorAyah = peserta["WA Ayah"];
          const nomorIbu = peserta["WA Ibu"];
          const nomorAnak = peserta["WA Anak"];

const pesan = 
`📋 *Laporan Hasil Kuis*
Halo ${dataHasil.nama}...

Berikut hasil kuis yang Ananda kerjakan:

*🧾 Paket Soal*

Kelas           : ${dataHasil.kelas}
Mapel           : ${dataHasil.mapel}
Bab             : ${dataHasil.bab}
Paket           : ${dataHasil.paket}

*📈 Hasil Kuis*
Jumlah Soal     : ${dataHasil.jumlah_soal}
Benar           : ${dataHasil.benar}
Salah           : ${dataHasil.salah}
Nilai           : ${dataHasil.nilai}/100
Selesai         : ${dataHasil.waktu_selesai}
Durasi          : ${dataHasil.durasi} menit

🎉 Terima kasih telah mengikuti kuis ini.

- TEAM BIMBEL ANTIREMED`;

          const kirimWA = (nomor) => {
          if (!nomor) return Promise.resolve();
          const form = new FormData();
          form.append("appkey", "a16356e4-75ea-49ed-acf5-ce26ff3bd27e");
          form.append("authkey", "sHSu8mF0UwmKtbm5Zuvb4JgUF9Bvj9BvcaT1MtHsexywLXhlx8");
          form.append("to", nomor);
          form.append("message", pesan);
          return fetch("https://app.wapanels.com/api/create-message", {
            method: "POST",
            body: form
          });
        };

          Promise.all([kirimWA(nomorAyah), kirimWA(nomorIbu), kirimWA(nomorAnak)])
            .then(() => {
              alert(`Kuis selesai!\nNilai: ${nilai}\nBenar: ${jumlahBenar}, Salah: ${jumlahSalah}`);
              tampilkanLeaderboard();
            }).catch(() => tampilkanLeaderboard());
        }).catch(() => tampilkanLeaderboard());
    });
  });
  localStorage.removeItem("quizState");

sessionStorage.removeItem(
  "quizActive"
);
}


function tampilkanLeaderboard() {
  const leaderboardDiv = document.getElementById("leaderboard");
  const tbody = document.querySelector("#leaderboard-table tbody");

  
  const kelas = document.getElementById("kelas").value;
  const mapel = document.getElementById("mapel").value;
  const bab = document.getElementById("bab").value;
  const paket = document.getElementById("paket").value;

  fetch("https://opensheet.elk.sh/1sW3Yw1Ge_6yibNqXXvpyIzGgzrOnMzIePfIjqCHbqM0/DATANILAI")
    .then(res => {
      if (!res.ok) throw new Error("HTTP error " + res.status);
      return res.json();
    })
    .then(data => {

      const ranking = data
        .filter(row =>
          row.nilai &&
          
          row.kelas === kelas &&
          row.mapel === mapel &&
          row.bab === bab &&
          row.paket === paket
        )
        .map(row => ({
          nama: row.nama,
          sekolah: row.sekolah,
          nilai: parseInt(row.nilai),
          waktu: row.waktu_selesai
        }))
        .sort((a, b) => b.nilai - a.nilai)
        .slice(0, 15);

      tbody.innerHTML = "";

      function sentenceCase(str) {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      }

      document.getElementById("filter-info").innerHTML = `
        <strong>Paket Soal:</strong> 
        
        ${sentenceCase(kelas)}, 
        ${sentenceCase(mapel)}, 
        Bab ${sentenceCase(bab)}, 
        Paket ${sentenceCase(paket)}
      `;

      ranking.forEach((item, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${index + 1}</td>
          <td style="text-align:left;">${item.nama}</td>
          <td>${item.sekolah}</td>
          <td>${item.nilai}</td>
          <td>${item.waktu}</td>
        `;
        tbody.appendChild(tr);
      });

      document.getElementById("quiz-box").style.display = "none";
      leaderboardDiv.style.display = "block";
    })
    .catch(err => {
      console.error("DETAIL ERROR:", err);
      alert("Gagal memuat leaderboard.");
    });
}


//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


document.addEventListener("DOMContentLoaded", () => {
  const exitBtn = document.getElementById("exit-btn");
  if (exitBtn) {
    exitBtn.addEventListener("click", () => {
      if (confirm("Yakin ingin keluar dari aplikasi?")) {
        window.open('', '_self');
        window.location.href = "https://google.com";
        
      }
    });
  }
});
async function cekRiwayatKuis() {
  const url = "https://opensheet.elk.sh/1sW3Yw1Ge_6yibNqXXvpyIzGgzrOnMzIePfIjqCHbqM0/DATANILAI";
  const email = emailInput.value.trim();
  
  const sekolah = sekolahInput.value;
  const kelas = kelasInput.value;
  const mapel = mapelInput.value;
  const bab = babInput.value;
  const paket = paketInput.value;

  const data = await fetch(url).then(res => res.json());

  const history = data.filter(row =>
    row.email?.toLowerCase() === email.toLowerCase() &&
    
    row.sekolah === sekolah &&
    row.kelas === kelas &&
    row.mapel === mapel &&
    row.bab === bab &&
    row.paket === paket
  );

  if (history.length >= 3) {
    // Sudah pernah ikut, ambil yang terakhir (asumsi paling bawah paling baru)
    const last = history[history.length - 1];

    isReadonlyMode = true;
     const konfirmasi = confirm("⚠️ Kamu sudah mengikuti kuis ini sebanyak 3 kali.\\nIngin melihat kembali jawaban terakhir dalam mode baca (readonly)?");
  if (!konfirmasi) {
    alert("Silakan kembali ke halaman identitas atau pilih paket lain.");
    throw "BATAL_READONLY";
  }

    await fetchQuestions();
    identityForm.style.display = "none";
    quizBox.style.display = "flex";
    userAnswers = questions.map((q, i) => ({
      isCorrect: true,
      selectedKey: q.answer
    }));
    createNavigation();
    loadQuestion(0);
    throw "SUDAH_DIISI";
  } else {
    isReadonlyMode = false;
  }

}

async function cekBatasPaketPerHari() {
  const url = "https://opensheet.elk.sh/1QvyeKW5f0vnnZnoJTSXAvAz6AoID8kAtrXLZts-c5Y0/DATANILAI";
  const email = emailInput.value.trim().toLowerCase();
  const tanggalHariIni = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
 
  const data = await fetch(url).then(res => res.json());
 
  const hariIni = data.filter(row => {
    const rawDate = row.waktu_selesai;
    if (!rawDate) return false;
 
    let dateObj = new Date(rawDate);
    if (isNaN(dateObj)) {
      // Jika gagal parse, coba manual pakai split format lokal
      const match = rawDate.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
      if (match) {
        const [_, d, m, y] = match;
        dateObj = new Date(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`);
      }
    }
 
if (isNaN(dateObj)) return false; // Tetap tolak jika masih invalid
const rowDate = dateObj.toISOString().slice(0, 10);
    return row.email?.toLowerCase() === email && rowDate === tanggalHariIni;
  });
  alert(`Hari ini kamu sudah mengerjakan ${hariIni.length} paket soal.`);
  if (hariIni.length >= 8) {
    alert("❌ Hari ini kamu sudah selesai mengerjakan batas maksimal 8 paket soal per hari. Bersiaplah belajar kembali untuk hari esok...");
    throw "BATAS_8_PAKET";
  }
}
async function jalankanReviewSoal(email, kelas, mapel, bab, paket) {
  const mappingUrl = `https://opensheet.elk.sh/15R8bAIdfe9kGQu__Uois7Myc0fFY9rPzP5KBKZjxkY0/Sheet2`;
  const hasilUrl = `https://opensheet.elk.sh/1QvyeKW5f0vnnZnoJTSXAvAz6AoID8kAtrXLZts-c5Y0/DATANILAI`;
 
  try {
    const mappingRes = await fetch(mappingUrl);
    const mappingData = await mappingRes.json();
    const map = mappingData.find(row => row["Nama File"] === mapel);
    if (!map) throw new Error("Nama file tidak ditemukan di mapping");
 
    const fileId = map["ID File"];
    const soalRes = await fetch(`https://opensheet.elk.sh/${fileId}/${bab}`);
    const soalData = await soalRes.json();
 
    const hasilRes = await fetch(hasilUrl);
    const hasilData = await hasilRes.json();
    const riwayat = hasilData.filter(row =>
      row.email?.toLowerCase() === email.toLowerCase() &&
      
      row.kelas === kelas &&
      row.mapel === mapel &&
      row.bab === bab &&
      row.paket === paket
    );
 
    if (!riwayat.length) throw new Error("Riwayat tidak ditemukan");
 
    const last = riwayat[riwayat.length - 1];
    const jumlahSoal = parseInt(last.jumlah_soal);
    const startIndex = 1 + (parseInt(paket) - 1) * jumlahSoal;
    const endIndex = startIndex + jumlahSoal;
    const sliced = soalData.slice(startIndex, endIndex);
 
    questions = sliced.map((row, i) => {
      const keyMap = { A: "1", B: "2", C: "3", D: "4", E: "5" };
      const answerKey = keyMap[row.Kunci?.toUpperCase()] || "1";
      const rawOptions = ["Option1", "Option2", "Option3", "Option4", "Option5"]
        .map((k, idx) => ({
          key: String(idx + 1),
          value: row[k],
          explanation: row[`PenjelasanOpsi${String.fromCharCode(65 + idx)}`],
          image: row[`GambarOpsi${String.fromCharCode(65 + idx)}`] || null
        })).filter(opt => opt.value);
 
      const shuffled = rawOptions.sort(() => Math.random() - 0.5);
      const labeled = shuffled.map((opt, i) => ({ ...opt, label: String.fromCharCode(65 + i) }));
      const explanation = labeled.map(opt => `${opt.key === answerKey ? "✅" : "❌"} <strong>${opt.label}</strong><br>${opt.explanation}`).join("<br><br>");
 
      return {
        question: row.Soal,
        image: row["gambar soal"] || null,
        options: labeled,
        answer: answerKey,
        explanation: explanation,
        pembahasanImageUrl: row["gambar penyelesaian"] || null
      };
    });
 
    isReadonlyMode = true;
    userAnswers = questions.map(q => ({ isCorrect: true, selectedKey: q.answer }));
 
    identityForm.style.display = "none";
    quizBox.style.display = "flex";
    createNavigation();
    loadQuestion(0);
 
  } catch (err) {
    alert("❌ Gagal menampilkan soal untuk review: " + err.message);
  }
}
 
// === Panggil otomatis jika mode review aktif ===
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const isReview = urlParams.get("review") === "true";
 
  if (isReview) {
    const bab = urlParams.get("bab") || "";
    const paket = urlParams.get("paket") || "";
    const mapel = urlParams.get("mapel") || "";
    
    const kelas = urlParams.get("kelas") || "";
    const email = urlParams.get("email") || "";
    window.reviewMode = true;
    window.reviewInfo = { bab, paket, mapel, kelas };
 
    // ⏬ Tambahkan ini
    if (email && kelas && mapel && bab && paket) {
      jalankanReviewSoal(email, kelas, mapel, bab, paket);
    } else {
      alert("❌ Data tidak lengkap untuk review soal.");
    }
  }
});

function renderMarkdown(text) {
  if (!text) return "";
  return marked.parse(String(text), { breaks: true });
}
window.addEventListener("load", async () => {

  const saved =
    localStorage.getItem("quizState");

  if (!saved) return;

  const state =
    JSON.parse(saved);

  // RESTORE IDENTITAS
  emailInput.value =
    state.email || "";

  nameInput.value =
    state.nama || "";

  sekolahInput.value =
    state.sekolah || "";

  kelasInput.value =
    state.kelas || "";

  // RESTORE QUIZ
  mapelInput.value =
    state.mapel || "";

  await loadSheetList(state.mapel);

  babInput.value =
    state.bab || "";

  if (
    typeof updatePaketDropdown ===
    "function"
  ) {

    await updatePaketDropdown(
      state.bab
    );

  }

  paketInput.value =
    state.paket || "";

  document.getElementById(
    "jumlahSoal"
  ).value =
    state.jumlahSoal || "";

  durasiInput.value =
    state.durasi || "";

  current =
    state.current || 0;

  score =
    state.score || 0;

  userAnswers =
    state.userAnswers || [];

  questions =
    state.questions || [];

  if (state.startTime) {

    startTime =
      new Date(state.startTime);

  }

  // TAMPILKAN QUIZ
  identityForm.style.display =
    "none";

  quizBox.style.display =
    "flex";

  createNavigation();

  loadQuestion(current);

  scoreEl.textContent =
    `Skor: ${score}`;

});
setInterval(() => {

  const js =
    document.getElementById("jumlahSoal");

  const dr =
    document.getElementById("durasi");

  if (js.value && !js.dataset.done) {

    js.dataset.value = js.value;

    js.type = "text";

    js.value =
      js.dataset.value + " Butir Soal";

    js.dataset.done = "1";

  }

  if (dr.value && !dr.dataset.done) {

    dr.dataset.value = dr.value;

    dr.type = "text";

    dr.value =
      dr.dataset.value + " Menit";

    dr.dataset.done = "1";

  }

}, 300);
document.addEventListener(
  "click",
  function(e){

    if(
      e.target.id ===
      "btn-metode-bayar"
    ){

      document
        .querySelectorAll(
          ".halaman,.halaman-konten,#identity-form"
        )
        .forEach(
          el => el.style.display = "none"
        );

      document.getElementById(
  "metode-bayar-page"
).style.display = "block";

    }

  }
);
document.addEventListener(
  "click",
  function (e) {

    if (
      e.target.classList.contains(
        "kembali-btn"
      )
    ) {

      document
        .querySelectorAll(
          ".halaman,.halaman-konten,#identity-form,#quiz-box"
        )
        .forEach(el => {
          el.style.display = "none";
        });

      document
        .getElementById(
          "beranda"
        )
        .style.display = "block";

    }

  }
);
async function loadMenuBelajar() {

  const menu =
    document.getElementById(
      "menu-belajar-dinamis"
    );

  if (!menu) return;

  try {

    const res =
      await fetch(
        "https://opensheet.elk.sh/1DKNM74sV4SAVkOPmeSfCvQWmUxY8RDVrPmW6yuyi6Ww/Sheet1"
      );

    const data =
      await res.json();

    menu.innerHTML = "";

    const daftarMenu =
  [...new Set(
    data.map(row =>
      (Object.values(row)[1] || "")
        .toString()
        .trim()
    )
  )]
  .filter(nama =>
    nama &&
    nama.toUpperCase() !==
    "SOAL TRIAL VERSION"
  )
  .sort((a, b) =>
    a.localeCompare(
      b,
      "id",
      {
        numeric: true,
        sensitivity: "base"
      }
    )
  );

daftarMenu.forEach(nama => {

  const id =
    "belajar-" +
    nama
      .replace(/\s+/g, "-")
      .toLowerCase();

  menu.innerHTML += `
    <li>
      <a
        href="#"
        class="menu-belajar"
        data-target="${id}">
        ${nama}
      </a>
    </li>
  `;

  const tombol =
    [...new Set(
      data
        .filter(row =>
          Object.values(row)[1] === nama
        )
        .map(row =>
          Object.values(row)[2]
        )
    )]
    .filter(Boolean)
    .sort((a, b) =>
      a.localeCompare(
        b,
        "id",
        {
          numeric: true,
          sensitivity: "base"
        }
      )
    )
    .map(item => `
      <button
        class="tombol-3d"
        data-paket="${item}">
        ${item}
      </button>
    `)
    .join("");

  const halaman =
    document.createElement("div");

  halaman.className =
    "halaman-konten";

  halaman.id = id;

  halaman.innerHTML = `
    <h2>${nama}</h2>
    <div class="tombol-kelas-container grid-kelas">
    ${tombol}
    </div>
    

    <button class="kembali-btn">
      KEMBALI
    </button>
  `;

  document.body.appendChild(
    halaman
  );

});
    
await updateInfoPaketTombol();
    document
      .querySelectorAll(
        ".menu-belajar"
      )
      .forEach(link => {

        link.onclick =
          function(e){

            e.preventDefault();

            document
              .querySelectorAll(
                ".halaman,.halaman-konten,#identity-form,#login-page,#signup-page,#metode-bayar-page,#quiz-box,#leaderboard"
              )
              .forEach(
                el =>
                  el.style.display =
                    "none"
              );

            document
              .getElementById(
                this.dataset.target
              )
              .style.display =
                "block";

          };

      });

  } catch(err) {

    console.error(err);

    menu.innerHTML =
      "<li><a href='#'>Gagal memuat</a></li>";

  }

}

document.addEventListener(
  "DOMContentLoaded",
  loadMenuBelajar
);
document.addEventListener("click", function(e){

  const btn =
    e.target.closest(".tombol-3d");

  if (!btn) return;

  const status =
    btn.dataset.status || "BELI PAKET";

  const paket =
    btn.dataset.paket || "";

  // simpan paket yang dipilih
  window.paketDipilih = paket;

  if (status === "OK") {

    document
      .querySelectorAll(
        ".halaman,.halaman-konten,#identity-form,#login-page,#signup-page,#metode-bayar-page,#quiz-box,#leaderboard"
      )
      .forEach(el =>
        el.style.display = "none"
      );

    document
      .getElementById(
        "identity-form"
      )
      .style.display = "block";

  } else {

    document
      .querySelectorAll(
        ".halaman,.halaman-konten,#identity-form,#login-page,#signup-page,#metode-bayar-page,#quiz-box,#leaderboard"
      )
      .forEach(el =>
        el.style.display = "none"
      );

    document
      .getElementById(
        "daftar-paket"
      )
      .style.display = "block";

  }

});
async function updateInfoPaketTombol() {

  const email =
  (window.loggedInEmail || "")
    .trim()
    .toLowerCase();

  try {

    const email =
  (window.loggedInEmail || "")
    .trim()
    .toLowerCase();

    // ====================
    // HARGA PAKET
    // ====================

    const resHarga = await fetch(
      "https://opensheet.elk.sh/1kAxPCGnlXmoz2U8RjoZ1pZCNOHXsWroBte9nVkZMwvg/Sheet1"
    );

    const dataHarga =
      await resHarga.json();

    // ====================
    // STATUS PAKET
    // ====================

    const resStatus = await fetch(
      "https://opensheet.elk.sh/15rUUAyWjGOMrT3Nz1hEbBQgn1OYY0OB-xUx4hHOcnfQ/Sheet2"
    );

    const dataStatus =
      await resStatus.json();

    // ====================
    // DATA PELAJARAN
    // ====================

    const resMapel = await fetch(
      "https://opensheet.elk.sh/1DKNM74sV4SAVkOPmeSfCvQWmUxY8RDVrPmW6yuyi6Ww/Sheet1"
    );

    const dataMapel =
      await resMapel.json();
    // ====================
    // DATA JUMLAH PAKET
    // ====================

    const resPaket = await fetch(
      "https://opensheet.elk.sh/1XzRacvaoHIZsvEqvoUhm4Knm97wEKIvBjjfl4vihxTI/Sheet4"
    );

const dataPaket =
  await resPaket.json();
  console.log("dataPaket", dataPaket);
    // ====================
    // LOOP TOMBOL
    // ====================

    document
      .querySelectorAll(".tombol-3d")
      .forEach(btn => {

        const namaPaket =
  btn.dataset.paket || "";

        // ====================
        // STATUS
        // ====================

        const rowsPaket =
  dataStatus.filter(r =>

    (r.Email || "")
      .trim()
      .toLowerCase() === email

    &&

    (r.Paket || "")
      .trim()
      .toUpperCase()

    ===

    namaPaket.toUpperCase()

  );

const statusRow =
  rowsPaket.sort(
    (a,b) =>
      new Date(b.Tanggal) -
      new Date(a.Tanggal)
  )[0];
        const status =
  (
    email &&
    statusRow &&
    (statusRow.Keaktifan || "")
      .trim()
      .toUpperCase() === "AKTIF" &&
    (statusRow.Permission || "")
      .trim()
      .toUpperCase() === "OK"
  )
    ? "OK"
    : "BELI PAKET";

        // ====================
        // HARGA
        // ====================

        const hargaRow =
          dataHarga.find(r =>

            (Object.values(r)[1] || "")
              .toString()
              .trim()
              .toUpperCase()

            ===

            namaPaket.toUpperCase()

          );

        const starter =
          hargaRow
            ? Object.values(hargaRow)[3]
            : "-";

        const premium =
          hargaRow
            ? Object.values(hargaRow)[4]
            : "-";

        const ultimate =
          hargaRow
            ? Object.values(hargaRow)[5]
            : "-";

        // ====================
        // JUMLAH PELAJARAN
        // ====================

        const jumlahPelajaran =
          dataMapel.filter(r =>

            (r["Folder Level 3"] || "")
              .trim()
              .toUpperCase()

            ===

            namaPaket.toUpperCase()

            &&

            (r["Nama File"] || "")
              .trim() !== ""

          ).length;
          // ====================
// JUMLAH PAKET
// ====================

const rowPaket =
  dataPaket.find(r =>

    (Object.values(r)[0] || "")
      .toString()
      .trim()
      .toUpperCase()

    ===

    namaPaket.toUpperCase()

  );

const jumlahPaket =
  rowPaket
    ? Number(
        Object.values(rowPaket)[1] || 0
      )
    : 0;
        // ====================
        // TAMPILKAN
        // ====================
        btn.dataset.status = status;
        btn.dataset.paket = namaPaket;
        btn.innerHTML = `

          <div class="judul-kelas">

             🎓 ${namaPaket}

            

          </div>

          <div class="harga-kelas">

                    <div>
          📚 ${jumlahPelajaran} Pelajaran
        </div>

        <div>
          📦 ${jumlahPaket} Paket
        </div>

            <div>
              Starter :
              ${starter}
            </div>

            <div>
              Premium :
              ${premium}
            </div>

            <div>
              Ultimate :
              ${ultimate}
            </div>

          </div>
      <div
        style="
          margin-top:10px;
          text-align:center;
        "
      >
        <span
    style="
      padding:6px 12px;
      border-radius:999px;
      background:${
  status==="OK"
    ? "#00c853"
    : "#ff5252"
};
};
      color:white;
      font-weight:bold;
      font-size:12px;
      box-shadow:
        0 3px 10px rgba(0,0,0,.3);
    "
  >
    ${
  status === "OK"
  ? "✅ AKTIF"
  : "🛒 BELI PAKET"
}
  </span>
        `;

      });

  } catch(err) {

    console.error(
      "Gagal memuat info paket",
      err
    );

  }

}
