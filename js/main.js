/* General Website Enhancements */

// --- Modules & Functions --- //

const initSmoothScrolling = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
};

const initMobileMenu = () => {
    const menuIcon = document.querySelector('.header .nav .icon');
    const menuList = document.querySelector('.header .nav ul');

    if (menuIcon && menuList) {
        menuIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            menuList.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!menuList.contains(e.target) && !menuIcon.contains(e.target)) {
                menuList.classList.remove('active');
            }
        });

        menuList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuList.classList.remove('active');
            });
        });
    }
};

const initScrollReveal = () => {
    const reveal = () => {
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach(el => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 100; // slightly more eager reveal
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', reveal);
    reveal();
};

const initDarkModeToggle = () => {
    const firstDiv = document.querySelector('.header .nav .container .first');
    if (!firstDiv) return;

    // Check if the button already exists to prevent duplicates
    if (document.querySelector('.dark-mode-toggle')) return;

    const darkModeBtn = document.createElement('button');
    const sunIcon = `<svg viewBox="0 0 24 24"><path d="M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0 c-0.55,0-1,0.45-1,1S1.45,13,2,13L2,13z M20,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13L20,13z M11,2l0,2c0,0.55,0.45,1,1,1s1-0.45,1-1l0-2c0-0.55-0.45-1-1-1S11,1.45,11,2L11,2z M11,20l0,2c0,0.55,0.45,1,1,1s1-0.45,1-1l0-2 c0-0.55-0.45-1-1-1S11,19.45,11,20L11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06 c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41 l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41 c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36 c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z"/></svg>`;
    const moonIcon = `<svg viewBox="0 0 24 24"><path d="M12.1,20.9c-4.9,0-8.9-4-8.9-8.9c0-4.9,4-8.9,8.9-8.9c0.4,0,0.8,0,1.2,0.1c0.4,0,0.7-0.3,0.8-0.6c0.1-0.4-0.1-0.8-0.4-1 c-0.5-0.2-1.1-0.3-1.7-0.3C6.3,1.3,1.7,5.9,1.7,11.7s4.6,10.3,10.3,10.3c3.8,0,7.2-2.1,8.9-5.3c0.2-0.3,0.1-0.8-0.3-1 c-0.3-0.2-0.8-0.2-1,0.1C18.1,18.5,15.3,20.9,12.1,20.9z"/></svg>`;

    darkModeBtn.innerHTML = document.body.classList.contains('dark-mode') ? sunIcon : moonIcon;
    darkModeBtn.className = 'dark-mode-toggle';
    firstDiv.appendChild(darkModeBtn);

    darkModeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        document.body.classList.toggle('dark-mode');
        darkModeBtn.innerHTML = document.body.classList.contains('dark-mode') ? sunIcon : moonIcon;
    });

    const isAr = document.documentElement.lang === 'ar';
    const langBtn = document.createElement('button');
    langBtn.className = 'lang-toggle';
    langBtn.innerText = isAr ? 'English' : 'العربية';
    firstDiv.appendChild(langBtn);

    const switchLanguage = (e) => {
        if (e) e.preventDefault();
        const targetLang = isAr ? 'en' : 'ar';
        localStorage.setItem('preferred_lang', targetLang);
        
        const currentPath = window.location.pathname;
        let targetFile;
        if (currentPath.includes('know-me-more')) {
            targetFile = isAr ? 'know-me-more.html' : 'know-me-more-ar.html';
        } else {
            targetFile = isAr ? 'index.html' : 'index-ar.html';
        }
        window.location.href = targetFile;
    };

    langBtn.addEventListener('click', switchLanguage);
    document.querySelectorAll('.lang-switcher-btn').forEach(btn => {
        btn.addEventListener('click', switchLanguage);
    });
};

const initScrollWidget = () => {
    // Remove old single scrollTopBtn if present
    const oldBtn = document.getElementById('scrollTopBtn');
    if (oldBtn) oldBtn.remove();

    if (document.querySelector('.scroll-widget')) return;

    const isAr = document.documentElement.lang === 'ar';
    const widget = document.createElement('div');
    widget.className = 'scroll-widget';
    widget.innerHTML = `
        <button id="scrollToTopBtn" title="${isAr ? 'الانتقال للأعلى' : 'Scroll to Top'}" aria-label="Scroll to top">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
        </button>
        <button id="scrollToBottomBtn" title="${isAr ? 'الانتقال لأسفل' : 'Scroll to Bottom'}" aria-label="Scroll to bottom">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
    `;
    document.body.appendChild(widget);

    const scrollTopBtn = document.getElementById('scrollToTopBtn');
    const scrollBottomBtn = document.getElementById('scrollToBottomBtn');

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    if (scrollBottomBtn) {
        scrollBottomBtn.addEventListener('click', () => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        });
    }
};

const initTypingEffect = () => {
    const textElement = document.getElementById('typing-text');
    if (!textElement) return;

    const isAr = document.documentElement.lang === 'ar';
    const roles = isAr
        ? ["مخطط عمراني", "أخصائي نظم معلومات جغرافية", "مهندس معماري", "أنا أصمم النظم، وليس مجرد مرئيات"]
        : ["Urban Planner", "GIS Specialist", "Architect", "I design systems, not just visuals."];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const type = () => {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            textElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // faster when deleting
        } else {
            textElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            // Pause at the end of word
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Pause before typing next word
        }

        setTimeout(type, typingSpeed);
    };

    type(); // Start animation
};

// --- Initialization --- //
document.addEventListener('DOMContentLoaded', () => {
    initSmoothScrolling();
    initMobileMenu();
    initScrollReveal();
    initDarkModeToggle();
    initScrollWidget();
    initTypingEffect();
});
