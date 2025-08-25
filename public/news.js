// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBqnkXnAPzOhMb9O-Z6SsSJdKdutPl50BY",
    authDomain: "ode-and-anarchy.firebaseapp.com",
    projectId: "ode-and-anarchy",
    storageBucket: "ode-and-anarchy.firebasestorage.app",
    messagingSenderId: "70787014804",
    appId: "1:70787014804:web:6eb9e97013afa9a66b5481"
  };
  
  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  // DOM Elements
  const addArticleForm = document.getElementById("add-article-form");
  const articleList = document.getElementById("article-list");
  
  // Add Article
  addArticleForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("article-title").value;
    const content = document.getElementById("article-content").value;
  
    db.collection("articles").add({
      title,
      content,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
      .then(() => {
        console.log("Article added!");
        addArticleForm.reset();
      })
      .catch((error) => {
        console.error("Error adding article:", error);
      });
  });
  
  // Display Articles
  function displayArticles() {
    db.collection("articles")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        articleList.innerHTML = "";
        snapshot.forEach((doc) => {
          const article = doc.data();
          const articleElement = document.createElement("div");
          articleElement.classList.add("article");
          articleElement.innerHTML = `
            <h3>${article.title}</h3>
            <p>${article.content}</p>
            <div class="comment-section">
              <h4>Comments</h4>
              <form id="comment-form-${doc.id}">
                <input type="text" placeholder="Add a comment" required>
                <button type="submit">Post</button>
              </form>
              <div class="comment-list" id="comment-list-${doc.id}"></div>
            </div>
          `;
          articleList.appendChild(articleElement);
  
          // Add Comment
          const commentForm = document.getElementById(`comment-form-${doc.id}`);
          commentForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const commentInput = commentForm.querySelector("input");
            const comment = commentInput.value;
  
            db.collection("articles").doc(doc.id).collection("comments").add({
              comment,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
              .then(() => {
                console.log("Comment added!");
                commentInput.value = "";
              })
              .catch((error) => {
                console.error("Error adding comment:", error);
              });
          });
  
          // Display Comments
          db.collection("articles").doc(doc.id).collection("comments")
            .orderBy("timestamp", "asc")
            .onSnapshot((commentSnapshot) => {
              const commentList = document.getElementById(`comment-list-${doc.id}`);
              commentList.innerHTML = "";
              commentSnapshot.forEach((commentDoc) => {
                const comment = commentDoc.data();
                const commentElement = document.createElement("div");
                commentElement.classList.add("comment");
                commentElement.innerHTML = `<p>${comment.comment}</p>`;
                commentList.appendChild(commentElement);
              });
            });
        });
      });
  }
  
  // Load Articles on Page Load
  displayArticles();