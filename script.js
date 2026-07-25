/**
 * NELLAI CCTV & SECURITY SOLUTIONS - Interactive Engine
 * Handles Mobile Menu, Camera Simulator, Package Calculator, and WhatsApp Integration
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Drawer Toggle
    const menuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });

        // Close menu when clicking link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                if (menuToggle.querySelector('i')) {
                    menuToggle.querySelector('i').className = 'fa-solid fa-bars';
                }
            });
        });
    }

    // 2. Live Camera Simulator Functionality
    const cameraPreviewBody = document.getElementById('cameraPreviewBody');
    const nightModeBtn = document.getElementById('nightModeBtn');
    const dayModeBtn = document.getElementById('dayModeBtn');
    const motionAlertBtn = document.getElementById('motionAlertBtn');
    const motionAlertPopup = document.getElementById('motionAlertPopup');
    const cameraTimestamp = document.getElementById('cameraTimestamp');

    // Real-time Clock overlay inside camera simulator
    function updateCamClock() {
        if (cameraTimestamp) {
            const now = new Date();
            const dateStr = now.toISOString().slice(0, 10);
            const timeStr = now.toTimeString().slice(0, 8);
            cameraTimestamp.textContent = `${dateStr} ${timeStr} IST`;
        }
    }
    setInterval(updateCamClock, 1000);
    updateCamClock();

    // Day / Night Mode Switches
    if (nightModeBtn && cameraPreviewBody) {
        nightModeBtn.addEventListener('click', () => {
            cameraPreviewBody.classList.add('night-mode');
            nightModeBtn.classList.add('active');
            if (dayModeBtn) dayModeBtn.classList.remove('active');
        });
    }

    if (dayModeBtn && cameraPreviewBody) {
        dayModeBtn.addEventListener('click', () => {
            cameraPreviewBody.classList.remove('night-mode');
            dayModeBtn.classList.add('active');
            if (nightModeBtn) nightModeBtn.classList.remove('active');
        });
    }

    // Trigger Motion Detection Simulation
    if (motionAlertBtn && motionAlertPopup) {
        motionAlertBtn.addEventListener('click', () => {
            motionAlertPopup.classList.add('active');
            // Play alert sound tone effect via web audio API if possible
            playSecurityBeep();

            setTimeout(() => {
                motionAlertPopup.classList.remove('active');
            }, 4000);
        });
    }

    function playSecurityBeep() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.2);
        } catch (e) {
            console.log('Audio not supported or blocked');
        }
    }

    // 3. Security Property Calculator Logic
    const propOptions = document.querySelectorAll('.prop-option');
    const camCountInput = document.getElementById('camCountInput');
    const camCountVal = document.getElementById('camCountVal');
    const estPriceText = document.getElementById('estPriceText');
    const recSetupText = document.getElementById('recSetupText');
    const calcWhatsappBtn = document.getElementById('calcWhatsappBtn');

    let selectedProperty = 'Home / Flat';

    propOptions.forEach(option => {
        option.addEventListener('click', () => {
            propOptions.forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
            selectedProperty = option.dataset.prop || 'Property';
            updateCalculator();
        });
    });

    if (camCountInput) {
        camCountInput.addEventListener('input', (e) => {
            if (camCountVal) camCountVal.textContent = `${e.target.value} Cameras`;
            updateCalculator();
        });
    }

    function updateCalculator() {
        const count = camCountInput ? parseInt(camCountInput.value) : 4;
        let basePrice = count * 2999 + 1999; // Base hardware + DVR/NVR allocation
        let setupType = "Full HD Dome/Bullet Cameras + DVR + Mobile Viewing";

        if (count >= 8) {
            setupType = "High-Def IP Cameras + NVR Storage + PoE Switch + Remote App";
        }

        if (estPriceText) {
            estPriceText.textContent = `₹${basePrice.toLocaleString('en-IN')} onwards`;
        }
        if (recSetupText) {
            recSetupText.textContent = `${count} Cams for ${selectedProperty} (${setupType})`;
        }

        if (calcWhatsappBtn) {
            const msg = encodeURIComponent(
                `Hello NELLAI CCTV! I checked your website calculator.\n` +
                `Property Type: ${selectedProperty}\n` +
                `Camera Requirement: ${count} Cameras\n` +
                `Estimated Setup: ${setupType}\n` +
                `Please provide your best discounted quote for installation.`
            );
            calcWhatsappBtn.href = `https://wa.me/919842186217?text=${msg}`;
        }
    }
    updateCalculator();

    // 4. Quick Quote Form Submission Handler
    const enquiryForm = document.getElementById('enquiryForm');
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('formName').value;
            const phone = document.getElementById('formPhone').value;
            const location = document.getElementById('formLocation').value;
            const service = document.getElementById('formService').value;
            const message = document.getElementById('formMessage').value;

            const text = encodeURIComponent(
                `🚨 NEW CCTV INQUIRY 🚨\n` +
                `Name: ${name}\n` +
                `Phone: ${phone}\n` +
                `Location: ${location}\n` +
                `Service Needed: ${service}\n` +
                `Details: ${message || 'No additional details'}`
            );

            // Open WhatsApp directly with inquiry details
            window.open(`https://wa.me/919842186217?text=${text}`, '_blank');
        });
    }
});

