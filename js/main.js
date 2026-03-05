(function() {
    'use strict';

    // -- Mobile Menu --
    var navToggle = document.querySelector('.nav-toggle');
    var navMenu = document.querySelector('.nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            var expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !expanded);
        });
        navMenu.querySelectorAll('.nav-link').forEach(function(link) {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
        // Close menu on outside click
        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // -- Sticky Navbar --
    var navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });
    }

    // -- Smooth Scroll --
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // -- Scroll Animations --
    var animElements = document.querySelectorAll('[data-animate]');
    if (animElements.length > 0 && 'IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        animElements.forEach(function(el) { observer.observe(el); });
    }

    // -- Contact Form --
    var form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var btn = form.querySelector('button[type="submit"]');
            var origText = btn.textContent;
            btn.textContent = 'Odesílání…';
            btn.disabled = true;
            setTimeout(function() {
                btn.textContent = 'Odesláno ✓';
                btn.style.background = '#16a34a';
                btn.style.borderColor = '#16a34a';
                form.reset();
                setTimeout(function() {
                    btn.textContent = origText;
                    btn.style.background = '';
                    btn.style.borderColor = '';
                    btn.disabled = false;
                }, 2500);
            }, 1000);
        });
    }

    // -- Cookie Banner --
    var banner = document.querySelector('.cookie-banner');
    if (banner && !localStorage.getItem('cookies-consent')) {
        banner.hidden = false;
    }
    var acceptBtn = document.getElementById('cookie-accept');
    var rejectBtn = document.getElementById('cookie-reject');
    if (acceptBtn) acceptBtn.addEventListener('click', function() { localStorage.setItem('cookies-consent', 'accepted'); banner.hidden = true; });
    if (rejectBtn) rejectBtn.addEventListener('click', function() { localStorage.setItem('cookies-consent', 'rejected'); banner.hidden = true; });

    // -- Scroll to Top --
    var scrollTopBtn = document.querySelector('.scroll-top');
    if (scrollTopBtn) {
        window.addEventListener('scroll', function() {
            scrollTopBtn.classList.toggle('visible', window.scrollY > 600);
        }, { passive: true });
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // -- City Accordion (stores page) --
    document.querySelectorAll('.city-header').forEach(function(header) {
        header.addEventListener('click', function() {
            var content = this.nextElementSibling;
            var isActive = this.classList.contains('active');
            this.classList.toggle('active');
            content.classList.toggle('active');
            this.setAttribute('aria-expanded', !isActive);
        });
    });

    // -- Lightbox --
    var lightbox = document.getElementById('lightbox');
    if (lightbox) {
        var lbImg = lightbox.querySelector('img');
        var galleryImages = [];
        var currentIndex = 0;

        document.querySelectorAll('.store-gallery img').forEach(function(img) {
            img.addEventListener('click', function() {
                galleryImages = Array.from(this.closest('.store-gallery').querySelectorAll('img'));
                currentIndex = galleryImages.indexOf(this);
                lbImg.src = this.src;
                lbImg.alt = this.alt;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
                updateNav();
            });
        });

        function updateNav() {
            lightbox.querySelector('.lightbox-prev').style.display = galleryImages.length > 1 ? '' : 'none';
            lightbox.querySelector('.lightbox-next').style.display = galleryImages.length > 1 ? '' : 'none';
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        function navigate(dir) {
            currentIndex = (currentIndex + dir + galleryImages.length) % galleryImages.length;
            lbImg.src = galleryImages[currentIndex].src;
            lbImg.alt = galleryImages[currentIndex].alt;
        }

        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox-prev').addEventListener('click', function(e) { e.stopPropagation(); navigate(-1); });
        lightbox.querySelector('.lightbox-next').addEventListener('click', function(e) { e.stopPropagation(); navigate(1); });
        lightbox.addEventListener('click', function(e) { if (e.target === lightbox) closeLightbox(); });
        document.addEventListener('keydown', function(e) {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigate(-1);
            if (e.key === 'ArrowRight') navigate(1);
        });
    }

})();
