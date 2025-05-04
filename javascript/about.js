// Use requestIdleCallback for non-critical script execution
const runOnIdle = window.requestIdleCallback || function(cb) {
    setTimeout(() => cb({ timeRemaining: () => 50 }), 1);
};

// Initialize intersection observer for animations
runOnIdle(() => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeUp 0.6s forwards';
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1, 
        rootMargin: "0px 0px -100px 0px" 
    });

    // Observe elements for animation
    const elements = [
        '.recommendation',
        '.photo-grid',
        '.approach-content'
    ].flatMap(selector => 
        Array.from(document.querySelectorAll(selector))
    );
    
    elements.forEach(el => observer.observe(el));
});

// Deferred analytics loading
window.addEventListener('load', () => {
    setTimeout(() => {
        const script = document.createElement('script');
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-DQXH7NP5Z2';
        script.async = true;
        document.head.appendChild(script);
        
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-DQXH7NP5Z2');
    }, 3000);
});