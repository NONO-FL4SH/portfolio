document.addEventListener('DOMContentLoaded', () => {

    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    /* --- INITIALIZE EMAILJS --- */
    emailjs.init("YOUR_PUBLIC_KEY"); 

    /* --- 1. LANGUAGE SWITCHER LOGIC --- */
    const langBtns = document.querySelectorAll('.lang-btn');
    let currentLang = 'id';

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedLang = btn.getAttribute('data-lang');
            if (selectedLang === currentLang) return;

            currentLang = selectedLang;
            langBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            document.documentElement.lang = currentLang;

            const translatableElements = document.querySelectorAll('[data-id][data-en]');
            translatableElements.forEach(el => {
                el.textContent = el.getAttribute(`data-${currentLang}`);
            });

            setTimeout(moveNavIndicator, 150);
        });
    });

    /* --- 2. PROJECT FILTER LOGIC --- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    /* --- 3. SLIDING NAV INDICATOR LOGIC --- */
    const navContainer = document.querySelector('.nav-links');
    const navIndicator = document.querySelector('.nav-indicator');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');

    function moveNavIndicator() {
        const activeLink = document.querySelector('.nav-links a.active');
        if (activeLink && navIndicator) {
            const parentLeft = activeLink.parentElement.parentElement.getBoundingClientRect().left;
            const linkLeft = activeLink.getBoundingClientRect().left;
            navIndicator.style.width = `${activeLink.offsetWidth}px`;
            navIndicator.style.left = `${linkLeft - parentLeft}px`;
        }
    }

    function highlightNavOnScroll() {
        if (isSwiping) return; // Mencegah konflik saat user sedang menggeser jari

        const scrollY = window.pageYOffset;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 200;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                        moveNavIndicator();
                    }
                });
            }
        });
    }

    setTimeout(() => {
        window.scrollTo(0, 0);
        moveNavIndicator();
    }, 100);

    window.addEventListener('scroll', highlightNavOnScroll);
    window.addEventListener('resize', moveNavIndicator);

    /* --- 4. TOUCH SWIPE GESTURE FOR FLOATING NAVBAR (HP) --- */
    let touchStartX = 0;
    let currentLeftPos = 0;
    let isSwiping = false;

    if (navContainer) {
        navContainer.addEventListener('touchstart', (e) => {
            isSwiping = true;
            touchStartX = e.touches[0].clientX;
            navIndicator.classList.add('swiping');
            
            const activeLink = document.querySelector('.nav-links a.active');
            if (activeLink) {
                const parentLeft = navContainer.getBoundingClientRect().left;
                currentLeftPos = activeLink.getBoundingClientRect().left - parentLeft;
            }
        }, { passive: true });

        navContainer.addEventListener('touchmove', (e) => {
            if (!isSwiping) return;
            const currentTouchX = e.touches[0].clientX;
            const deltaX = currentTouchX - touchStartX;

            // Batas pergeseran agar indikator tidak melompat keluar dari kapsul
            const maxLeft = navContainer.offsetWidth - navIndicator.offsetWidth - 12;
            let newLeft = currentLeftPos + deltaX;

            if (newLeft < 6) newLeft = 6;
            if (newLeft > maxLeft) newLeft = maxLeft;

            navIndicator.style.left = `${newLeft}px`;
        }, { passive: true });

        navContainer.addEventListener('touchend', (e) => {
            isSwiping = false;
            navIndicator.classList.remove('swiping');

            // Cari tombol/link yang posisinya paling dekat dengan lokasi jari dilepas
            const indicatorRect = navIndicator.getBoundingClientRect();
            const indicatorCenter = indicatorRect.left + (indicatorRect.width / 2);

            let closestLink = navLinks[0];
            let minDistance = Infinity;

            navLinks.forEach(link => {
                const linkRect = link.getBoundingClientRect();
                const linkCenter = linkRect.left + (linkRect.width / 2);
                const distance = Math.abs(indicatorCenter - linkCenter);

                if (distance < minDistance) {
                    minDistance = distance;
                    closestLink = link;
                }
            });

            // Aktifkan link terdekat & scroll halus ke section tujuan
            navLinks.forEach(l => l.classList.remove('active'));
            closestLink.classList.add('active');
            moveNavIndicator();

            const targetId = closestLink.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            moveNavIndicator();
        });
    });

    /* --- 5. EMAILJS FORM SUBMIT HANDLER --- */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const btnSend = document.getElementById('btnSend');
            btnSend.textContent = 'Sending...';

            const templateParams = {
                from_name: document.getElementById('from_name').value,
                reply_to: document.getElementById('reply_to').value,
                message: document.getElementById('message').value
            };

            emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
                .then(() => {
                    alert('Pesan berhasil terkirim ke email Devano!');
                    contactForm.reset();
                    btnSend.textContent = 'Send Message';
                }, (error) => {
                    alert('Gagal mengirim pesan (Demo Mode). Pastikan Service & Template ID sudah dikonfigurasi.');
                    console.error('EmailJS Error:', error);
                    btnSend.textContent = 'Send Message';
                });
        });
    }

});

