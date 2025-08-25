// Rearrange header for mobile view
const rearrangeHeader = () => {
  const header = document.querySelector('header');
  const logo = document.querySelector('.logo');
  const bottomRow = document.querySelector('.header-bottom-row');
  
  if (window.innerWidth <= 768) {
    if (!document.querySelector('.header-bottom-row')) {
      // Create bottom row if it doesn't exist
      const bottomRow = document.createElement('div');
      bottomRow.className = 'header-bottom-row';
      
      // Get elements to move to bottom row
      const burger = document.querySelector('.burger-menu');
      const auth = document.getElementById('auth-form');
      const theme = document.getElementById('theme-toggle');
      
      // Add elements to bottom row
      if (burger) bottomRow.appendChild(burger);
      if (auth) bottomRow.appendChild(auth);
      if (theme) bottomRow.appendChild(theme);
      
      // Add bottom row to header
      if (logo) {
        header.insertBefore(bottomRow, logo.nextSibling);
      } else {
        header.appendChild(bottomRow);
      }
    }
  } else {
    // For desktop: move elements back to original positions
    const bottomRow = document.querySelector('.header-bottom-row');
    if (bottomRow) {
      const burger = bottomRow.querySelector('.burger-menu');
      const auth = bottomRow.querySelector('#auth-form');
      const theme = bottomRow.querySelector('#theme-toggle');
      
      // Move elements back to header
      if (burger) header.insertBefore(burger, logo);
      if (auth) header.appendChild(auth);
      if (theme) header.appendChild(theme);
      
      // Remove bottom row container
      bottomRow.remove();
    }
  }
};

// Initial arrangement
rearrangeHeader();

// Rearrange on window resize
window.addEventListener('resize', rearrangeHeader);

// Burger Menu Functionality
document.addEventListener('DOMContentLoaded', () => {
    const burgerMenu = document.querySelector('.burger-menu');
    const navOverlay = document.querySelector('.nav-overlay');
    const navLinks = document.querySelectorAll('.nav-overlay ul li a');

    // Toggle the overlay when the burger menu is clicked
    burgerMenu.addEventListener('click', () => {
        burgerMenu.classList.toggle('active');
        navOverlay.classList.toggle('active');
    });

    // Close the overlay when clicking on a link inside it
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            burgerMenu.classList.remove('active');
            navOverlay.classList.remove('active');
        });
    });

    // Close the overlay when clicking outside of it
    document.addEventListener('click', (event) => {
        const isClickInsideOverlay = navOverlay.contains(event.target);
        const isClickOnBurgerMenu = burgerMenu.contains(event.target);

        if (!isClickInsideOverlay && !isClickOnBurgerMenu && navOverlay.classList.contains('active')) {
            burgerMenu.classList.remove('active');
            navOverlay.classList.remove('active');
        }
    });
});

// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');
    const prefersLightTheme = window.matchMedia('(prefers-color-scheme: light)').matches;

    // Set the initial theme
    const setTheme = (isLight) => {
        document.documentElement.setAttribute('data-theme', isLight ? 'light' : 'dark');
        themeToggle.innerHTML = isLight ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    };

    if ((prefersLightTheme && !currentTheme) || currentTheme === 'light') {
        setTheme(true);
    } else {
        setTheme(false);
    }

    // Toggle between dark and light themes
    themeToggle.addEventListener('click', () => {
        const isLightTheme = document.documentElement.getAttribute('data-theme') === 'light';
        setTheme(!isLightTheme);
    });
});

// Initialize AOS (Animate On Scroll) - Single initialization
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
});

// Hero Slider Functionality
document.addEventListener('DOMContentLoaded', () => {
    const heroSlider = document.querySelector('.hero-slider');
    const slides = document.querySelectorAll('.hero-slider .slide');
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');
    const indicators = document.querySelector('.slide-indicators');
    let currentSlide = 0;
    let slideInterval;

    // Create indicators
    slides.forEach((_, index) => {
        const indicator = document.createElement('span');
        indicator.addEventListener('click', () => goToSlide(index));
        indicators.appendChild(indicator);
    });

    // Update indicators
    const updateIndicators = () => {
        const indicatorDots = indicators.querySelectorAll('span');
        indicatorDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    };

    // Go to specific slide
    const goToSlide = (slideIndex) => {
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === slideIndex);
        });
        currentSlide = slideIndex;
        updateIndicators();
        resetInterval();
    };

    // Next slide
    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % slides.length;
        goToSlide(currentSlide);
    };

    // Previous slide
    const prevSlide = () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(currentSlide);
    };

    // Auto slide
    const startInterval = () => {
        slideInterval = setInterval(nextSlide, 5000);
    };

    // Reset interval
    const resetInterval = () => {
        clearInterval(slideInterval);
        startInterval();
    };

    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Start slider
    goToSlide(0);
    startInterval();

    // Pause on hover
    heroSlider.addEventListener('mouseenter', () => clearInterval(slideInterval));
    heroSlider.addEventListener('mouseleave', startInterval);
});

