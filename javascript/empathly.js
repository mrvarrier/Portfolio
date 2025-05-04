document.addEventListener('DOMContentLoaded', function() {
    // Use requestIdleCallback for non-critical initialization
    (window.requestIdleCallback || window.setTimeout)(function() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeUp 0.6s forwards';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

        // Observe elements in batches to avoid layout thrashing
        const observeElements = [
            '.pdf-layout', '.two-column', '.insight-box', 
            '.highlight-box', '.highlight-box2', '.video-container', 
            '.research-row', '.result-paragraph', '.context-subtitle', '.context-paragraph'
        ].flatMap(selector => 
            Array.from(document.querySelectorAll(selector))
        );
        
        observeElements.forEach(element => {
            element.style.opacity = 0;
            element.style.transform = 'translateY(20px)';
            observer.observe(element);
        });
    }, { timeout: 500 });
});