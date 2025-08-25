// Admin Functions
async function approveEvent(eventId) {
  await updateDoc(doc(db, 'events', eventId), { approved: true });
}

async function removeContent(contentId) {
  await deleteDoc(doc(db, 'userPosts', contentId));
}

// Real-time Admin Dashboard
function setupAdminDashboard() {
  if (!isAdmin()) return;
  
  // Listen for pending events
  const unsubscribeEvents = onSnapshot(
    query(collection(db, 'events'), where('approved', '==', false)),
    (snap) => {
      renderPendingEvents(snap.docs);
    }
  );
  
  // Listen for reported content
  const unsubscribeReports = onSnapshot(
    collection(db, 'reportedContent'),
    (snap) => {
      renderReports(snap.docs);
    }
  );
  
  return () => {
    unsubscribeEvents();
    unsubscribeReports();
  };
}

function isAdmin() {
  // Check if current user is in admins collection
  return auth.currentUser && 
         getDoc(doc(db, 'admins', auth.currentUser.uid)).then(d => d.exists());
}