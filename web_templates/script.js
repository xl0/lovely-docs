function switchView(viewName) {
    // Hide all views
    document.querySelectorAll('.view-content').forEach(view => {
        view.classList.add('hidden');
    });
    
    // Deactivate all tabs
    document.querySelectorAll('.view-tab').forEach(tab => {
        tab.classList.remove('border-blue-600', 'text-blue-600');
        tab.classList.add('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
    });
    
    // Show selected view
    const targetView = document.getElementById(viewName);
    if (targetView) {
        targetView.classList.remove('hidden');
    }
    
    // Activate selected tab
    const targetTab = document.querySelector(`[data-view="${viewName}"]`);
    if (targetTab) {
        targetTab.classList.remove('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
        targetTab.classList.add('border-blue-600', 'text-blue-600');
    }
}

// Initialize first view on load
document.addEventListener('DOMContentLoaded', function() {
    const firstTab = document.querySelector('.view-tab');
    if (firstTab) {
        switchView(firstTab.dataset.view);
    }
    
    // Initialize syntax highlighting
    if (typeof hljs !== 'undefined') {
        hljs.highlightAll();
    }
});
