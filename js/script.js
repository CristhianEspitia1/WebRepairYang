document.addEventListener('DOMContentLoaded', () => {
    // Hero Video Switching Logic
    const video1 = document.getElementById('heroVideo1');
    const video2 = document.getElementById('heroVideo2');

    if (video1 && video2) {
        // When video1 ends, switch to video2
        video1.addEventListener('ended', () => {
            video1.classList.remove('active');
            video2.classList.add('active');
            video2.currentTime = 0;
            video2.play();
        });

        // When video2 ends, switch back to video1
        video2.addEventListener('ended', () => {
            video2.classList.remove('active');
            video1.classList.add('active');
            video1.currentTime = 0;
            video1.play();
        });

        // Start playing video1
        video1.play().catch(e => console.log('Autoplay prevented:', e));
    }

    // Mobile Menu Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navClose = document.getElementById('nav-close');
    const navOverlay = document.getElementById('nav-overlay');
    const navLinks = document.querySelectorAll('.nav-link');

    // Function to open menu
    const openMenu = () => {
        navMenu.classList.add('show-menu');
        if (navOverlay) navOverlay.classList.add('show-overlay');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    };

    // Function to close menu
    const closeMenu = () => {
        navMenu.classList.remove('show-menu');
        if (navOverlay) navOverlay.classList.remove('show-overlay');
        document.body.style.overflow = ''; // Restore scroll
    };

    if (navToggle) {
        navToggle.addEventListener('click', openMenu);
    }

    if (navClose) {
        navClose.addEventListener('click', closeMenu);
    }

    // Close menu when clicking overlay (outside menu)
    if (navOverlay) {
        navOverlay.addEventListener('click', closeMenu);
    }

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking CTA buttons inside menu
    const menuCTAs = document.querySelectorAll('.nav-cta-phone, .nav-cta-book');
    menuCTAs.forEach(cta => {
        cta.addEventListener('click', closeMenu);
    });

    // Sticky Header
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY >= 50) {
            header.classList.add('scroll-header');
        } else {
            header.classList.remove('scroll-header');
        }
    });

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    const revealOnScroll = () => {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;

            // Element is in viewport
            if (elementTop < windowHeight - 100 && elementBottom > 0) {
                element.classList.add('active');
            }
        });
    };

    // Initial check
    revealOnScroll();

    // On scroll
    window.addEventListener('scroll', revealOnScroll);

    // Animated Counter for Stats
    const animateCounter = (element, target, duration = 2000) => {
        let start = 0;
        const increment = target / (duration / 16); // 60 FPS

        const updateCounter = () => {
            start += increment;
            if (start < target) {
                element.textContent = Math.ceil(start) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + '+';
            }
        };

        updateCounter();
    };

    // Initialize counters when stat cards are visible
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    const checkStatsVisible = () => {
        if (countersAnimated) return;

        statNumbers.forEach(stat => {
            const rect = stat.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                countersAnimated = true;
                // Extract number from text (e.g., "500+" -> 500)
                const text = stat.textContent;
                if (text.includes('500')) {
                    animateCounter(stat, 500);
                } else if (text.includes('100')) {
                    // For percentage, just show it
                    stat.textContent = '100%';
                }
            }
        });
    };

    window.addEventListener('scroll', checkStatsVisible);
    checkStatsVisible(); // Check on load

    // Initialize Flatpickr (Advanced Calendar)
    const fp = flatpickr("#date", {
        dateFormat: "Y-m-d",
        altInput: true,
        altFormat: "F j, Y", // Display: December 13, 2025
        showMonths: 1,
        onChange: function (selectedDates, dateStr, instance) {
            // Remove selection from quick buttons if manual date picked
            document.querySelectorAll('.date-card').forEach(c => c.classList.remove('selected'));
        }
    });

    // Booking Form Submission - WhatsApp Integration
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Collect ALL form data
            const name = document.getElementById('fullName').value;
            const phone = document.getElementById('phone').value;
            const phone2 = document.getElementById('phone2').value;
            const address = document.getElementById('address').value;
            const apartment = document.getElementById('apartment').value;
            const zipcode = document.getElementById('zipcode').value;

            // Get all selected appliances (checkboxes)
            const selectedAppliances = document.querySelectorAll('input[name="applianceType"]:checked');

            // Validate at least one appliance is selected
            if (selectedAppliances.length === 0) {
                alert('Please select at least one appliance to repair.');
                return;
            }

            const preferredDate = document.getElementById('date').value || 'Not specified';
            const problem = document.getElementById('problem').value || 'Not provided';

            // Format the appliance types nicely
            const applianceNames = {
                'washer': 'Washer',
                'dryer': 'Dryer',
                'refrigerator': 'Refrigerator',
                'stove': 'Stove / Oven',
                'dishwasher': 'Dishwasher'
            };

            // Create list of selected appliances
            const applianceList = Array.from(selectedAppliances)
                .map(cb => applianceNames[cb.value] || cb.value)
                .join(', ');

            // Format full address (including apt and zip)
            let fullAddress = address;
            if (apartment) fullAddress += `, ${apartment}`;
            fullAddress += ` - ${zipcode}`;

            // Format date nicely if provided
            let dateDisplay = 'Flexible';
            if (preferredDate && preferredDate !== 'Not specified') {
                const d = new Date(preferredDate);
                dateDisplay = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            }

            // Create WhatsApp message in requested order
            const message = `*New Repair Request*

*Name:* ${name}

*Address:* ${fullAddress}

*Phone:* ${phone}${phone2 ? ` / ${phone2}` : ''}

*Date:* ${dateDisplay}

*Appliances:* ${applianceList}${problem && problem !== 'Not provided' ? `

