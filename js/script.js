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
        altFormat: "F j, Y", // Display: January 20, 2026
        showMonths: 1,
        minDate: "today",
        disableMobile: true, // Force custom picker on mobile (not native)
        locale: {
            firstDayOfWeek: 0, // Sunday
            weekdays: {
                shorthand: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
                longhand: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            },
            months: {
                shorthand: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                longhand: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
            }
        },
        onChange: function (selectedDates, dateStr, instance) {
            // Remove selection from quick buttons if manual date picked
            document.querySelectorAll('.date-card').forEach(c => c.classList.remove('selected'));
        }
    });



    // Booking Form Submission - Cloud Function Integration
    // BOOKING FORM LOGIC MOVED TO INDEX.HTML (DIRECT FIREBASE INTEGRATION)
    // The event listener below has been removed to avoid conflicts.
    // See index.html for the new <script type="module"> block.
    console.log("Legacy booking logic disabled. Using Direct Firebase Integration (No Server).");

    // Dynamic Quick Dates Logic
    initQuickDates(fp);
    initCustomTimePicker();
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

function initCustomTimePicker() {
    const trigger = document.getElementById('timeDropdownTrigger');
    const panel = document.getElementById('timeDropdownPanel');
    const display = document.getElementById('selectedTimeDisplay');
    const timeInput = document.getElementById('time');

    if (!trigger || !panel || !timeInput) return;

    // Time slots (8 AM to 9 PM)
    const timeSlots = [
        { display: "08:00 AM", value: "08:00" },
        { display: "09:00 AM", value: "09:00" },
        { display: "10:00 AM", value: "10:00" },
        { display: "11:00 AM", value: "11:00" },
        { display: "12:00 PM", value: "12:00" },
        { display: "01:00 PM", value: "13:00" },
        { display: "02:00 PM", value: "14:00" },
        { display: "03:00 PM", value: "15:00" },
        { display: "04:00 PM", value: "16:00" },
        { display: "05:00 PM", value: "17:00" },
        { display: "06:00 PM", value: "18:00" },
        { display: "07:00 PM", value: "19:00" },
        { display: "08:00 PM", value: "20:00" },
        { display: "09:00 PM", value: "21:00" }
    ];

    // Generate options
    panel.innerHTML = '';
    timeSlots.forEach(slot => {
        const option = document.createElement('div');
        option.className = 'time-dropdown-option';
        option.textContent = slot.display;
        option.dataset.value = slot.value;

        option.addEventListener('click', (e) => {
            e.stopPropagation();
            // Update display
            display.textContent = slot.display;
            trigger.classList.add('has-value');
            // Update hidden input
            timeInput.value = slot.value;
            // Close panel
            panel.classList.remove('open');
            trigger.classList.remove('open');
            trigger.closest('.time-dropdown-wrapper').classList.remove('dropdown-open');
            // Mark selected
            panel.querySelectorAll('.time-dropdown-option').forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
        });

        panel.appendChild(option);
    });

    // Create overlay for mobile
    let overlay = document.getElementById('timePickerOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'timePickerOverlay';
        overlay.className = 'time-picker-overlay';
        document.body.appendChild(overlay);
    }

    // Toggle dropdown
    trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const isOpen = !panel.classList.contains('open');

        if (isOpen) {
            // Move panel to overlay and show
            overlay.appendChild(panel);
            overlay.classList.add('active');
            panel.classList.add('open');
            trigger.classList.add('open');
        } else {
            closeTimePicker();
        }
    });

    // Close function
    function closeTimePicker() {
        panel.classList.remove('open');
        trigger.classList.remove('open');
        overlay.classList.remove('active');
        // Move panel back to wrapper
        trigger.closest('.time-dropdown-wrapper').appendChild(panel);
    }

    // Close when clicking overlay background
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeTimePicker();
        }
    });

    // Close when clicking outside (desktop)
    document.addEventListener('click', (e) => {
        if (!trigger.contains(e.target) && !panel.contains(e.target) && !overlay.contains(e.target)) {
            closeTimePicker();
        }
    });

    // Update option click handlers to use closeTimePicker
    panel.querySelectorAll('.time-dropdown-option').forEach(option => {
        option.addEventListener('click', () => {
            closeTimePicker();
        });
    });
}
