// Use requestIdleCallback for non-critical script execution
const runOnIdle = window.requestIdleCallback || function(cb) {
    setTimeout(() => cb(), 1);
};

// Intersection Observer for scroll animations
document.addEventListener('DOMContentLoaded', function() {
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

        // Observe all sections
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    });
});