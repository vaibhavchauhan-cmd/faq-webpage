// FAQ Interactive Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all FAQ items
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Add click event listeners to each FAQ question
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const arrow = item.querySelector('.arrow');
        
        // Add initial opacity for smooth animation
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        // Animate items on load with staggered delay
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        }, 100 * (index + 1));
        
        // Click handler for questions
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Toggle the active state
            if (isActive) {
                closeItem(item, answer, arrow);
            } else {
                openItem(item, answer, arrow);
            }
        });
        
        // Keyboard navigation support
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
        
        // Make questions focusable for accessibility
        question.setAttribute('tabindex', '0');
        question.setAttribute('role', 'button');
        question.setAttribute('aria-expanded', 'false');
        
        // Add ARIA labels for screen readers
        const questionId = `faq-question-${index + 1}`;
        const answerId = `faq-answer-${index + 1}`;
        
        question.setAttribute('id', questionId);
        question.setAttribute('aria-controls', answerId);
        answer.setAttribute('id', answerId);
        answer.setAttribute('aria-labelledby', questionId);
    });
    
    // Function to open an FAQ item
    function openItem(item, answer, arrow) {
        item.classList.add('active');
        
        // Update ARIA attributes
        const question = item.querySelector('.faq-question');
        question.setAttribute('aria-expanded', 'true');
        
        // Smooth expand animation
        answer.style.maxHeight = answer.scrollHeight + 'px';
        
        // Add a slight delay for the arrow rotation to look smooth
        setTimeout(() => {
            arrow.style.transform = 'rotate(180deg)';
        }, 100);
        
        // Add focus to the answer for screen readers
        answer.setAttribute('tabindex', '-1');
        
        // Smooth scroll to item if it's not fully visible
        setTimeout(() => {
            const rect = item.getBoundingClientRect();
            const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
            
            if (!isVisible) {
                item.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }
        }, 300);
    }
    
    // Function to close an FAQ item
    function closeItem(item, answer, arrow) {
        item.classList.remove('active');
        
        // Update ARIA attributes
        const question = item.querySelector('.faq-question');
        question.setAttribute('aria-expanded', 'false');
        
        // Smooth collapse animation
        answer.style.maxHeight = '0px';
        arrow.style.transform = 'rotate(0deg)';
        
        // Remove tabindex from answer
        answer.removeAttribute('tabindex');
    }
    
    // Add smooth scrolling to top functionality
    function addScrollToTop() {
        const scrollButton = document.createElement('button');
        scrollButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
        scrollButton.className = 'scroll-to-top';
        scrollButton.setAttribute('aria-label', 'Scroll to top');
        scrollButton.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
            box-shadow: var(--shadow-medium);
            z-index: 1000;
        `;
        
        document.body.appendChild(scrollButton);
        
        // Show/hide scroll button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollButton.style.opacity = '1';
                scrollButton.style.transform = 'translateY(0)';
            } else {
                scrollButton.style.opacity = '0';
                scrollButton.style.transform = 'translateY(20px)';
            }
        });
        
        // Scroll to top functionality
        scrollButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Hover effects
        scrollButton.addEventListener('mouseenter', function() {
            scrollButton.style.transform += ' scale(1.1)';
        });
        
        scrollButton.addEventListener('mouseleave', function() {
            scrollButton.style.transform = scrollButton.style.transform.replace(' scale(1.1)', '');
        });
    }
    
    // Initialize scroll to top button
    addScrollToTop();
    
    // Add search functionality (bonus feature)
    function addSearchFunctionality() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.style.cssText = `
            margin-bottom: 2rem;
            position: relative;
        `;
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search questions...';
        searchInput.className = 'search-input';
        searchInput.style.cssText = `
            width: 100%;
            padding: 1rem 3rem 1rem 1rem;
            border: 2px solid var(--border-color);
            border-radius: var(--border-radius);
            font-size: 1rem;
            background: var(--white);
            transition: var(--transition);
        `;
        
        const searchIcon = document.createElement('i');
        searchIcon.className = 'fas fa-search';
        searchIcon.style.cssText = `
            position: absolute;
            right: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-secondary);
            pointer-events: none;
        `;
        
        searchContainer.appendChild(searchInput);
        searchContainer.appendChild(searchIcon);
        
        // Insert search before FAQ container
        const faqContainer = document.querySelector('.faq-container');
        faqContainer.parentNode.insertBefore(searchContainer, faqContainer);
        
        // Search functionality
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            faqItems.forEach(item => {
                const questionText = item.querySelector('.question-text').textContent.toLowerCase();
                const answerText = item.querySelector('.faq-answer p').textContent.toLowerCase();
                
                if (questionText.includes(searchTerm) || answerText.includes(searchTerm)) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.3s ease forwards';
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Show "no results" message if no items are visible
            const visibleItems = Array.from(faqItems).filter(item => 
                item.style.display !== 'none'
            );
            
            let noResultsMsg = document.querySelector('.no-results');
            if (visibleItems.length === 0 && searchTerm.length > 0) {
                if (!noResultsMsg) {
                    noResultsMsg = document.createElement('div');
                    noResultsMsg.className = 'no-results';
                    noResultsMsg.style.cssText = `
                        text-align: center;
                        padding: 2rem;
                        color: var(--text-secondary);
                        font-style: italic;
                    `;
                    noResultsMsg.innerHTML = '<i class="fas fa-search"></i> No questions found matching your search.';
                    faqContainer.appendChild(noResultsMsg);
                }
            } else if (noResultsMsg) {
                noResultsMsg.remove();
            }
        });
        
        // Focus styles for search input
        searchInput.addEventListener('focus', function() {
            this.style.borderColor = 'var(--primary-color)';
            this.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
        });
        
        searchInput.addEventListener('blur', function() {
            this.style.borderColor = 'var(--border-color)';
            this.style.boxShadow = 'none';
        });
    }
    
    // Initialize search functionality
    addSearchFunctionality();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Escape to clear search
        if (e.key === 'Escape') {
            const searchInput = document.querySelector('.search-input');
            if (searchInput && document.activeElement === searchInput) {
                searchInput.value = '';
                searchInput.dispatchEvent(new Event('input'));
                searchInput.blur();
            }
        }
    });
    
    // Add performance optimization for scroll events
    let ticking = false;
    function updateScrollEffects() {
        // Add parallax effect to header
        const header = document.querySelector('.header');
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        header.style.transform = `translateY(${rate}px)`;
        
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    });
    
    // Add print styles support
    const printStyles = document.createElement('style');
    printStyles.textContent = `
        @media print {
            .scroll-to-top,
            .search-container {
                display: none !important;
            }
            
            .faq-item {
                break-inside: avoid;
                margin-bottom: 1rem;
            }
            
            .faq-answer {
                max-height: none !important;
                padding: 1rem 0 !important;
            }
            
            .arrow {
                display: none;
            }
        }
    `;
    document.head.appendChild(printStyles);
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Only register if you plan to add PWA features
        // navigator.serviceWorker.register('/sw.js');
    });
}