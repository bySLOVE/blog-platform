import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ArticlesList from './features/articles/ArticlesList';
import ArticlePage from './features/articles/ArticlePage';
import SignIn from './features/auth/SignIn';
import SignUp from './features/auth/SignUp';
import Header from './components/Header';
import Profile from './features/auth/Profile';
import CreateArticlePage from './features/articles/CreateArticlePage';
import EditArticlePage from './features/articles/EditArticlePage';
import PrivateRoute from './components/PrivateRoute';

const App = () => (
  <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<Navigate to="/articles" replace />} />
      <Route path="/articles" element={<ArticlesList />} />
      <Route path="/articles/:slug" element={<ArticlePage />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/new-article"
        element={
          <PrivateRoute>
            <CreateArticlePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/articles/:slug/edit"
        element={
          <PrivateRoute>
            <EditArticlePage />
          </PrivateRoute>
        }
      />
    </Routes>
  </BrowserRouter>
);

export default App;
