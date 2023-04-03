import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './fontawesome';
import './assets/css/style.css';

import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Sent from './components/Sent';
import Drafts from './components/Drafts';
import Trash from './components/Trash';
import SingleMsg from './components/SingleMsg';
import Profile from './components/Profile';

import { loadMe, logout } from './store/actions/auth';
import NotFound from './components/404';

const App = () => {
  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);

  const { user: currentUser } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  useEffect(() => {
    dispatch(loadMe());
  }, [dispatch]);

  return (
    <div>
      {currentUser ? (
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={'/'} className="navbar-brand">
            bezKoder
          </Link>
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={'/profile'} className="nav-link">
                {currentUser.username}
              </Link>
            </li>
            <li className="nav-item">
              <a href="/login" className="nav-link" onClick={logOut}>
                LogOut
              </a>
            </li>
          </div>
        </nav>
      ) : (
        <></>
      )}
      <main>
        <Routes>
          {!currentUser ? (
            <>
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/register" element={<Register />} />
              <Route
                exact={false}
                path="*"
                element={<Navigate to={'/login'} />}
              />
            </>
          ) : (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/inbox" element={<Home />} />
              <Route exact={false} path="/single/:id" element={<SingleMsg />} />
              <Route path="/sent" element={<Sent />} />
              <Route path="/drafts" element={<Drafts />} />
              <Route path="/trash" element={<Trash />} />
              <Route path="/profile" element={<Profile />} />
              <Route exact path="/login" element={<Navigate to={'/inbox'} />} />
              <Route
                exact
                path="/register"
                element={<Navigate to={'/login'} />}
              />
              <Route path="*" exact={false} element={<NotFound />} />
            </>
          )}
        </Routes>
      </main>
    </div>
  );
};

export default App;
