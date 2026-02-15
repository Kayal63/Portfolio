/*
 * Portfolio Scripts (Dark Blue Theme)
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Navigation Active State
    const currentLocation = location.href;
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        if (link.href === currentLocation) {
            link.classList.add('active');
        }
    });

    // 2. Typing Effect (Disabled)
    /* 
    const typingElement = document.querySelector('.typing-text span');
    ... (typing logic removed for static display)
    */

    // 3. Skill Bar Animation (Only on Skills Page)
    const skillBars = document.querySelectorAll('.skill-progress');
    if (skillBars.length > 0) {
        setTimeout(() => {
            skillBars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width + '%';
            });
        }, 500);
    }

    // 4. Scroll Reveal Animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.glass-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });

    // 5. Add Certificate Management
    const addCard = document.getElementById('add-certificate-card');
    const fileInput = document.getElementById('cert-upload');

    if (addCard && fileInput) {
        const certGrid = addCard.closest('.grid-2') || addCard.parentElement;

        // Load saved certificates from localStorage
        const savedCerts = JSON.parse(localStorage.getItem('added-certificates') || '[]');
        savedCerts.forEach(cert => renderCert(cert, false));

        addCard.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const title = prompt("Enter Certificate Name:");
            const issuer = prompt("Enter Issuing Organization:");

            if (title && issuer) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const certData = {
                        title: title,
                        issuer: issuer,
                        fileUrl: event.target.result,
                        timestamp: Date.now()
                    };

                    renderCert(certData, true);

                    // Save to localStorage
                    const currentCerts = JSON.parse(localStorage.getItem('added-certificates') || '[]');
                    currentCerts.push(certData);
                    localStorage.setItem('added-certificates', JSON.stringify(currentCerts));
                };
                reader.readAsDataURL(file);
            }
            fileInput.value = '';
        });

        function renderCert(cert, isNew) {
            const newCard = document.createElement('div');
            newCard.className = 'glass-card';

            if (isNew) {
                newCard.style.opacity = '0';
                newCard.style.transform = 'translateY(20px)';
                newCard.style.transition = 'all 0.6s ease-out';
            }

            newCard.innerHTML = `
                <div class="flex items-center gap-4 mb-3">
                    <div style="background: rgba(56, 189, 248, 0.1); width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
                        <i class="fas fa-certificate text-accent"></i>
                    </div>
                    <div>
                        <h4 style="font-size: 1rem; margin: 0;">${cert.title}</h4>
                        <small class="text-muted">${cert.issuer}</small>
                    </div>
                </div>
                <p class="text-muted text-sm mb-4">Dynamically added certificate.</p>
                <div class="flex gap-2">
                    <a href="${cert.fileUrl}" target="_blank" class="btn btn-outline" style="font-size: 0.8rem; padding: 6px 12px; flex: 1;">
                        <i class="fas fa-eye" style="margin-right: 6px;"></i> View
                    </a>
                    <button class="btn btn-outline delete-cert" data-time="${cert.timestamp}" style="font-size: 0.8rem; padding: 6px 10px; border-color: rgba(239, 68, 68, 0.5); color: #ef4444;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            certGrid.insertBefore(newCard, addCard);

            // Re-run observation for the new card
            if (typeof observer !== 'undefined') {
                observer.observe(newCard);
            }

            // Delete functionality
            newCard.querySelector('.delete-cert').addEventListener('click', function () {
                const timestamp = this.getAttribute('data-time');
                const updatedCerts = JSON.parse(localStorage.getItem('added-certificates') || '[]')
                    .filter(c => c.timestamp != timestamp);
                localStorage.setItem('added-certificates', JSON.stringify(updatedCerts));
                newCard.remove();
            });
        }
    }

    // Add 'visible' class styles dynamically
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(styleSheet);
});
