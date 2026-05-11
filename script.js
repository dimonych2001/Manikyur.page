// Мобильное меню
const menuBtn = document.querySelector('.mobile-menu');
const navUl = document.querySelector('nav ul');
if (menuBtn && navUl) {
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navUl.classList.toggle('show');
    });
    navUl.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => navUl.classList.remove('show'));
    });
    document.addEventListener('click', (e) => {
        if (!navUl.contains(e.target) && !menuBtn.contains(e.target)) {
            navUl.classList.remove('show');
        }
    });
}

// Плавный скролл
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// Эффект появления
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Хедер при скролле
window.addEventListener('scroll', () => {
    const header = document.getElementById('main-header');
    if (window.scrollY > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
});

// Canvas
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    for (let i = 0; i < 30; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.2,
            speedY: Math.random() * 0.3 + 0.1,
            opacity: Math.random() * 0.3 + 0.05
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

// Отзывы
let reviews = JSON.parse(localStorage.getItem('nailReviews') || '[]');
const defaultReviews = [
    { id: 1, name: 'Анна К.', service: 'Классический маникюр', rating: 5, text: 'Безупречное качество! Ногти выглядят так аккуратно, что хочется любоваться ими постоянно.', date: '15.12.2024' },
    { id: 2, name: 'Марина С.', service: 'Аппаратный педикюр', rating: 5, text: 'После спа-педикюра ножки как новые! Очень деликатная работа.', date: '20.12.2024' },
    { id: 3, name: 'Елена Н.', service: 'Дизайн ногтей', rating: 5, text: 'Дизайнерский нейл-арт просто фантастика! Получила тысячу комплиментов.', date: '05.01.2025' },
    { id: 4, name: 'Ирина П.', service: 'Наращивание ногтей', rating: 5, text: 'Наращиваю ногти третий раз — держатся отлично, выглядят очень естественно.', date: '10.01.2025' },
    { id: 5, name: 'Дарья В.', service: 'SPA-уход для рук', rating: 5, text: 'Парафинотерапия и массаж рук — это наслаждение! Вернусь обязательно.', date: '15.01.2025' }
];
if (reviews.length === 0) {
    reviews = defaultReviews;
    localStorage.setItem('nailReviews', JSON.stringify(reviews));
}

function renderReviews() {
    const container = document.getElementById('reviews-grid');
    const emojis = { 'Классический маникюр': '✨', 'Аппаратный педикюр': '🦶', 'Дизайн ногтей': '🎨', 'Наращивание ногтей': '💎', 'SPA-уход для рук': '🌿' };
    container.innerHTML = reviews.slice().reverse().map(r => `
        <div class="review-card" data-id="${r.id}">
            <button class="delete-review" onclick="deleteReview(${r.id})"><i class="fas fa-times"></i></button>
            <span class="service-badge">${emojis[r.service] || '💅'} ${r.service}</span>
            <div class="review-text">${r.text}</div>
            <div class="reviewer">
                <div class="avatar">${r.name.substring(0,2).toUpperCase()}</div>
                <div class="reviewer-info">
                    <div class="reviewer-name">${r.name}</div>
                    <div class="reviewer-meta">
                        <span class="stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</span>
                        <span class="platform">${r.date}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function deleteReview(id) {
    if (confirm('Удалить отзыв?')) {
        reviews = reviews.filter(r => r.id !== id);
        localStorage.setItem('nailReviews', JSON.stringify(reviews));
        renderReviews();
    }
}

document.getElementById('review-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const rating = parseInt(document.getElementById('review-rating').value);
    if (rating === 0) { alert('Поставьте оценку!'); return; }
    const newReview = {
        id: Date.now(),
        name: document.getElementById('review-name').value.trim(),
        service: document.getElementById('review-service').value,
        rating: rating,
        text: document.getElementById('review-text').value.trim(),
        date: new Date().toLocaleDateString('ru-RU')
    };
    reviews.push(newReview);
    localStorage.setItem('nailReviews', JSON.stringify(reviews));
    this.reset();
    document.getElementById('review-rating').value = 0;
    document.querySelectorAll('.stars-input i').forEach(s => s.className = 'far fa-star');
    document.getElementById('review-form-container').style.display = 'none';
    document.getElementById('show-review-form').style.display = 'block';
    renderReviews();
});

document.getElementById('show-review-form').addEventListener('click', function() {
    document.getElementById('review-form-container').style.display = 'block';
    this.style.display = 'none';
});

document.querySelectorAll('.stars-input i').forEach(star => {
    star.addEventListener('click', function() {
        const r = parseInt(this.dataset.rating);
        document.getElementById('review-rating').value = r;
        document.querySelectorAll('.stars-input i').forEach((s, i) => {
            s.className = i < r ? 'fas fa-star' : 'far fa-star';
        });
    });
});

// Запись
const bookingServices = [
    { name: 'Классический маникюр', price: '1 500 ₽', icon: 'fa-hand-holding-heart', color1: '#E8D5D5', color2: '#D4A5A5' },
    { name: 'Аппаратный педикюр', price: '2 200 ₽', icon: 'fa-feather-alt', color1: '#D4C5C5', color2: '#C9B1B1' },
    { name: 'Дизайн ногтей', price: 'от 500 ₽', icon: 'fa-magic', color1: '#E0D0C8', color2: '#B8A59A' },
    { name: 'Наращивание ногтей', price: '3 000 ₽', icon: 'fa-gem', color1: '#E8DDD8', color2: '#D4C5C0' },
    { name: 'SPA-уход для рук', price: '1 800 ₽', icon: 'fa-hot-tub', color1: '#F0E6E0', color2: '#E0D0C8' }
];

let selService = null, selDay = null, selTime = null;

function renderServices() {
    const grid = document.getElementById('booking-services');
    grid.innerHTML = '';
    bookingServices.forEach(s => {
        const card = document.createElement('div');
        card.className = 'booking-service-card';
        card.innerHTML = `<div class="check-mark"><i class="fas fa-check"></i></div>
            <div class="service-icon" style="background:linear-gradient(135deg,${s.color1},${s.color2})"><i class="fas ${s.icon}"></i></div>
            <div class="service-name">${s.name}</div><div class="service-price">${s.price}</div>`;
        card.addEventListener('click', () => {
            document.querySelectorAll('.booking-service-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selService = s;
            document.getElementById('selected-service-info').innerHTML = `<i class="fas ${s.icon}"></i><span>${s.name} — ${s.price}</span><button class="change-btn" onclick="resetBooking()">Изменить</button>`;
            genDays();
            document.getElementById('step-day').style.display = 'block';
            document.getElementById('step-time').style.display = 'none';
            document.getElementById('step-form').style.display = 'none';
        });
        grid.appendChild(card);
    });
}

function resetBooking() {
    document.querySelectorAll('.booking-service-card').forEach(c => c.classList.remove('selected'));
    selService = selDay = selTime = null;
    document.getElementById('step-day').style.display = 'none';
    document.getElementById('step-time').style.display = 'none';
    document.getElementById('step-form').style.display = 'none';
}

function genDays() {
    const grid = document.getElementById('days-grid');
    grid.innerHTML = '';
    const now = new Date();
    const days = ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];
    const months = ['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'];
    for (let i = 0; i < 14; i++) {
        const d = new Date(now); d.setDate(now.getDate() + i);
        const btn = document.createElement('button');
        btn.className = 'day-btn';
        btn.innerHTML = `<span class="day-name">${days[d.getDay()]}</span><span class="day-date">${d.getDate()} ${months[d.getMonth()]}</span>`;
        btn.dataset.f = `${d.getDate()} ${months[d.getMonth()]}, ${days[d.getDay()]}`;
        btn.addEventListener('click', () => {
            document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selDay = btn.dataset.f;
            genTimes();
        });
        grid.appendChild(btn);
    }
}

function genTimes() {
    const grid = document.getElementById('time-grid');
    grid.innerHTML = '';
    ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'].forEach(t => {
        const btn = document.createElement('button');
        btn.className = 'time-btn'; btn.textContent = t;
        btn.addEventListener('click', () => {
            document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selTime = t;
            document.getElementById('booking-summary').innerHTML = `
                <div class="summary-row"><span class="summary-label">Услуга</span><span class="summary-value">${selService.name}</span></div>
                <div class="summary-row"><span class="summary-label">Дата</span><span class="summary-value">${selDay}</span></div>
                <div class="summary-row"><span class="summary-label">Время</span><span class="summary-value">${selTime}</span></div>
                <div class="summary-row"><span class="summary-label">Стоимость</span><span class="summary-value">${selService.price}</span></div>`;
            document.getElementById('step-form').style.display = 'block';
            document.getElementById('success-message').style.display = 'none';
            document.getElementById('booking-form').style.display = 'block';
        });
        grid.appendChild(btn);
    });
    document.getElementById('step-time').style.display = 'block';
    document.getElementById('step-form').style.display = 'none';
}

document.getElementById('booking-form').addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById('booking-form').style.display = 'none';
    document.getElementById('success-message').style.display = 'block';
});

document.getElementById('new-booking-btn').addEventListener('click', () => {
    resetBooking();
    document.getElementById('success-message').style.display = 'none';
    document.getElementById('booking-form').style.display = 'block';
    document.getElementById('booking-name').value = '';
    document.getElementById('booking-phone').value = '';
});

renderServices();
renderReviews();