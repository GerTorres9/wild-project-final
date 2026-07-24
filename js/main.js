/**
 * main.js — Wild Project
 * Navbar scroll, active nav link, contadores, filtros, toast de contacto
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    initNavbarScroll();
    setActiveNavLink();
    initCounters();
    initFilterCards();
    initContactForm();
    initScrollTopBtn();
});

// ============================================================
// 2. Navbar — efecto al hacer scroll (clase navbar-scrolled)
// ============================================================
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const onScroll = () => {
        if (window.scrollY > 60) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Estado inicial
}

// ============================================================
// 3. Marcar el link activo de la nav según la URL actual
// ============================================================
function setActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href')?.split('/').pop() || '';
        const isHome = (currentPath === '' || currentPath === 'index.html') && linkPath === 'index.html';
        const isMatch = linkPath && currentPath === linkPath;

        if (isHome || isMatch) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
}

// ============================================================
// 4. Contadores animados (IntersectionObserver)
// ============================================================
function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const animateCounter = (el) => {
        const target = parseInt(el.dataset.counter, 10);
        const duration = 1800;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = Math.floor(current).toLocaleString('es-AR');
        }, 16);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// ============================================================
// 5. Filtro de cards de adopciones por categoría
// ============================================================
function initFilterCards() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.card-animal');
    if (!filterBtns.length || !cards.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Activar botón
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter || 'all';

            cards.forEach(card => {
                const category = card.dataset.category || '';
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'scaleIn 0.4s ease both';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

// ============================================================
// 6. Formulario de contacto + Toast de Bootstrap
// ============================================================
function initContactForm() {
    const form = document.getElementById('form-contacto');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');

            // Scroll al primer campo inválido
            const firstInvalid = form.querySelector(':invalid');
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalid.focus();
            }
            return;
        }

        form.classList.add('was-validated');

        // Mostrar estado de carga en botón
        const btn = form.querySelector('.btn-submit');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Enviando...';
        btn.disabled = true;

        // Simular envío (delay realista)
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            form.reset();
            form.classList.remove('was-validated');
            showToast();
        }, 1500);
    });

    // Validación en tiempo real
    const inputs = form.querySelectorAll('.form-control, .form-select');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.checkValidity()) {
                input.classList.add('is-valid');
                input.classList.remove('is-invalid');
            } else {
                input.classList.add('is-invalid');
                input.classList.remove('is-valid');
            }
        });

        input.addEventListener('input', () => {
            if (input.checkValidity()) {
                input.classList.add('is-valid');
                input.classList.remove('is-invalid');
            }
        });
    });
}

// Mostrar toast de Bootstrap
function showToast() {
    const toastEl = document.getElementById('toast-confirmacion');
    if (!toastEl) return;

    if (typeof bootstrap !== 'undefined') {
        const toast = new bootstrap.Toast(toastEl, {
            delay: 5000,
            autohide: true,
        });
        toast.show();
    }
}

// ============================================================
// 7. Botón "Volver arriba"
// ============================================================
function initScrollTopBtn() {
    const btn = document.getElementById('scroll-top-btn');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
