// Auth functionality
document.addEventListener('DOMContentLoaded', () => {
  // DOM elements
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const signOutBtn = document.getElementById('sign-out');
  const googleSignInBtn = document.getElementById('google-signin');
  const welcomeMessage = document.getElementById('welcome-message');
  const userEmailDisplay = document.getElementById('user-email');
  const authErrorBox = document.getElementById('auth-error');
  const switchToLoginBtn = document.getElementById('switch-to-login');
  const resetPasswordLink = document.getElementById('reset-password-link');
  const loginBtn = document.querySelector('.login-btn');
  const dropdownContent = document.querySelector('.dropdown-content');

  // Helper: Show error
  const showError = (msg) => {
    if (authErrorBox) {
      authErrorBox.textContent = msg;
      authErrorBox.classList.remove('hidden');
      setTimeout(() => {
        authErrorBox.classList.add('hidden');
      }, 5000);
    }
  };

  // Toggle forms
  const toggleForms = (showLogin) => {
    loginForm.classList.toggle('hidden', !showLogin);
    signupForm.classList.toggle('hidden', showLogin);
  };

  // Toggle dropdown visibility
  const toggleDropdown = (show) => {
    dropdownContent.classList.toggle('hidden', !show);
  };

  // Mock auth functions - replace with real Firebase auth
  function mockAuth() {
    return {
      signInWithEmailAndPassword: (email, password) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (email && password) {
              resolve({ user: { email } });
            } else {
              reject(new Error('Invalid email or password'));
            }
          }, 500);
        });
      },
      createUserWithEmailAndPassword: (email, password) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (email && password) {
              resolve({ user: { email } });
            } else {
              reject(new Error('Invalid email or password'));
            }
          }, 500);
        });
      },
      signOut: () => {
        return new Promise(resolve => {
          setTimeout(() => resolve(), 500);
        });
      },
      onAuthStateChanged: (callback) => {
        // Mock user state
        const user = localStorage.getItem('mockUser') ? 
          { email: localStorage.getItem('mockUser') } : null;
        callback(user);
        
        // Listen for storage changes
        window.addEventListener('storage', () => {
          const updatedUser = localStorage.getItem('mockUser') ? 
            { email: localStorage.getItem('mockUser') } : null;
          callback(updatedUser);
        });
      }
    };
  }

  const auth = mockAuth(); // Replace with your Firebase auth

  // Google Sign-In
  googleSignInBtn?.addEventListener('click', async () => {
    try {
      // Mock Google sign-in
      localStorage.setItem('mockUser', 'user@gmail.com');
      window.dispatchEvent(new Event('storage'));
      showError('Google sign-in successful (mock)');
    } catch (err) {
      console.error(err);
      showError(err.message);
    }
  });

  // Email/Password Login
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm['login-email'].value.trim();
    const password = loginForm['login-password'].value;

    try {
      await auth.signInWithEmailAndPassword(email, password);
      localStorage.setItem('mockUser', email);
      window.dispatchEvent(new Event('storage'));
      loginForm.reset();
    } catch (err) {
      console.error(err);
      showError(err.message);
    }
  });

  // Email/Password Signup
  signupForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = signupForm['signup-email'].value.trim();
    const password = signupForm['signup-password'].value;

    try {
      await auth.createUserWithEmailAndPassword(email, password);
      localStorage.setItem('mockUser', email);
      window.dispatchEvent(new Event('storage'));
      signupForm.reset();
    } catch (err) {
      console.error(err);
      showError(err.message);
    }
  });

  // Sign Out
  signOutBtn?.addEventListener('click', async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('mockUser');
      window.dispatchEvent(new Event('storage'));
      toggleDropdown(false);
    } catch (err) {
      console.error(err);
      showError(err.message);
    }
  });

  // Switch between login/signup forms
  switchToLoginBtn?.addEventListener('click', () => toggleForms(true));
  resetPasswordLink?.addEventListener('click', (e) => {
    e.preventDefault();
    const email = loginForm['login-email'].value.trim();
    if (email) {
      showError(`Password reset email sent to ${email} (mock)`);
    } else {
      showError('Please enter your email first');
    }
  });

  // Toggle dropdown when clicking login button
  loginBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown(!dropdownContent.classList.contains('hidden'));
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#auth-form')) {
      toggleDropdown(false);
    }
  });

  // Auth State Listener
  auth.onAuthStateChanged((user) => {
    const isSignedIn = !!user;
    
    if (isSignedIn) {
      welcomeMessage.classList.remove('hidden');
      loginForm.classList.add('hidden');
      signupForm.classList.add('hidden');
      if (userEmailDisplay) {
        userEmailDisplay.textContent = user.email;
      }
      loginBtn.textContent = 'Account';
    } else {
      welcomeMessage.classList.add('hidden');
      toggleForms(true);
      if (userEmailDisplay) {
        userEmailDisplay.textContent = '';
      }
      loginBtn.textContent = 'Login';
    }
  });
});