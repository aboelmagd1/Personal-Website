/* General Website Enhancements */
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile menu toggle logic
    const menuIcon = document.querySelector('.header .nav .icon');
    const menuList = document.querySelector('.header .nav ul');

    if (menuIcon && menuList) {
        menuIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            menuList.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuList.contains(e.target) && !menuIcon.contains(e.target)) {
                menuList.classList.remove('active');
            }
        });

        // Close menu when a link is clicked
        menuList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuList.classList.remove('active');
            });
        });
    }

    // Scroll reveal animation
    const reveal = () => {
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach(el => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 150;
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', reveal);
    reveal(); // Initial check

    // Add Dark Mode Toggle to Nav
    const firstDiv = document.querySelector('.header .nav .container .first');
    if (firstDiv) {
        // Dark Mode Button
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

        // Language toggle button
        const isAr = document.documentElement.lang === 'ar';
        const langBtn = document.createElement('button');
        langBtn.className = 'lang-toggle';
        langBtn.innerText = isAr ? 'English' : 'العربية';
        firstDiv.appendChild(langBtn);

        langBtn.addEventListener('click', () => {
            const targetFile = isAr ? 'index.html' : 'index-ar.html';
            window.location.href = targetFile;
        });
    }

    // Scroll to Top logic
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.id = 'scrollTopBtn';
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollTopBtn);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.display = 'flex';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