// Dynamic Content Tabs
document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');

            // Load content dynamically if empty
            loadTabContent(tabId);
        });
    });

    // Load initial tab content
    loadTabContent('featured');
});

// Load content for tabs
function loadTabContent(tabId) {
    const contentGrid = document.querySelector(`#${tabId} .content-grid`);
    
    // Only load if empty
    if (contentGrid.children.length === 0) {
        contentGrid.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i></div>';
        
        // Simulate loading (replace with actual Firebase data loading)
        setTimeout(() => {
            let contentHTML = '';
            
            switch(tabId) {
                case 'featured':
                    contentHTML = `
                        <div class="content-card" data-aos="fade-up">
                            <img src="https://source.unsplash.com/random/400x300/?metal" alt="Featured Metal">
                            <h3>Featured Band</h3>
                            <p>Check out our featured metal band of the month!</p>
                            <a href="#" class="btn">Learn More</a>
                        </div>
                        <div class="content-card" data-aos="fade-up" data-aos-delay="100">
                            <img src="https://source.unsplash.com/random/400x300/?tattoo" alt="Featured Tattoo">
                            <h3>Artist Spotlight</h3>
                            <p>Meet our featured tattoo artist and their amazing work.</p>
                            <a href="#" class="btn">View Gallery</a>
                        </div>
                        <div class="content-card" data-aos="fade-up" data-aos-delay="200">
                            <img src="https://source.unsplash.com/random/400x300/?poetry" alt="Featured Poetry">
                            <h3>Poem of the Week</h3>
                            <p>Read this week's featured poem from our community.</p>
                            <a href="#" class="btn">Read Now</a>
                        </div>
                    `;
                    break;
                    
                case 'events':
                    contentHTML = `
                        <div class="content-card" data-aos="fade-up">
                            <img src="https://source.unsplash.com/random/400x300/?concert" alt="Upcoming Event">
                            <h3>Metal Night</h3>
                            <p>Fri, Oct 15 @ 8:00 PM</p>
                            <p>The Dark Alley Club</p>
                            <a href="#" class="btn">Get Tickets</a>
                        </div>
                        <div class="content-card" data-aos="fade-up" data-aos-delay="100">
                            <img src="https://source.unsplash.com/random/400x300/?tattoo-convention" alt="Tattoo Event">
                            <h3>Tattoo Expo</h3>
                            <p>Sat, Oct 23 @ 10:00 AM</p>
                            <p>Convention Center</p>
                            <a href="#" class="btn">Learn More</a>
                        </div>
                        <div class="content-card" data-aos="fade-up" data-aos-delay="200">
                            <img src="https://source.unsplash.com/random/400x300/?poetry-reading" alt="Poetry Event">
                            <h3>Poetry Slam</h3>
                            <p>Thu, Oct 28 @ 7:00 PM</p>
                            <p>The Underground Cafe</p>
                            <a href="#" class="btn">RSVP</a>
                        </div>
                    `;
                    break;
                    
                case 'poetry':
                    contentHTML = `
                        <div class="content-card" data-aos="fade-up">
                            <h3>"Rebellion"</h3>
                            <p class="poem-preview">The fire burns within my soul,<br>
                            A story only metal can tell...</p>
                            <a href="#" class="btn">Read Full Poem</a>
                        </div>
                        <div class="content-card" data-aos="fade-up" data-aos-delay="100">
                            <h3>"Ink and Blood"</h3>
                            <p class="poem-preview">The needle sings its painful song,<br>
                            Etching memories where they belong...</p>
                            <a href="#" class="btn">Read Full Poem</a>
                        </div>
                        <div class="content-card" data-aos="fade-up" data-aos-delay="200">
                            <h3>"Scream of the Voiceless"</h3>
                            <p class="poem-preview">Silenced no more, I find my sound,<br>
                            In riffs and words that shake the ground...</p>
                            <a href="#" class="btn">Read Full Poem</a>
                        </div>
                    `;
                    break;
            }
            
            contentGrid.innerHTML = contentHTML;
        }, 800);
    }
}

