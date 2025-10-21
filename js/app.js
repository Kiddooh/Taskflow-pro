// Main Application Controller
class TaskFlowApp {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'dashboard';
        this.isOnline = navigator.onLine;
        this.modules = {};
        
        this.init();
    }

    async init() {
        try {
            // Initialize core systems in sequence
            await this.initializeStorage();
            await this.initializeAuth();
            await this.initializeUI();
            await this.initializeRouter();
            await this.initializeModules();
            
            this.setupEventListeners();
            this.checkAuthenticationStatus();
            
            console.log('TaskFlow Pro initialized successfully');
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showFatalError('Failed to initialize application');
        }
    }

    async initializeStorage() {
        // Initialize local storage management
        if (!window.localStorage) {
            throw new Error('Local storage is not supported');
        }
        
        // Set up default data structure if not exists
        const defaultData = {
            users: [],
            projects: [],
            tasks: [],
            settings: {
                theme: 'auto',
                notifications: true,
                offlineMode: true
            }
        };

        if (!localStorage.getItem('taskflow_data')) {
            localStorage.setItem('taskflow_data', JSON.stringify(defaultData));
        }
    }

    async initializeAuth() {
        // Check for existing session
        const session = localStorage.getItem('taskflow_session');
        if (session) {
            try {
                const userData = JSON.parse(session);
                this.currentUser = userData;
                this.updateUIForUser(userData);
            } catch (error) {
                console.warn('Invalid session data');
                localStorage.removeItem('taskflow_session');
            }
        }
    }

    async initializeUI() {
        // Initialize UI components
        this.setupTheme();
        this.setupNavigation();
        this.hideLoadingScreen();
    }

    async initializeRouter() {
        // Simple client-side router
        window.addEventListener('hashchange', () => {
            this.handleRouteChange();
        });

        // Handle initial route
        this.handleRouteChange();
    }

    async initializeModules() {
        // Lazy load feature modules
        this.modules = {
            dashboard: null,
            projects: null,
            calendar: null,
            reports: null
        };
    }

    setupEventListeners() {
        // Online/offline detection
        window.addEventListener('online', () => {
            this.handleOnlineStatusChange(true);
        });

        window.addEventListener('offline', () => {
            this.handleOnlineStatusChange(false);
        });

        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    handleRouteChange() {
        const hash = window.location.hash.substring(1) || 'dashboard';
        this.navigateTo(hash);
    }

    navigateTo(page) {
        // Validate page
        const validPages = ['dashboard', 'projects', 'calendar', 'reports', 'login', 'register'];
        if (!validPages.includes(page)) {
            page = 'dashboard';
        }

        this.currentPage = page;
        this.updateActiveNavigation();
        this.loadPageContent(page);
    }

    updateActiveNavigation() {
        // Update nav links active state
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${this.currentPage}`) {
                link.classList.add('active');
            }
        });
    }

    async loadPageContent(page) {
        const container = document.getElementById('page-container');
        
        // Show loading state
        container.innerHTML = `
            <div class="page-loading">
                <div class="loading-spinner"></div>
                <p>Loading ${page}...</p>
            </div>
        `;

        try {
            // In a real app, this would fetch HTML content
            // For now, we'll generate basic content
            const content = this.generatePageContent(page);
            container.innerHTML = content;
            
            // Initialize page-specific JavaScript
            await this.initializePageScripts(page);
        } catch (error) {
            console.error(`Failed to load page ${page}:`, error);
            container.innerHTML = this.generateErrorPage();
        }
    }

    generatePageContent(page) {
        const pageTemplates = {
            dashboard: `
                <div class="dashboard-page">
                    <h2>Dashboard</h2>
                    <div class="widgets-grid">
                        <div class="widget welcome-widget">
                            <h3>Welcome to TaskFlow Pro</h3>
                            <p>Your enterprise project management solution</p>
                        </div>
                        <div class="widget stats-widget">
                            <h4>Quick Stats</h4>
                            <div class="stats-grid">
                                <div class="stat-item">
                                    <span class="stat-number">0</span>
                                    <span class="stat-label">Projects</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-number">0</span>
                                    <span class="stat-label">Tasks</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-number">0</span>
                                    <span class="stat-label">Teams</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            projects: `
                <div class="projects-page">
                    <div class="page-header">
                        <h2>Projects</h2>
                        <button class="btn btn-primary" onclick="app.showCreateProjectModal()">
                            New Project
                        </button>
                    </div>
                    <div class="projects-list">
                        <p>No projects yet. Create your first project!</p>
                    </div>
                </div>
            `,
            login: `
                <div class="auth-page">
                    <div class="auth-container">
                        <h2>Login to TaskFlow Pro</h2>
                        <form id="loginForm" class="auth-form">
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" id="email" name="email" required>
                            </div>
                            <div class="form-group">
                                <label for="password">Password</label>
                                <input type="password" id="password" name="password" required>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block">Login</button>
                        </form>
                        <p class="auth-switch">
                            Don't have an account? <a href="#register">Register here</a>
                        </p>
                    </div>
                </div>
            `
        };

        return pageTemplates[page] || '<div class="error-page"><h2>Page not found</h2></div>';
    }

    // ... More methods for authentication, UI updates, etc.

    showFatalError(message) {
        document.body.innerHTML = `
            <div class="fatal-error">
                <h1>Application Error</h1>
                <p>${message}</p>
                <button onclick="location.reload()">Reload Application</button>
            </div>
        `;
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TaskFlowApp();
});
