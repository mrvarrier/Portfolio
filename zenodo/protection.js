// protection.js - Place this file in the zenodo folder
// This code should be included at the very top of your zenodo.html file

(function() {
    // Check for one-time access token from the password entry
    const oneTimeToken = sessionStorage.getItem('zenodoOneTimeAccess');
    
    // Immediately remove the token to prevent reuse
    sessionStorage.removeItem('zenodoOneTimeAccess');
    
    // Get the referrer to see if they came directly from your site's password entry form
    const referrer = document.referrer;
    const isFromMainSite = referrer.includes(window.location.hostname) && 
                         referrer.includes('index.html');
    
    // Check if token exists and is less than 5 seconds old (to prevent tampering)
    const isValidToken = oneTimeToken && 
                      (Date.now() - parseInt(oneTimeToken) < 5000);
    
    // If no valid token or coming from different site, redirect to homepage
    if (!isValidToken) {
        window.location.href = '../index.html';
        return;
    }
    
    // Add protection against back button / history navigation
    window.addEventListener('pageshow', function(event) {
        // If navigating back from browser history, force reload to trigger protection
        if (event.persisted) {
            window.location.reload();
        }
    });
    
    // Add listener for page visibility changes
    document.addEventListener('visibilitychange', function() {
        // If page becomes visible again after being hidden, force reload
        if (document.visibilityState === 'visible') {
            // Small timeout to prevent immediate reload when switching tabs briefly
            setTimeout(function() {
                if (document.visibilityState === 'visible') {
                    window.location.reload();
                }
            }, 300);
        }
    });
    
    // Add global click handler for easy navigation back to home
    document.addEventListener('DOMContentLoaded', function() {
        // Optional: Add a back button in your case study
        const backButton = document.querySelector('.back-button');
        if (backButton) {
            backButton.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = '../index.html';
            });
        }
    });
})();