// Back to Top Button
document.addEventListener('DOMContentLoaded', () => {
    const backToTopBtn = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// Newsletter Form Submission
document.addEventListener('DOMContentLoaded', () => {
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            // Add to Firebase collection
            db.collection('newsletter').add({
                email: email,
                subscribedAt: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                alert('Thanks for subscribing to our newsletter!');
                emailInput.value = '';
            })
            .catch(error => {
                console.error('Error subscribing:', error);
                alert('There was an error. Please try again.');
            });
        });
    }
});

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBqnkXnAPzOhMb9O-Z6SsSJdKdutPl50BY",
    authDomain: "ode-and-anarchy.firebaseapp.com",
    projectId: "ode-and-anarchy",
    storageBucket: "ode-and-anarchy.firebasestorage.app",
    messagingSenderId: "70787014804",
    appId: "1:70787014804:web:6eb9e97013afa9a66b5481",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

// Event Form Submission
const eventForm = document.getElementById('eventForm');
if (eventForm) {
    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const eventData = {
            name: document.getElementById('eventName').value,
            date: new Date(document.getElementById('eventDate').value),
            location: document.getElementById('eventLocation').value,
            description: document.getElementById('eventDescription').value,
            ticketLink: document.getElementById('eventTicketLink').value || null,
            approved: false,
        };

        db.collection('events').add(eventData)
            .then(() => {
                alert('Event submitted successfully!');
                eventForm.reset();
            })
            .catch((error) => {
                console.error('Error adding event: ', error);
                alert('An error occurred. Please try again.');
            });
    });
}

// Display Events
const eventList = document.getElementById('eventList');
if (eventList) {
    function renderEvent(doc) {
        const eventCard = document.createElement('div');
        eventCard.classList.add('card');

        const eventName = document.createElement('h3');
        eventName.textContent = doc.data().name;

        const eventDate = document.createElement('p');
        eventDate.textContent = `Date: ${doc.data().date.toDate().toLocaleDateString()}`;

        const eventLocation = document.createElement('p');
        eventLocation.textContent = `Location: ${doc.data().location}`;

        const eventDescription = document.createElement('p');
        eventDescription.textContent = doc.data().description;

        eventCard.appendChild(eventName);
        eventCard.appendChild(eventDate);
        eventCard.appendChild(eventLocation);
        eventCard.appendChild(eventDescription);

        if (doc.data().ticketLink) {
            const eventTicketLink = document.createElement('a');
            eventTicketLink.href = doc.data().ticketLink;
            eventTicketLink.textContent = 'Get Tickets';
            eventTicketLink.target = '_blank';
            eventCard.appendChild(eventTicketLink);
        }

        eventList.appendChild(eventCard);
    }

    // Fetch and Display Events
    db.collection('events')
        .where('approved', '==', true)
        .orderBy('date')
        .onSnapshot((snapshot) => {
            eventList.innerHTML = '';
            snapshot.forEach(doc => renderEvent(doc));
        });
}

// Comments Section Functionality
document.addEventListener('DOMContentLoaded', () => {
    const commentsList = document.getElementById('comments-list');
    const addCommentForm = document.getElementById('add-comment-form');

    if (commentsList && addCommentForm) {
        // Function to render a single comment
        function renderComment(doc) {
            const commentDiv = document.createElement('div');
            commentDiv.classList.add('card');

            const commentContent = document.createElement('div');
            commentContent.innerHTML = doc.data().content;

            const commentAuthor = document.createElement('small');
            commentAuthor.textContent = `By: ${doc.data().author || 'Anonymous'}`;

            const commentDate = document.createElement('small');
            commentDate.textContent = new Date(doc.data().timestamp.toDate()).toLocaleString();

            commentDiv.appendChild(commentContent);
            commentDiv.appendChild(commentAuthor);
            commentDiv.appendChild(commentDate);

            commentsList.appendChild(commentDiv);
        }

        // Fetch and display comments
        db.collection('comments')
            .where('approved', '==', true)
            .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) => {
                commentsList.innerHTML = '';
                snapshot.forEach(doc => renderComment(doc));
            });

        // Add a new comment
        addCommentForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const user = auth.currentUser;
            if (!user) {
                alert('Please sign in to post a comment.');
                return;
            }

            const commentContent = tinymce.get('comment-content').getContent();

            db.collection('comments').add({
                content: commentContent,
                author: user.email,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                approved: false,
            })
            .then(() => {
                addCommentForm.reset();
                tinymce.get('comment-content').setContent('');
            })
            .catch((error) => {
                console.error('Error adding comment: ', error);
                alert('An error occurred. Please try again.');
            });
        });
    }
});

