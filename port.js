(() => {
    const menuButton = document.querySelector('.menu-toggle');
    const navigation = document.querySelector('.primary-navigation');
    const themeButton = document.querySelector('.theme-toggle');
    const backToTop = document.querySelector('.back-to-top');
    const typingText = document.querySelector('.typing-text');
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (menuButton && navigation) {
        const closeMenu = () => {
            menuButton.setAttribute('aria-expanded', 'false');
            menuButton.setAttribute('aria-label', 'Open navigation menu');
            navigation.classList.remove('is-open');
        };

        menuButton.addEventListener('click', () => {
            const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
            menuButton.setAttribute('aria-expanded', String(!isExpanded));
            menuButton.setAttribute('aria-label', isExpanded ? 'Open navigation menu' : 'Close navigation menu');
            navigation.classList.toggle('is-open', !isExpanded);
        });

        navigation.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeMenu();
            }
        });

        document.addEventListener('click', (event) => {
            if (!navigation.contains(event.target) && !menuButton.contains(event.target)) {
                closeMenu();
            }
        });
    }

    if (themeButton) {
        themeButton.addEventListener('click', () => {
            const isDark = document.documentElement.dataset.theme !== 'dark';
            if (isDark) {
                document.documentElement.dataset.theme = 'dark';
            } else {
                delete document.documentElement.dataset.theme;
            }

            themeButton.setAttribute('aria-pressed', String(isDark));
            themeButton.setAttribute('aria-label', isDark ? 'Switch to light color theme' : 'Switch to dark color theme');
            themeButton.innerHTML = isDark
                ? '<i class="fa-regular fa-sun" aria-hidden="true"></i>'
                : '<i class="fa-regular fa-moon" aria-hidden="true"></i>';
        });
    }

    const revealElements = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && !motionPreference.matches) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealElements.forEach((element) => revealObserver.observe(element));
    } else {
        revealElements.forEach((element) => element.classList.add('is-visible'));
    }

    const sectionLinks = [...document.querySelectorAll('.primary-navigation a[href^="#"]')];
    const sections = sectionLinks
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    const updateActiveLink = () => {
        const marker = window.innerHeight * 0.35;
        let currentSection = sections[0];

        sections.forEach((section) => {
            if (section.getBoundingClientRect().top <= marker) {
                currentSection = section;
            }
        });

        sectionLinks.forEach((link) => {
            const isCurrent = currentSection && link.getAttribute('href') === `#${currentSection.id}`;
            if (isCurrent) {
                link.classList.add('is-active');
                link.setAttribute('aria-current', 'location');
            } else {
                link.classList.remove('is-active');
                link.removeAttribute('aria-current');
            }
        });

        if (backToTop) {
            backToTop.classList.toggle('is-visible', window.scrollY > 500);
        }
    };

    let scrollScheduled = false;
    window.addEventListener('scroll', () => {
        if (!scrollScheduled) {
            scrollScheduled = true;
            window.requestAnimationFrame(() => {
                updateActiveLink();
                scrollScheduled = false;
            });
        }
    }, { passive: true });
    updateActiveLink();

    if (typingText && !motionPreference.matches) {
        const phrases = ['Computer Vision', 'Deep Learning', 'Frontend Development'];
        let phraseIndex = 0;
        let characterIndex = 0;
        let isDeleting = false;
        typingText.textContent = '';

        const typeNext = () => {
            const phrase = phrases[phraseIndex];

            if (isDeleting) {
                characterIndex -= 1;
            } else {
                characterIndex += 1;
            }

            typingText.textContent = phrase.slice(0, characterIndex);

            if (!isDeleting && characterIndex === phrase.length) {
                isDeleting = true;
                window.setTimeout(typeNext, 1500);
                return;
            }

            if (isDeleting && characterIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
            }

            window.setTimeout(typeNext, isDeleting ? 45 : 85);
        };

        window.setTimeout(typeNext, 1800);
    }
})();