*Issue:* ${problem}` : ''}`;

            // WhatsApp number (without + sign for URL)
            const whatsappNumber = '17542757642';

            // Encode message for URL
            const encodedMessage = encodeURIComponent(message);

            // Create WhatsApp URL
            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

            // Open WhatsApp in new tab
            window.open(whatsappURL, '_blank');

            // Show confirmation to user
            const btn = bookingForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = '✓ Opening WhatsApp...';
            btn.style.backgroundColor = '#25D366'; // WhatsApp green

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
                // Reset form
                bookingForm.reset();
                fp.clear();
                document.querySelectorAll('.date-card').forEach(c => c.classList.remove('selected'));
            }, 2000);
        });
    }

    // Dynamic Quick Dates Logic
    initQuickDates(fp);
});

function initQuickDates(flatpickrInstance) {
    const quickDatesContainer = document.getElementById('quickDates');
    if (!quickDatesContainer) return;

    // Clear existing
    quickDatesContainer.innerHTML = '';

    // Generate next 4 valid days
    let count = 0;
    let d = new Date();
    const todayStr = d.toDateString();

    // To calculate tomorrow for naming
    let tomorrow = new Date(d);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toDateString();

    while (count < 4) {
        const dateStr = formatDate(d); // YYYY-MM-DD
        const displayDate = getMonthDate(d);

        let labelDay = getDayName(d);

        // Custom labels "Today" / "Tomorrow"
        if (d.toDateString() === todayStr) {
            labelDay = "Today";
        } else if (d.toDateString() === tomorrowStr) {
            labelDay = "Tomorrow";
        }

        const btn = document.createElement('div');
        btn.className = 'date-card';

        // Highlight styling if it's "Today" or "Tomorrow"
        let highlightClass = (labelDay === "Today" || labelDay === "Tomorrow") ? "highlight-day" : "";

        btn.innerHTML = `<span class="day ${highlightClass}">${labelDay}</span><span class="date">${displayDate}</span>`;
        btn.dataset.value = dateStr;

        btn.addEventListener('click', () => {
            // Remove active from all
            document.querySelectorAll('.date-card').forEach(c => c.classList.remove('selected'));
            // Add active to self
            btn.classList.add('selected');
            // Update Flatpickr
            flatpickrInstance.setDate(dateStr, true);
        });

        quickDatesContainer.appendChild(btn);
        count++;
        // Increment day
        d.setDate(d.getDate() + 1);
    }
}

function formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function getDayName(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
}

function getMonthDate(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
}