/* --- 6. MODAL CASE STUDY LOGIC --- */
const projectData = {
    gmb: {
        title: "Dashboard GMB (Google My Business)",
        tag: "Analytics & Monitoring System",
        problem: "Menganalisis performa cabang secara manual memakan waktu lama dan rawan kekeliruan data rekapitulasi.",
        features: [
            "Visualisasi rating & ulasan dari seluruh lokasi cabang",
            "Pelacakan grafik kata kunci pencarian lokal",
            "Fitur export laporan rekap harian/bulanan ke CSV/Excel"
        ]
    },
    h1: {
        title: "Dashboard Penjualan H1",
        tag: "Sales Analytics Platform",
        problem: "Manajemen memerlukan gambaran cepat mengenai pencapaian target penjualan unit harian secara real-time.",
        features: [
            "Grafik tren penjualan harian dan perbandingan bulanan",
            "Leaderboard pencapaian sales team",
            "Analisis rasio kontribusi tipe produk"
        ]
    },
    bengkel: {
        title: "Dashboard Performa Bengkel",
        tag: "Quantitative Operational Metrics",
        problem: "Kesulitan mengukur efisiensi mekanik dan pendapatan unit entry harian secara kuantitatif.",
        features: [
            "Pelacakan volume Unit Entry per jam kerja",
            "Hitung otomatis estimasi pendapatan jasa bengkel",
            "Monitoring durasi pengerjaan servis mekanik"
        ]
    },
    absensi: {
        title: "Dashboard Absensi BEST",
        tag: "Employee Operations System",
        problem: "Pemantauan tingkat kehadiran dan keterlambatan tim masih terpisah di spreadsheet terisolasi.",
        features: [
            "Rekapitulasi persentase kehadiran harian otomatis",
            "Notifikasi visual tingkat keterlambatan karyawan",
            "Filter laporan kehadiran berdasarkan divisi"
        ]
    },
    validation: {
        title: "Customer Validation Monitor",
        tag: "Verification & Compliance Portal",
        problem: "Dokumen konsumen seringkali tercecer dan sulit dipantau status verifikasi kelengkapannya.",
        features: [
            "Indikator status approval dokumen (Pending/Verified/Rejected)",
            "Query data konsumen cepat berbasis nomor ID",
            "Log riwayat pemeriksaan data pelanggan"
        ]
    }
};

function openModal(key) {
    const data = projectData[key];
    if (!data) return;

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="modal-body">
            <h2>${data.title}</h2>
            <span class="modal-tag">${data.tag}</span>
            <h4>Latar Belakang / Tantangan:</h4>
            <p>${data.problem}</p>
            <h4>Fitur & Solusi Utama:</h4>
            <ul>
                ${data.features.map(f => `<li>${f}</li>`).join('')}
            </ul>
        </div>
    `;
    
    document.getElementById('projectModal').classList.add('active');
}

function closeModal(e) {
    if (e.target.classList.contains('modal-overlay')) {
        document.getElementById('projectModal').classList.remove('active');
    }
}

function closeModalDirect() {
    document.getElementById('projectModal').classList.remove('active');
}