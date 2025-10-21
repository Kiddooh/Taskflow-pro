// Utility Functions
class AppUtils {
    // DOM Utilities
    static $(selector) {
        return document.querySelector(selector);
    }
    
    static $$(selector) {
        return document.querySelectorAll(selector);
    }
    
    static createElement(tag, classes = '', content = '') {
        const element = document.createElement(tag);
        if (classes) element.className = classes;
        if (content) element.innerHTML = content;
        return element;
    }
    
    // String Utilities
    static capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    static truncate(str, length = 50) {
        return str.length > length ? str.substring(0, length) + '...' : str;
    }
    
    // Date Utilities
    static formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    static formatDateTime(date) {
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    // Validation Utilities
    static validateEmail(email) {
        return AppConfig.VALIDATION.EMAIL.REGEX.test(email);
    }
    
    static validatePassword(password) {
        return password.length >= AppConfig.VALIDATION.PASSWORD.MIN_LENGTH;
    }
    
    // Storage Utilities
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // Color Utilities
    static hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    // Event Utilities
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Notification Utilities
    static showNotification(message, type = 'info') {
        // Implementation for showing notifications
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
    
    // Formatting Utilities
    static formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Make utilities globally available
window.AppUtils = AppUtils;
