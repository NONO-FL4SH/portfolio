document.addEventListener('DOMContentLoaded', () => {

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
    const navIndicator = document.querySelector('.nav-indicator');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');

    function moveNavIndicator() {
        const activeLink = document.querySelector('.nav-links a.active');
        if (activeLink && navIndicator) {
            // Hitung posisi relatif tombol terhadap parent ul.nav-links
            const parentLeft = activeLink.parentElement.parentElement.getBoundingClientRect().left;
            const linkLeft = activeLink.getBoundingClientRect().left;
            
            navIndicator.style.width = `${activeLink.offsetWidth}px`;
            navIndicator.style.left = `${linkLeft - parentLeft}px`;
        }
    }

    function highlightNavOnScroll() {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 180;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                        moveNavIndicator(); // Geser indicator secara meluncur
                    }
                });
            }
        });
    }

    // Pemicu Awal
    setTimeout(moveNavIndicator, 100);
    window.addEventListener('scroll', highlightNavOnScroll);
    window.addEventListener('resize', moveNavIndicator);

    // Click handler untuk animasi langsung
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            moveNavIndicator();
        });
    });

});

/* --- 4. FORM SUBMIT HANDLER --- */
function handleFormSubmit() {
    const isIndonesian = document.documentElement.lang === 'id';
    const message = isIndonesian ? 
        'Pesan Anda berhasil terkirim! (Demo)' : 
        'Your message has been sent successfully! (Demo)';
    
    alert(message);
    document.getElementById('contactForm').reset();
}