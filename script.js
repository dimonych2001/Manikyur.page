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
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// Canvas фон с мягкими частицами
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

// ========== Логика записи ==========
const serviceSelect = document.getElementById('service-select');
const daysGrid = document.getElementById('days-grid');
const timeStep = document.getElementById('time-step');
const timeGrid = document.getElementById('time-grid');
const formStep = document.getElementById('form-step');
const selectedServiceInput = document.getElementById('selected-service');
const selectedDatetimeInput = document.getElementById('selected-datetime');
const bookingForm = document.getElementById('booking-form');
const successMessage = document.getElementById('success-message');

let selectedService = '';
let selectedDay = '';
let selectedTime = '';

// Генерация дней (ближайшие 14 дней)
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
        dayBtn.dataset.date = date.toISOString().split('T')[0];
        dayBtn.dataset.formatted = `${date.getDate()} ${monthNames[date.getMonth()]}, ${dayNames[date.getDay()]}`;
        
        dayBtn.addEventListener('click', () => {
            document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('selected'));
            dayBtn.classList.add('selected');
            selectedDay = dayBtn.dataset.formatted;
            selectedDatetimeInput.value = '';
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
        timeBtn.dataset.time = time;
        
        timeBtn.addEventListener('click', () => {
            document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('selected'));
            timeBtn.classList.add('selected');
            selectedTime = time;
            selectedDatetimeInput.value = `${selectedDay}, ${selectedTime}`;
            formStep.style.display = 'block';
            formStep.scrollIntoView({ behavior: 'smooth' });
        });
        
        timeGrid.appendChild(timeBtn);
    });
    
    timeStep.style.display = 'block';
    timeStep.scrollIntoView({ behavior: 'smooth' });
    formStep.style.display = 'none';
    successMessage.style.display = 'none';
    bookingForm.style.display = 'block';
}

// Обработчик выбора услуги
serviceSelect.addEventListener('change', () => {
    selectedService = serviceSelect.value;
    if (selectedService) {
        selectedServiceInput.value = selectedService;
        generateDays();
        timeStep.style.display = 'none';
        formStep.style.display = 'none';
        successMessage.style.display = 'none';
        bookingForm.style.display = 'block';
        selectedDay = '';
        selectedTime = '';
        selectedDatetimeInput.value = '';
        document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('selected'));
        document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('selected'));
    } else {
        daysGrid.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 20px;">Сначала выберите услугу выше ↑</p>';
        timeStep.style.display = 'none';
        formStep.style.display = 'none';
    }
});

// Отправка формы
bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    bookingForm.style.display = 'none';
    successMessage.style.display = 'block';
    successMessage.scrollIntoView({ behavior: 'smooth' });
});