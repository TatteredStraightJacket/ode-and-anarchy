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