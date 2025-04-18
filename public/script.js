const vid = document.getElementById("myVideo");
let isSweetAlertConfirmed = false;
let selectedTime = 1000;

const greetings = {
  pagi: { imageUrl: "https://i.top4top.io/p_33696mc780.gif" },
  siang: { imageUrl: "https://a.top4top.io/p_3389hqekz0.gif" },
  sore: { imageUrl: "https://example.com/sore.jpg" },
  malam: { imageUrl: "https://c.top4top.io/p_3369zeh1k0.gif" }
};

async function mulai() {
  const { title, text, imageUrl } = getGreeting();
  await Swal.fire({
    title: title,
    text: text,
    imageUrl: imageUrl,
    imageWidth: 100,
    imageHeight: 100,
    imageAlt: "Gambar Sambutan",
    confirmButtonText: 'OKE'
  });
  isSweetAlertConfirmed = true;
  setTimeout(showDiv, 500);
  vid.play();
  if (isSweetAlertConfirmed) {
    setTimeout(() => document.getElementById("content").style.opacity = 1, selectedTime);
  }
}

function getGreeting() {
  const hours = new Date().getHours();
  if (hours >= 6 && hours < 12) return { title: "Selamat Pagi", ...greetings.pagi };
  if (hours >= 12 && hours < 18) return { title: "Selamat Siang", ...greetings.siang };
  if (hours >= 18 && hours < 21) return { title: "Selamat Sore", ...greetings.sore };
  return { title: "Selamat Malam", ...greetings.malam };
}

function showDiv() {
  setTimeout(() => {
    document.getElementById("bgv").style.background = 'rgba(0, 0, 0, 0.5)';
  }, 50);
}

function toggleMenu(action) {
  const menu = document.getElementById("menu");
  const open = document.getElementById("open");
  if (action === 'open') {
    setTimeout(() => {
      menu.style.display = 'flex';
      setTimeout(() => {
        menu.classList.remove('hide');
        menu.classList.add('show');
      }, 10);
    }, 10);
    open.style.display = 'none';
  } else {
    menu.classList.remove('show');
    menu.classList.add('hide');
    setTimeout(() => {
      menu.style.display = 'none';
      open.style.display = 'block';
    }, 300);
  }
}

const radios = document.querySelectorAll('input[name="video"]');
const videoDisplay = document.getElementById('myVideo');

function saveVideoChoice(value, time) {
  localStorage.setItem('selectedVideo', value);
  localStorage.setItem('selectedTime', time);
}

function loadVideoChoice() {
  const savedVideo = localStorage.getItem('selectedVideo');
  const savedTime = parseInt(localStorage.getItem('selectedTime')) || 1000;
  selectedTime = savedTime;
  if (savedVideo) {
    videoDisplay.querySelector('source').src = savedVideo;
    videoDisplay.load();
    document.querySelector(`input[value="${savedVideo}"]`).checked = true;
    if (isSweetAlertConfirmed) {
      setTimeout(() => document.getElementById("content").style.opacity = 1, savedTime);
    }
  }
}

radios.forEach(radio => {
  radio.addEventListener('change', function () {
    const selectedVideo = this.value;
    selectedTime = parseInt(this.getAttribute('data-time')) || 1000;
    videoDisplay.querySelector('source').src = selectedVideo;
    videoDisplay.load();
    videoDisplay.play();
    saveVideoChoice(selectedVideo, selectedTime);
    if (isSweetAlertConfirmed) {
      setTimeout(() => document.getElementById("content").style.opacity = 1, selectedTime);
    }
  });
});

document.getElementById("codeForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const code = document.querySelector('input[name="code"]').value;

  try {
    const response = await fetch('/check-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `code=${encodeURIComponent(code)}`
    });

    if (response.ok) {
      window.location.href = response.url;
    } else {
      const result = await response.json();
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: result.error || 'Kode tidak ditemukan!'
      });
    }
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Server Error',
      text: 'Terjadi kesalahan di server!'
    });
  }
});

loadVideoChoice();
mulai();