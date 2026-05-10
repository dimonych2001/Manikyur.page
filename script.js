// Мобильное меню
const menuBtn = document.querySelector('.mobile-menu');
const navUl = document.querySelector('nav ul');
if (menuBtn && navUl) {
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navUl.classList.toggle('show');
    });
    navUl.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navUl.classList.remove('show');
        });
    });
    document.addEventListener('click', (e) => {
        if (!navUl.contains(e.target) && !menuBtn.contains(e.target)) {
            navUl.classList.remove('show');
        }
    });
}

// Плавный скролл к секциям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Эффект появления при скролле
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Изменение хедера при скролле и подсветка активной ссылки
window.addEventListener('scroll', () => {
    const header = document.getElementById('main-header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    document.querySelectorAll('nav ul li a').forEach(link => {
        link