const app = {
    currentUser: null,
    currentPage: 'home',

    init() {
        this.checkSession();
        this.setupEventListeners();
        this.renderInitialPage();
    },

    checkSession() {
        const user = localStorage.getItem('lifecareUser');
        if (user) {
            this.currentUser = JSON.parse(user);
        }
    },

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                this.navigateTo(page);
            }
        });
    },

    renderInitialPage() {
        if (this.currentUser) {
            this.showDashboard();
        } else {
            this.showLoginPage();
        }
    },

    showLoginPage() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="login-container">
                <form class="login-form" id="loginForm">
                    <h2>Login to LifeCare</h2>
                    <div class="error-message" id="errorMsg"></div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="email" required placeholder="Enter your email">
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" id="password" required placeholder="Enter your password">
                    </div>
                    <div class="form-group">
                        <label>Role</label>
                        <select id="role" required>
                            <option value="">Select your role</option>
                            <option value="Nursing Student">Nursing Student</option>
                            <option value="Student">Student</option>
                            <option value="Professional">Professional</option>
                        </select>
                    </div>
                    <button type="submit" class="login-button">Login</button>
                </form>
            </div>
        `;

        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
    },

    handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;
        const errorMsg = document.getElementById('errorMsg');

        // Simple validation (for demo purposes)
        if (email && password && role) {
            const user = {
                email: email,
                role: role,
                nickname: email.split('@')[0],
                createdAt: new Date().toISOString()
            };

            localStorage.setItem('lifecareUser', JSON.stringify(user));
            this.currentUser = user;
            this.showDashboard();
        } else {
            errorMsg.textContent = 'Invalid login credentials!';
            errorMsg.classList.add('show');
            setTimeout(() => {
                errorMsg.classList.remove('show');
            }, 3000);
        }
    },

    showDashboard() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <nav class="navbar">
                <div class="navbar-brand">LifeCare</div>
                <button class="hamburger" id="hamburger">☰</button>
                <ul class="nav-links" id="navLinks">
                    <li><a href="#" class="nav-link" data-page="dashboard">Dashboard</a></li>
                    <li><a href="#" class="nav-link" data-page="planner">Planner</a></li>
                    <li><a href="#" class="nav-link" data-page="health">Health</a></li>
                    <li><a href="#" class="nav-link" data-page="mental">Mental Health</a></li>
                    <li><a href="#" class="nav-link" data-page="daily">Daily Tools</a></li>
                    <li><a href="#" class="nav-link" data-page="support">Support</a></li>
                </ul>
                <div class="user-section">
                    <div class="user-info">
                        Hi, ${this.currentUser.nickname}
                        <a href="#" class="profile-link" onclick="app.showProfile(); return false;">Profile</a>
                    </div>
                    <button class="logout-btn" onclick="app.logout(); return false;">Logout</button>
                </div>
            </nav>
            <div class="dashboard-container">
                <aside class="sidebar">
                    <a href="#" class="sidebar-link active" data-page="dashboard">Dashboard</a>
                    <a href="#" class="sidebar-link" data-page="planner">Smart Academic Planner</a>
                    <a href="#" class="sidebar-link" data-page="health">Health & Wellness</a>
                    <a href="#" class="sidebar-link" data-page="mental">Mental Health</a>
                    <a href="#" class="sidebar-link" data-page="daily">Daily Life Tools</a>
                    <a href="#" class="sidebar-link" data-page="support">Student Support</a>
                    <a href="#" class="sidebar-link" data-page="profile">Profile</a>
                </aside>
                <main class="main-content" id="mainContent">
                    <div id="dashboardPage" class="page active">
                        <div class="dashboard-header">
                            <h1 class="dashboard-title">Dashboard</h1>
                            <div class="user-greeting">Welcome back, ${this.currentUser.nickname}!</div>
                        </div>
                        <div class="dashboard-grid">
                            <div class="dashboard-card" onclick="app.openFeature('planner')">
                                <h3>Smart Academic Planner</h3>
                                <div class="card-stat">0</div>
                                <div class="card-label">Tasks</div>
                                <div class="dashboard-card-content">Manage your academic schedule and tasks</div>
                            </div>
                            <div class="dashboard-card" onclick="app.openFeature('health')">
                                <h3>Health & Wellness</h3>
                                <div class="card-stat">0ml</div>
                                <div class="card-label">Water Intake</div>
                                <div class="dashboard-card-content">Track your health metrics</div>
                            </div>
                            <div class="dashboard-card" onclick="app.openFeature('mental')">
                                <h3>Mental Health</h3>
                                <div class="card-stat">-</div>
                                <div class="card-label">Mood Status</div>
                                <div class="dashboard-card-content">Monitor your emotional well-being</div>
                            </div>
                            <div class="dashboard-card" onclick="app.openFeature('daily')">
                                <h3>Daily Life Tools</h3>
                                <div class="card-stat">0</div>
                                <div class="card-label">Habits</div>
                                <div class="dashboard-card-content">Manage daily routines and expenses</div>
                            </div>
                        </div>
                    </div>

                    <div id="plannerPage" class="page">
                        <h2>Smart Academic Planner</h2>
                        <button onclick="app.openModal('addTask')" class="cta-button" style="margin: 2rem 0;">Add New Task</button>
                        <div id="taskList"></div>
                    </div>

                    <div id="healthPage" class="page">
                        <h2>Health & Wellness Monitoring</h2>
                        <div class="features-grid">
                            <div class="feature-card" onclick="app.openModal('waterIntake')">
                                <h3>Water Intake Tracker</h3>
                                <p>Track your daily water intake in milliliters</p>
                            </div>
                            <div class="feature-card" onclick="app.openModal('sleep')">
                                <h3>Sleep Monitoring</h3>
                                <p>Log your sleep duration and patterns</p>
                            </div>
                            <div class="feature-card" onclick="app.openModal('medication')">
                                <h3>Medication Reminders</h3>
                                <p>Set medication reminders and dosages</p>
                            </div>
                            <div class="feature-card" onclick="app.openModal('nutrition')">
                                <h3>Meal & Nutrition Logs</h3>
                                <p>Track your meals and nutritional intake</p>
                            </div>
                            <div class="feature-card" onclick="app.openModal('activity')">
                                <h3>Physical Activity Tracking</h3>
                                <p>Log your daily physical activities</p>
                            </div>
                        </div>
                    </div>

                    <div id="mentalPage" class="page">
                        <h2>Mental Health & Stress Support</h2>
                        <div class="features-grid">
                            <div class="feature-card" onclick="app.openModal('mood')">
                                <h3>Mood Tracker</h3>
                                <p>Track and log your daily mood</p>
                            </div>
                            <div class="feature-card" onclick="app.openModal('stress')">
                                <h3>Stress Level Check-in</h3>
                                <p>Rate your stress levels from 1-10</p>
                            </div>
                            <div class="feature-card" onclick="app.openModal('breathing')">
                                <h3>Breathing Exercises</h3>
                                <p>Practice guided breathing exercises</p>
                            </div>
                            <div class="feature-card" onclick="app.openModal('journal')">
                                <h3>Journaling</h3>
                                <p>Reflect on your day with journaling</p>
                            </div>
                        </div>
                    </div>

                    <div id="dailyPage" class="page">
                        <h2>Daily Life Management Tools</h2>
                        <div class="features-grid">
                            <div class="feature-card" onclick="app.openModal('habits')">
                                <h3>Habit Tracker</h3>
                                <p>Track your daily habits and routines</p>
                            </div>
                            <div class="feature-card" onclick="app.openModal('budget')">
                                <h3>Budget & Expense Tracker</h3>
                                <p>Manage your finances and expenses</p>
                            </div>
                            <div class="feature-card" onclick="app.openModal('notes')">
                                <h3>Personal Notes</h3>
                                <p>Keep personal notes and checklists</p>
                            </div>
                            <div class="feature-card" onclick="app.openModal('contacts')">
                                <h3>Emergency Contacts</h3>
                                <p>Store emergency contacts and resources</p>
                            </div>
                        </div>
                    </div>

                    <div id="supportPage" class="page">
                        <h2>Student Support System</h2>
                        <div class="features-grid">
                            <div class="feature-card" onclick="app.openModal('peer')">
                                <h3>Peer Support</h3>
                                <p>Connect with peers and communities</p>
                            </div>
                            <div class="feature-card" onclick="app.openModal('encouragement')">
                                <h3>Academic Encouragement</h3>
                                <p>Get motivational support for your studies</p>
                            </div>
                            <div class="feature-card" onclick="app.openModal('selfcare')">
                                <h3>Self-Care Recommendations</h3>
                                <p>Personalized self-care suggestions</p>
                            </div>
                            <div class="feature-card" onclick="app.openModal('reminders')">
                                <h3>Productivity Insights</h3>
                                <p>Get personalized reminders and insights</p>
                            </div>
                        </div>
                    </div>

                    <div id="profilePage" class="page">
                        <div class="profile-page">
                            <h2>User Profile</h2>
                            <form id="profileForm">
                                <div class="form-group">
                                    <label>Nickname</label>
                                    <input type="text" id="nickInput" value="${this.currentUser.nickname}">
                                </div>
                                <div class="form-group">
                                    <label>Email</label>
                                    <input type="email" id="emailInput" value="${this.currentUser.email}" disabled>
                                </div>
                                <div class="form-group">
                                    <label>Role</label>
                                    <input type="text" id="roleInput" value="${this.currentUser.role}" disabled>
                                </div>
                                <button type="submit" class="btn-submit">Save Changes</button>
                            </form>
                        </div>
                    </div>
                </main>
            </div>

            <div id="modal" class="modal">
                <div class="modal-content" id="modalContent"></div>
            </div>
        `;

        // Setup navigation
        this.setupDashboardNav();
        // Setup profile form
        this.setupProfileForm();
    },

    setupDashboardNav() {
        document.querySelectorAll('.nav-link, .sidebar-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                this.showPage(page);
            });
        });

        // Hamburger menu
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');
        if (hamburger) {
            hamburger.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });
        }
    },

    showPage(page) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(page + 'Page').classList.add('active');

        document.querySelectorAll('.nav-link, .sidebar-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === page) {
                link.classList.add('active');
            }
        });
    },

    openFeature(feature) {
        this.showPage(feature);
    },

    openModal(type) {
        const modal = document.getElementById('modal');
        const modalContent = document.getElementById('modalContent');

        const modals = {
            addTask: `
                <div class="modal-header">
                    <h2>Add New Task</h2>
                    <button class="close-btn" onclick="app.closeModal()">&times;</button>
                </div>
                <form onsubmit="app.addTask(event)">
                    <div class="form-group">
                        <label>Task Title</label>
                        <input type="text" id="taskTitle" required>
                    </div>
                    <div class="form-group">
                        <label>Due Date</label>
                        <input type="date" id="taskDate" required>
                    </div>
                    <div class="form-group">
                        <label>Priority</label>
                        <select id="taskPriority">
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                        </select>
                    </div>
                    <button type="submit" class="btn-submit">Add Task</button>
                </form>
            `,
            waterIntake: `
                <div class="modal-header">
                    <h2>Water Intake Tracker</h2>
                    <button class="close-btn" onclick="app.closeModal()">&times;</button>
                </div>
                <form onsubmit="app.logWater(event)">
                    <div class="form-group">
                        <label>Water Intake (ml)</label>
                        <input type="number" id="waterAmount" placeholder="e.g., 250" required>
                    </div>
                    <div class="form-group">
                        <label>Time</label>
                        <input type="time" id="waterTime" required>
                    </div>
                    <button type="submit" class="btn-submit">Log Water</button>
                </form>
            `,
            sleep: `
                <div class="modal-header">
                    <h2>Sleep Monitoring</h2>
                    <button class="close-btn" onclick="app.closeModal()">&times;</button>
                </div>
                <form onsubmit="app.logSleep(event)">
                    <div class="form-group">
                        <label>Sleep Duration (hours)</label>
                        <input type="number" id="sleepHours" placeholder="e.g., 8" step="0.5" required>
                    </div>
                    <div class="form-group">
                        <label>Sleep Quality</label>
                        <select id="sleepQuality">
                            <option>Poor</option>
                            <option>Fair</option>
                            <option>Good</option>
                            <option>Excellent</option>
                        </select>
                    </div>
                    <button type="submit" class="btn-submit">Log Sleep</button>
                </form>
            `,
            medication: `
                <div class="modal-header">
                    <h2>Medication Reminders</h2>
                    <button class="close-btn" onclick="app.closeModal()">&times;</button>
                </div>
                <form onsubmit="app.addMedication(event)">
                    <div class="form-group">
                        <label>Medication Name</label>
                        <input type="text" id="medName" required>
                    </div>
                    <div class="form-group">
                        <label>Dosage</label>
                        <input type="text" id="medDose" placeholder="e.g., 500mg" required>
                    </div>
                    <div class="form-group">
                        <label>Time</label>
                        <input type="time" id="medTime" required>
                    </div>
                    <button type="submit" class="btn-submit">Add Reminder</button>
                </form>
            `,
            nutrition: `
                <div class="modal-header">
                    <h2>Meal & Nutrition Logs</h2>
                    <button class="close-btn" onclick="app.closeModal()">&times;</button>
                </div>
                <form onsubmit="app.logNutrition(event)">
                    <div class="form-group">
                        <label>Meal Description</label>
                        <textarea id="mealDesc" placeholder="What did you eat?" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Calories</label>
                        <input type="number" id="calories" placeholder="e.g., 500" required>
                    </div>
                    <button type="submit" class="btn-submit">Log Meal</button>
                </form>
            `,
            activity: `
                <div class="modal-header">
                    <h2>Physical Activity Tracking</h2>
                    <button class="close-btn" onclick="app.closeModal()">&times;</button>
                </div>
                <form onsubmit="app.logActivity(event)">
                    <div class="form-group">
                        <label>Activity Type</label>
                        <input type="text" id="activityType" placeholder="e.g., jogging" required>
                    </div>
                    <div class="form-group">
                        <label>Duration (minutes)</label>
                        <input type="number" id="activityDuration" placeholder="e.g., 30" required>
                    </div>
                    <button type="submit" class="btn-submit">Log Activity</button>
                </form>
            `,
            mood: `
                <div class="modal-header">
                    <h2>Mood Tracker</h2>
                    <button class="close-btn" onclick="app.closeModal()">&times;</button>
                </div>
                <form onsubmit="app.logMood(event)">
                    <div class="form-group">
                        <label>How are you feeling today?</label>
                        <select id="moodSelect">
                            <option>Happy</option>
                            <option>Sad</option>
                            <option>Stressed</option>
                            <option>Anxious</option>
                            <option>Calm</option>
                            <option>Excited</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Notes</label>
                        <textarea id="moodNotes" placeholder="Add any notes..."></textarea>
                    </div>
                    <button type="submit" class="btn-submit">Log Mood</button>
                </form>
            `,
            stress: `
                <div class="modal-header">
                    <h2>Stress Level Check-in</h2>
                    <button class="close-btn" onclick="app.closeModal()">&times;</button>
                </div>
                <form onsubmit="app.logStress(event)">
                    <div class="form-group">
                        <label>Stress Level (1-10)</label>
                        <input type="range" id="stressLevel" min="1" max="10" value="5">
                        <div style="text-align: center; margin-top: 1rem; font-size: 1.5rem; color: var(--primary-blue);"><span id="stressValue">5</span>/10</div>
                    </div>
                    <button type="submit" class="btn-submit">Log Stress Level</button>
                </form>
            `,
            breathing: `
                <div class="modal-header">
                    <h2>Breathing Exercises</h2>
                    <button class="close-btn" onclick="app.closeModal()">&times;</button>
                </div>
                <div class="breathing-exercise">
                    <div class="breathing-circle" id="breathingCircle">Inhale</div>
                    <button class="btn-submit" id="startBreathing">Start Exercise</button>
                    <p style="text-align: center; color: #666; margin-top: 1rem;">Take deep breaths and follow the circle movement</p>
                </div>
            `,
            journal: `
                <div class="modal-header">
                    <h2>Journaling</h2>
                    <button class="close-btn" onclick="app.closeModal()">&times;</button>
                </div>
                <form onsubmit="app.saveJournal(event)">
                    <div class="form-group">
                        <label>Today's Reflection</label>
                        <textarea id="journalEntry" placeholder="What made you stressed today? One thing you're grateful for?" required style="min-height: 150px;"></textarea>
                    </div>
                    <button type="submit" class="btn-submit">Save Entry</button>
                </form>
            `,
            habits: `
                <div class="modal-header">
                    <h2>Habit Tracker</h2>
                    <button class="close-btn" onclick="app.closeModal()">&times;</button>
                </div>
                <form onsubmit="app.addHabit(event)">
                    <div class="form-group">
                        <label>Habit</label>
                        <input type="text" id="habitName" placeholder="e.g., Exercise" required>
                    </div>
                    <div class="form-group">
                        <label>Goal</label>
                        <input type="text" id="habitGoal" placeholder="e.g., 30 minutes" required>
                    </div>
                    <button type="submit" class="btn-submit">Add Habit</button>
                </form>
            `,
            budget: `
                <div class="modal-header">
                    <h2>Budget & Expense Tracker</h2>
                    <button class="close-btn" onclick="app.closeModal()">&times;</button>
                </div>
                <form onsubmit="app.logExpense(event)">
                    <div class="form-group">
                        <label>Category</label>
                        <select id="expenseCategory">
                            <option>Groceries</option>
                            <option>Transportation</option>
                            <option>Leisure</option>
                            <option>Utilities</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Amount</label>
                        <input type="number" id="expenseAmount" placeholder="e.g., 50.00" step="0.01" required>
                    </div>
                    <button type="submit" class="btn-submit">Log Expense</button>
                </form>
            `,
            notes: `
                <div class="modal-header">
                    <h2>Personal Notes</h2>
                    <button class="close-btn" onclick="app.closeModal()">&times;</button>
                </div>
                <form onsubmit="app.addNote(event)">
                    <div class="form-group">
                        <label>Note</label>
                        <textarea id="noteContent" placeholder="Quick reminder or to-do item..." required></textarea>
                    </div>
                    <button type="submit" class="btn-submit">Add Note</button>
                </form>
            `,
            contacts: `
                <div class="modal-header">
                    <h2>Emergency Contacts</h2>
                    <button class="close-btn" onclick="app.closeModal()">&times;</button>
                </div>
                <form onsubmit="app.addContact(event)">
                    <div class="form-group">
                        <label>Contact Name</label>
                        <input type="text" id="contactName" required>
                    </div>
                    <div class="form-group">
                        <label>Relationship</label>
                        <input type="text" id="contactRelation" placeholder="e.g., Mother" required>
                    </div>
                    <div class="form-group">
                        <label>Phone Number</label>
                        <input type="tel" id="contactPhone" required>
                    </div>
                    <button type="submit" class="btn-submit">Add Contact</button>
                </form>
            `,
            peer: `
                <div class="modal-header">
                    <h2>Peer Support</h2>
                    <button class="close-btn" onclick="app.closeModal()">&times;</button>
                </div>
                <div style="padding: 1rem;">
                    <p>Connect with peers who share similar interests and academic goals.</p>
                    <button class="btn-submit" style="margin-top: 1rem;">Find Study Groups</button>
                </div>
            `,
            encouragement: `
                <div class="modal-header">
                    <h2>Academic Encouragement</h2>
                    <button class="close-btn" onclick="app.closeModal()">&times;</button>
                </div>
                <div style="padding: 1rem;">
                    <p>Keep going! You're making great progress. Set your academic goals and we'll help you achieve them.</p>
                    <button class="btn-submit" style="margin-top: 1rem;">Set Goals</button>
                </div>
            `,
            selfcare: `
                <div class="modal-header">
                    <h2>Self-Care Recommendations</h2>
                    <button class="close-btn" onclick="app.closeModal()">&times;</button>
                </div>
                <div style="padding: 1rem;">
                    <p>Based on your stress levels, we recommend:</p>
                    <ul style="margin-left: 1rem; margin-top: 1rem;">
                        <li>Take a 5-minute break</li>
                        <li>Practice deep breathing</li>
                        <li>Go for a short walk</li>
                        <li>Drink some water</li>
                    </ul>
                </div>
            `,
            reminders: `
                <div class="modal-header">
                    <h2>Productivity Insights</h2>
                    <button class="close-btn" onclick="app.closeModal()">&times;</button>
                </div>
                <div style="padding: 1rem;">
                    <p>You tend to complete tasks better in the morning. Keep it up!</p>
                    <p style="margin-top: 1rem;">Reminder: Don't forget to take breaks between study sessions.</p>
                </div>
            `
        };

        modalContent.innerHTML = modals[type] || 'Modal not found';
        modal.classList.add('active');

        // Setup event listeners for specific modals
        if (type === 'stress') {
            const stressLevel = document.getElementById('stressLevel');
            const stressValue = document.getElementById('stressValue');
            stressLevel.addEventListener('input', () => {
                stressValue.textContent = stressLevel.value;
            });
        }
        if (type === 'breathing') {
            document.getElementById('startBreathing').addEventListener('click', () => {
                const circle = document.getElementById('breathingCircle');
                circle.style.animation = 'breathe 8s infinite';
            });
        }
    },

    closeModal() {
        document.getElementById('modal').classList.remove('active');
    },

    addTask(e) {
        e.preventDefault();
        const title = document.getElementById('taskTitle').value;
        const date = document.getElementById('taskDate').value;
        const priority = document.getElementById('taskPriority').value;
        alert(`Task added: ${title} on ${date} (${priority} priority)`);
        this.closeModal();
    },

    logWater(e) {
        e.preventDefault();
        const amount = document.getElementById('waterAmount').value;
        alert(`Logged ${amount}ml of water`);
        this.closeModal();
    },

    logSleep(e) {
        e.preventDefault();
        const hours = document.getElementById('sleepHours').value;
        alert(`Logged ${hours} hours of sleep`);
        this.closeModal();
    },

    addMedication(e) {
        e.preventDefault();
        const name = document.getElementById('medName').value;
        alert(`Medication reminder added for ${name}`);
        this.closeModal();
    },

    logNutrition(e) {
        e.preventDefault();
        const meal = document.getElementById('mealDesc').value;
        alert(`Meal logged: ${meal}`);
        this.closeModal();
    },

    logActivity(e) {
        e.preventDefault();
        const activity = document.getElementById('activityType').value;
        alert(`Activity logged: ${activity}`);
        this.closeModal();
    },

    logMood(e) {
        e.preventDefault();
        const mood = document.getElementById('moodSelect').value;
        alert(`Mood logged: ${mood}`);
        this.closeModal();
    },

    logStress(e) {
        e.preventDefault();
        const stress = document.getElementById('stressLevel').value;
        alert(`Stress level logged: ${stress}/10`);
        this.closeModal();
    },

    saveJournal(e) {
        e.preventDefault();
        alert('Journal entry saved');
        this.closeModal();
    },

    addHabit(e) {
        e.preventDefault();
        const habit = document.getElementById('habitName').value;
        alert(`Habit added: ${habit}`);
        this.closeModal();
    },

    logExpense(e) {
        e.preventDefault();
        const amount = document.getElementById('expenseAmount').value;
        alert(`Expense logged: ${amount}`);
        this.closeModal();
    },

    addNote(e) {
        e.preventDefault();
        const note = document.getElementById('noteContent').value;
        alert('Note added');
        this.closeModal();
    },

    addContact(e) {
        e.preventDefault();
        const name = document.getElementById('contactName').value;
        alert(`Contact added: ${name}`);
        this.closeModal();
    },

    setupProfileForm() {
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const newNickname = document.getElementById('nickInput').value;
                this.currentUser.nickname = newNickname;
                localStorage.setItem('lifecareUser', JSON.stringify(this.currentUser));
                alert('Profile updated successfully!');
            });
        }
    },

    showProfile() {
        this.showPage('profile');
    },

    logout() {
        localStorage.removeItem('lifecareUser');
        this.currentUser = null;
        this.showLoginPage();
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}
