// auth.js - Enhanced Authentication system with session validation
class AuthSystem {
    constructor() {
        this.SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
        this.init();
    }

    init() {
        this.validateExistingSession();
    }

    validateExistingSession() {
        const storedUser = sessionStorage.getItem('orgspace_user');
        const storedType = sessionStorage.getItem('orgspace_userType');
        const storedTime = sessionStorage.getItem('orgspace_session_time');
        
        if (storedUser && storedType && storedTime) {
            const sessionAge = Date.now() - parseInt(storedTime);
            
            if (sessionAge > this.SESSION_TIMEOUT) {
                this.clearSession();
                return { isLoggedIn: false };
            }
            
            return {
                isLoggedIn: true,
                user: JSON.parse(storedUser),
                userType: storedType
            };
        }
        
        this.clearSession();
        return { isLoggedIn: false };
    }

    clearSession() {
        sessionStorage.removeItem('orgspace_user');
        sessionStorage.removeItem('orgspace_userType');
        sessionStorage.removeItem('orgspace_session_time');
    }

    createSession(user, userType) {
        sessionStorage.setItem('orgspace_user', JSON.stringify(user));
        sessionStorage.setItem('orgspace_userType', userType);
        sessionStorage.setItem('orgspace_session_time', Date.now().toString());
        
        this.scheduleSessionTimeout();
    }

    scheduleSessionTimeout() {
        setTimeout(() => {
            const storedTime = sessionStorage.getItem('orgspace_session_time');
            if (storedTime) {
                const sessionAge = Date.now() - parseInt(storedTime);
                if (sessionAge > this.SESSION_TIMEOUT) {
                    this.clearSession();
                    if (window.location.pathname.includes('profile-') || 
                        window.location.pathname.includes('admin')) {
                        window.location.href = 'login.html';
                    }
                }
            }
        }, this.SESSION_TIMEOUT + 5000); // Check 5 seconds after timeout
    }

    login(email, password, userType) {
        if (!email || !password || !userType) {
            return { 
                success: false, 
                message: 'All fields are required' 
            };
        }

        // Use hardcoded credentials for demo
        const demoCredentials = {
            'student': [
            { email: 'juan.delacruz@dlsu.edu.ph', password: 'password123' },
            { email: 'maria.santos@dlsu.edu.ph', password: 'password123' },
            { email: 'john.lim@dlsu.edu.ph', password: 'password123' }
            ],
            'organization': { email: 'codedh@dlsu.edu.ph', password: 'password123' },
            'admin': { email: 'admin@orgspace.dlsu.edu.ph', password: 'admin123' }
        };

        // Check if credentials match
        if (userType === 'student') {
        // Check if email and password match any student credentials
        const studentCred = demoCredentials.student.find(cred => 
            email === cred.email && password === cred.password
        );
        
        if (studentCred) {
            const user = this.createDemoUser(userType, email);
            this.createSession(user, userType);
            return {
                success: true,
                userType: userType,
                user: user
            };
        }
    } else if (demoCredentials[userType] && 
               email === demoCredentials[userType].email && 
               password === demoCredentials[userType].password) {
        
        // Create user object
        const user = this.createDemoUser(userType, email);
        this.createSession(user, userType);
        
        return {
            success: true,
            userType: userType,
            user: user
        };
    }
    
    return { 
        success: false, 
        message: 'Invalid email or password' 
    };
}
    // Create demo user based on type
    createDemoUser(userType, email) {
        const baseUser = {
            email: email,
            id: `${userType.toUpperCase()}001`,
            sessionId: this.generateSessionId()
        };

        switch(userType) {
            case 'student':
                // Return different user data based on email
            if (email === 'juan.delacruz@dlsu.edu.ph') {
                return {
                    ...baseUser,
                    firstName: 'Juan',
                    lastName: 'Dela Cruz',
                    studentId: '12345678',
                    course: 'BS Computer Science',
                    yearLevel: 3,
                    profileImage: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Jocelyn'
                };
            } else if (email === 'maria.santos@dlsu.edu.ph') {
                return {
                    ...baseUser,
                    firstName: 'Maria',
                    lastName: 'Santos',
                    studentId: '87654321',
                    course: 'BS Business Management',
                    yearLevel: 2,
                    profileImage: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Maria'
                };
            } else if (email === 'john.lim@dlsu.edu.ph') {
                return {
                    ...baseUser,
                    firstName: 'John',
                    lastName: 'Lim',
                    studentId: '11223344',
                    course: 'BS Information Systems',
                    yearLevel: 4,
                    profileImage: 'https://api.dicebear.com/9.x/adventurer/svg?seed=John'
                };
            }
            // Default student
            return {
                ...baseUser,
                firstName: 'Student',
                lastName: 'User',
                studentId: '00000000',
                course: 'General Studies',
                yearLevel: 1,
                profileImage: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Student'
            };
            case 'organization':
                return {
                    ...baseUser,
                    orgName: 'CodeDH',
                    description: 'Programming and Digital Humanities Organization',
                    profileImage: 'https://api.dicebear.com/7.x/shapes/svg?seed=codedh'
                };
            case 'admin':
                return {
                    ...baseUser,
                    firstName: 'Admin',
                    lastName: 'System',
                    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
                };
        }
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    logout() {
        this.clearSession();
        return { success: true, message: 'Logged out successfully' };
    }

    getCurrentUser() {
        return this.validateExistingSession();
    }

    isLoggedIn() {
        const session = this.validateExistingSession();
        return session.isLoggedIn;
    }

    verifySession() {
        const session = this.validateExistingSession();
        if (!session.isLoggedIn) {
            this.clearSession();
        }
        return session;
    }
}

const auth = new AuthSystem();

document.addEventListener('DOMContentLoaded', function() {
    auth.verifySession();
});