import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import Playbar from './components/playbar/playbar';
import Login from './components/login/login';
import SignUp from './components/login/signup';
import Admin from './components/admin/admin.jsx';
import Addbook from './components/admin/addbook.jsx';
import Adduser from './components/admin/adduser.jsx';
import UploadPlaybar from './components/playbar/upload_playbar.jsx';
import AuthorProfile from './components/profile/AuthorProfile.jsx';
import DisplayBooks from './components/displaybooks/displaybooks.jsx';
import Playlist from './components/playlist/Playlist.jsx';
import Book from './components/book/BookView.jsx';
import BrowseCategories from './components/browsecategories/browsecategories.jsx';
import CategoryBooks from './components/Categorypage/catagorypage.jsx';
import Settings from './components/settings/settings.jsx';
import { AuthProvider, useAuth } from './Context.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import EditProfile from './components/settings/editprofile.jsx';
import Streamer from './components/streamer/streamer.jsx';
import Listener from './components/listener/listener.jsx';
import { BookProvider, useBook } from './components/playlist/BookContext';

function RoutesWrapper() {
  const location = useLocation();
  const path = location.pathname;
  const { user } = useAuth();
  const { selectedBookId } = useBook(); 

  const hidePlaybar = path === '/' || path === '/signup' || path.startsWith('/admin');

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          {user?.isAdmin ? (
            <>
              <Route path="/admin/adduser" element={<ProtectedRoute><Adduser /></ProtectedRoute>} />
              <Route path="/admin/addbook" element={<ProtectedRoute><Addbook /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            </>
          ) : (
            <>
              <Route path="/profile/:username" element={<AuthorProfile />} />
              <Route path="/homepage" element={<ProtectedRoute><DisplayBooks /></ProtectedRoute>} />
              <Route path="/playlist/:name" element={<Playlist />} />
              <Route path="/book/:title" element={<Book />} />
              <Route path="/browsecategories" element={<BrowseCategories />} />
              <Route path="/browsecategories/:id" element={<CategoryBooks />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/editprofile" element={<EditProfile />} />
              <Route path="/streamer" element={<Streamer />} />
              <Route path="/listener" element={<Listener />} />
            </>
          )}
        </Routes>
      </div>
      {!hidePlaybar  && <Playbar bookId={selectedBookId} />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BookProvider>
        <RoutesWrapper />
      </BookProvider>
    </AuthProvider>
  );
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

export default App;