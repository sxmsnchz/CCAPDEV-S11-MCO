const AuthGuard = {
    // Check if user can access a page
    requireAuth: function(expectedUserType = null) {
        if (typeof auth === 'undefined') {
            console.error('Auth system not loaded');
            return {
                allowed: false,
                redirect: 'login.html',
                error: 'Authentication system error'
            };
        }
        
        const userInfo = auth.getCurrentUser();
        
        if (!userInfo.isLoggedIn) {
            return {
                allowed: false,
                redirect: 'login.html',
                error: 'Please log in to access this page'
            };
        }
        
        if (expectedUserType && userInfo.userType !== expectedUserType) {
            let redirectPage = 'index.html';
            
            switch(userInfo.userType) {
                case 'student':
                    redirectPage = 'profile-student.html';
                    break;
                case 'organization':
                    redirectPage = 'profile-organization.html';
                    break;
                case 'admin':
                    redirectPage = 'profile-admin.html';
                    break;
            }
            
            return {
                allowed: false,
                redirect: redirectPage,
                error: `Access denied. This page is for ${expectedUserType} accounts only.`
            };
        }
        
        return {
            allowed: true,
            userInfo: userInfo
        };
    },
    
    // Protect a page
    protectPage: function(expectedUserType = null) {
        const result = this.requireAuth(expectedUserType);
        
        if (!result.allowed) {
            if (result.error) {
                console.error('AuthGuard:', result.error);
                alert(result.error);
            }
            window.location.href = result.redirect;
            return null;
        }
        
        return result.userInfo;
    },
    
    isAuthenticated: function() {
        if (typeof auth === 'undefined') return false;
        return auth.isLoggedIn();
    },
    
    getCurrentUser: function() {
        if (typeof auth === 'undefined') return { isLoggedIn: false };
        return auth.getCurrentUser();
    }
};