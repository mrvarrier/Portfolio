document.addEventListener('DOMContentLoaded', function() {
    // Setup page transition with enhanced timing
    const viewCaseStudyLinks = document.querySelectorAll('.case-study-content a[href*="case-study"]');
    const caseStudyImageLinks = document.querySelectorAll('a.case-study-img[href*="case-study"]');
    const overlay = document.getElementById('manual-page-transition-overlay');
    const navLinks = document.querySelectorAll('nav a');
    
    // Function to handle transition with smoother animation
    function handleTransition(e) {
        e.preventDefault();
        const targetUrl = this.getAttribute('href');
        sessionStorage.setItem('isDirectTransitioning', 'true');
        overlay.classList.add('active');
        setTimeout(function() {
            window.location.href = targetUrl;
        }, 600);
    }
    
    // Apply transition event listeners
    viewCaseStudyLinks.forEach(link => link.addEventListener('click', handleTransition));
    caseStudyImageLinks.forEach(link => link.addEventListener('click', handleTransition));
    navLinks.forEach(link => {
        if (link.getAttribute('href') !== 'index.html') {
            link.addEventListener('click', handleTransition);
        }
    });
});
    
    // Initialize scroll position for navigation effects
    let lastScrollTop = 0;
    const nav = document.getElementById('main-nav');
    
    // Enhanced scroll handling for nav appearance/disappearance
    window.addEventListener('scroll', function() {
        const st = window.pageYOffset || document.documentElement.scrollTop;
        
        // Control nav visibility based on scroll direction
        if (st > 100) {
            nav.classList.add('scrolled');
            if (st > lastScrollTop && st > 300) {
                // Scrolling down
                nav.classList.add('hidden');
            } else {
                // Scrolling up
                nav.classList.remove('hidden');
            }
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScrollTop = st <= 0 ? 0 : st;
    }, false);
    
    // Intersection Observer for case study animations with enhanced options
    const caseObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Staggered animation of child elements happens via CSS transitions
            }
        });
    }, { 
        threshold: 0.1, 
        rootMargin: "0px 0px -100px 0px" 
    });

    document.querySelectorAll('.case-study').forEach(caseStudy => {
        caseObserver.observe(caseStudy);
    });
    
    // Check if we're coming from another page for smooth transition back
    if (sessionStorage.getItem('isDirectTransitioning') === 'true') {
        sessionStorage.removeItem('isDirectTransitioning');
        overlay.style.transform = 'translateY(0)';
        overlay.style.opacity = '1';
        
        setTimeout(function() {
            overlay.style.transform = 'translateY(-100%)';
            overlay.style.opacity = '0';
        }, 100);
    }
    
    // Preload images for smoother transitions
    function preloadImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (img.getAttribute('loading') !== 'lazy') {
                const src = img.getAttribute('src');
                if (src) {
                    const imageObj = new Image();
                    imageObj.src = src;
                }
            }
        });
    }
    
    preloadImages();
    
    // Password protection for Zenodo case study
    const passwordTrigger = document.getElementById('password-trigger');
    const passwordField = document.querySelector('.password-field');
    const zenodoPassword = document.getElementById('zenodo-password');
    const submitPassword = document.getElementById('submit-password');
    const zenodoImg = document.getElementById('zenodo-img');
    const passwordToggle = document.querySelector('.password-toggle');
    const eyeIcon = document.querySelector('.eye-icon');
    const eyeSlashIcon = document.querySelector('.eye-slash-icon');

    // Store the SHA-256 hash of the password instead of the plaintext
    // Replace this with your actual password hash generated using the tool
    const PASSWORD_HASH = "808bdababf39bde8beb6a062be99ee525439f5996b66b1e61ed9d4ce3c4ee08d"; // Hash for "test"

    // Function to convert a string to SHA-256 hash
    async function sha256(message) {
        // Encode the string as UTF-8
        const msgBuffer = new TextEncoder().encode(message);
        
        // Hash the message using SubtleCrypto
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        
        // Convert the hash to a hex string
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        return hashHex;
    }

    // Function to handle password verification
    async function verifyPassword() {
        const enteredPassword = zenodoPassword.value;
        
        // Don't process empty passwords
        if (!enteredPassword.trim()) {
            passwordField.classList.add('error');
            zenodoPassword.placeholder = 'Please enter a password';
            
            setTimeout(() => {
                passwordField.classList.remove('error');
                zenodoPassword.placeholder = 'Enter password';
            }, 1000);
            return;
        }
        
        // Hash the entered password
        const enteredHash = await sha256(enteredPassword);
        
        if (enteredHash === PASSWORD_HASH) {
            // Success state
            passwordField.classList.add('success');
            
            // Show success message and redirect (using sessionStorage for one-time access)
            setTimeout(() => {
                // Create a one-time token that will be verified and immediately removed
                sessionStorage.setItem('zenodoOneTimeAccess', Date.now().toString());
                
                // Redirect to zenodo case study
                const overlay = document.getElementById('manual-page-transition-overlay');
                overlay.classList.add('active');
                setTimeout(() => {
                    window.location.href = 'zenodo/zenodo.html';
                }, 600);
            }, 800);
        } else {
            // Error state
            passwordField.classList.add('error');
            zenodoPassword.value = '';
            zenodoPassword.placeholder = 'Incorrect password';
            
            // Remove error class after animation completes
            setTimeout(() => {
                passwordField.classList.remove('error');
                zenodoPassword.placeholder = 'Enter password';
            }, 1000);
        }
    }

    // Toggle password field when clicking the link
    passwordTrigger.addEventListener('click', function(e) {
        e.preventDefault();
        passwordTrigger.classList.add('hide');
        passwordField.classList.add('active');
        zenodoPassword.focus();
    });

    // Handle submission
    submitPassword.addEventListener('click', verifyPassword);
    zenodoPassword.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            verifyPassword();
        }
    });

    // Also make the image clickable to open password field
    zenodoImg.addEventListener('click', function(e) {
        e.preventDefault();
        passwordTrigger.classList.add('hide');
        passwordField.classList.add('active');
        zenodoPassword.focus();
    });
    
    // Toggle password visibility
    passwordToggle.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent any default behavior
        
        if (zenodoPassword.type === 'password') {
            zenodoPassword.type = 'text';
            eyeIcon.style.display = 'none';
            eyeSlashIcon.style.display = 'block';
        } else {
            zenodoPassword.type = 'password';
            eyeIcon.style.display = 'block';
            eyeSlashIcon.style.display = 'none';
        }
        
        // Refocus on password field to maintain focus
        setTimeout(() => zenodoPassword.focus(), 0);
    });
    
    // Clear any existing tokens on page load to ensure fresh verification
    sessionStorage.removeItem('zenodoOneTimeAccess');
    
    // Deferred analytics - only load after everything else
    window.addEventListener('load', function() {
        setTimeout(function() {
            var script = document.createElement('script');
            script.src = 'https://www.googletagmanager.com/gtag/js?id=G-DQXH7NP5Z2';
            script.async = true;
            document.head.appendChild(script);
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-DQXH7NP5Z2');
        }, 3000);
    });