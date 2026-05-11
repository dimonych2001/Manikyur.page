// ========== Мобильное меню ==========
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

// ========== Плавный скролл ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ========== Эффект появления ==========
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ========== Хедер и активная ссылка ==========
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
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// ========== Canvas фон ==========
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    for (let i = 0; i < 40; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 4 + 1,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: Math.random() * 0.4 + 0.1,
            opacity: Math.random() * 0.4 + 0.1
        });
    }
}

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 165, 165, ${p.opacity})`;
        ctx.fill();
        p.y -= p.speedY;
        p.x += p.speedX;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.x < -10) p.x = canvas.width + 10;
    });
    requestAnimationFrame(drawParticles);
}

window.addEventListener('resize', initCanvas);
initCanvas();
drawParticles();

// ========== ЛОГИКА ЗАПИСИ ==========
const bookingServices = [
    { name: 'Классический маникюр', price: '1 500 ₽', icon: 'fa-hand-holding-heart', color1: '#E8D5D5', color2: '#D4A5A5' },
    { name: 'Аппаратный педикюр', price: '2 200 ₽', icon: 'fa-feather-alt', color1: '#D4C5C5', color2: '#C9B1B1' },
    { name: 'Дизайн ногтей', price: 'от 500 ₽', icon: 'fa-magic', color1: '#E0D0C8', color2: '#B8A59A' },
    { name: 'Наращивание ногтей', price: '3 000 ₽', icon: 'fa-gem', color1: '#E8DDD8', color2: '#D4C5C0' },
    { name: 'SPA-уход для рук', price: '1 800 ₽', icon: 'fa-hot-tub', color1: '#F0E6E0', color2: '#E0D0C8' }
];

let selectedService = null;
let selectedDay = null;
let selectedTime = null;

const bookingServicesGrid = document.getElementById('booking-services');
const stepDay = document.getElementById('step-day');
const stepTime = document.getElementById('step-time');
const stepForm = document.getElementById('step-form');
const daysGrid = document.getElementById('days-grid');
const timeGrid = document.getElementById('time-grid');
const selectedServiceInfo = document.getElementById('selected-service-info');
const bookingSummary = document.getElementById('booking-summary');
const bookingForm = document.getElementById('booking-form');
const successMessage = document.getElementById('success-message');
const newBookingBtn = document.getElementById('new-booking-btn');

// Генерация карточек услуг
function renderServiceCards() {
    bookingServicesGrid.innerHTML = '';
    bookingServices.forEach((service, index) => {
        const card = document.createElement('div');
        card.className = 'booking-service-card';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <div class="check-mark"><i class="fas fa-check"></i></div>
            <div class="service-icon" style="background: linear-gradient(135deg, ${service.color1}, ${service.color2});">
                <i class="fas ${service.icon}"></i>
            </div>
            <div class="service-name">${service.name}</div>
            <div class="service-price">${service.price}</div>
        `;
        card.addEventListener('click', () => selectService(service, card));
        bookingServicesGrid.appendChild(card);
    });
}

// Выбор услуги
function selectService(service, card) {
    document.querySelectorAll('.booking-service-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedService = service;

    selectedServiceInfo.innerHTML = `
        <i class="fas ${service.icon}"></i>
        <span>${service.name} — ${service.price}</span>
        <button class="change-btn" onclick="changeService()">Изменить</button>
    `;

    generateDays();
    stepDay.style.display = 'block';
    stepTime.style.display = 'none';
    stepForm.style.display = 'none';
    stepDay.scrollIntoView({ behavior: 'smooth' });
}

// Изменить услугу
function changeService() {
    document.querySelectorAll('.booking-service-card').forEach(c => c.classList.remove('selected'));
    selectedService = null;
    selectedDay = null;
    selectedTime = null;
    stepDay.style.display = 'none';
    stepTime.style.display = 'none';
    stepForm.style.display = 'none';
    document.getElementById('step-service').scrollIntoView({ behavior: 'smooth' });
}

// Генерация дней
function generateDays() {
    daysGrid.innerHTML = '';
    const today = new Date();
    const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const monthNames = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

    for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const dayBtn = document.createElement('button');
        dayBtn.className = 'day-btn';
        dayBtn.innerHTML = `
            <span class="day-name">${dayNames[date.getDay()]}</span>
            <span class="day-date">${date.getDate()} ${monthNames[date.getMonth()]}</span>
        `;
        dayBtn.dataset.formatted = `${date.getDate()} ${monthNames[date.getMonth()]}, ${dayNames[date.getDay()]}`;

        dayBtn.addEventListener('click', () => {
            document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('selected'));
            dayBtn.classList.add('selected');
            selectedDay = dayBtn.dataset.formatted;
            generateTimeSlots();
        });

        daysGrid.appendChild(dayBtn);
    }
}

// Генерация времени
function generateTimeSlots() {
    timeGrid.innerHTML = '';
    const times = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

    times.forEach(time => {
        const timeBtn = document.createElement('button');
        timeBtn.className = 'time-btn';
        timeBtn.textContent = time;

        timeBtn.addEventListener('click', () => {
            document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('selected'));
            timeBtn.classList.add('selected');
            selectedTime = time;
            showFormStep();
        });

        timeGrid.appendChild(timeBtn);
    });

    stepTime.style.display = 'block';
    stepForm.style.display = 'none';
    stepTime.scrollIntoView({ behavior: 'smooth' });
}

// Показать форму
function showFormStep() {
    bookingSummary.innerHTML = `
        <div class="summary-row">
            <span class="summary-label">Услуга</span>
            <span class="summary-value">${selectedService.name}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Дата</span>
            <span class="summary-value">${selectedDay}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Время</span>
            <span class="summary-value">${selectedTime}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Стоимость</span>
            <span class="summary-value">${selectedService.price}</span>
        </div>
    `;

    stepForm.style.display = 'block';
    successMessage.style.display = 'none';
    bookingForm.style.display = 'block';
    stepForm.scrollIntoView({ behavior: 'smooth' });
}

// Отправка формы
bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    bookingForm.style.display = 'none';
    successMessage.style.display = 'block';
    successMessage.scrollIntoView({ behavior: 'smooth' });
});

// Сброс формы
newBookingBtn.addEventListener('click', () => {
    changeService();
    stepDay.style.display = 'none';
    stepTime.style.display = 'none';
    stepForm.style.display = 'none';
    successMessage.style.display = 'none';
    bookingForm.style.display = 'block';
    document.getElementById('booking-name').value = '';
    document.getElementById('booking-phone').value = '';
    document.getElementById('step-service').scrollIntoView({ behavior: 'smooth' });
});

// Инициализация
renderServiceCards();