// Initialize Firebase Authentication
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('User is signed in:', user.email);
        document.getElementById('add-comment-form').style.display = 'block';
    } else {
        console.log('User is signed out');
        document.getElementById('add-comment-form').style.display = 'none';
    }
});

// TinyMCE Initialization
tinymce.init({
    selector: '#comment-content',
    plugins: 'link lists',
    toolbar: 'bold italic | bullist numlist | link',
    menubar: false,
    height: 200,
});

// Feed Submission Functionality
const feedForm = document.getElementById('feed-form');
if (feedForm) {
    feedForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const postType = document.getElementById('post-type').value;
        const postFile = document.getElementById('post-file').files[0];
        const postDescription = document.getElementById('post-description').value;

        // Save file to Firebase Storage
        const storageRef = storage.ref(`posts/${postFile.name}`);
        await storageRef.put(postFile);
        const fileUrl = await storageRef.getDownloadURL();

        // Save post data to Firestore
        await db.collection('posts').add({
            type: postType,
            fileUrl: fileUrl,
            description: postDescription,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            ratings: [],
            comments: []
        });

        alert('Post submitted successfully!');
        feedForm.reset();
    });
}

// Display Feed
const feedContainer = document.getElementById('feed-container');
if (feedContainer) {
    db.collection('posts')
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
            feedContainer.innerHTML = ''; // Clear existing posts
            snapshot.forEach((doc) => {
                const post = doc.data();
                const postElement = document.createElement('div');
                postElement.classList.add('post');
                postElement.innerHTML = `
                    <h3>${post.type}</h3>
                    <p>${post.description}</p>
                    ${post.type === 'music' ? `<audio controls><source src="${post.fileUrl}" type="audio/mpeg"></audio>` : ''}
                    ${post.type === 'video' ? `<video controls><source src="${post.fileUrl}" type="video/mp4"></video>` : ''}
                    ${post.type === 'poetry' || post.type === 'tattoo' ? `<img src="${post.fileUrl}" alt="${post.description}">` : ''}
                    <div class="ratings">
                        <span class="stars">★★★★☆</span>
                        <span class="comments">${post.comments.length} comments</span>
                    </div>
                `;
                feedContainer.appendChild(postElement);
            });
        });
}

// Sticky Header
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const heroSection = document.querySelector('.hero-section');
    
    if (header && heroSection) {
        const heroHeight = heroSection.offsetHeight;
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > heroHeight) {
                header.classList.add('sticky');
            } else {
                header.classList.remove('sticky');
            }
        });
    }
});

// Modal Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">&times;</button>
            <h2>Join Ode & Anarchy</h2>
            <form id="join-form">
                <input type="email" placeholder="Email" required>
                <input type="password" placeholder="Password" required>
                <button type="submit" class="btn">Sign Up</button>
            </form>
            <p class="modal-footer">Already a member? <a href="#" class="login-link">Log in</a></p>
        </div>
    `;
    document.body.appendChild(modal);

    // Modal toggle function
    const toggleModal = (show) => {
        modal.style.display = show ? 'flex' : 'none';
        document.body.classList.toggle('modal-open', show);
    };

    // Open modal when clicking Join Now
    document.querySelector('.join-now-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        toggleModal(true);
    });

    // Close modal
    modal.querySelector('.close-modal')?.addEventListener('click', () => toggleModal(false));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) toggleModal(false);
    });

    // Form submission
    document.getElementById('join-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        const password = e.target.querySelector('input[type="password"]').value;
        
        // Add your Firebase signup logic here
        console.log('Signing up with:', email, password);
        alert('Signup functionality will be implemented with Firebase');
        
        toggleModal(false);
    });
});

