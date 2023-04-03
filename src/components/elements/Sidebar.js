import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import ComposeModal from './ComposeModal';

const Sidebar = () => {
  const [showCompose, setShowCompose] = useState(false);

  const clickCompose = () => {
    setShowCompose(true);
  };

  const modalClose = () => {
    setShowCompose(false);
  };

  useEffect(() => {}, []);
  return (
    <div className="col-4 col-md-3">
      <div className="card border-light p-2">
        <div className="card-body p-2">
          <button
            className="btn btn-md btn-outline-black font-weight-bolder animate-up-2 mb-3"
            onClick={clickCompose}
          >
            <svg
              className="d-inline mr-3"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              style={{ width: '15px', fill: 'currentcolor' }}
            >
              <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
            </svg>
            <span className="d-inline">Compose</span>
          </button>
          <div className="list-group dashboard-menu list-group-sm">
            <NavLink
              to="/inbox"
              className={({ isActive }) =>
                isActive
                  ? 'd-flex list-group-item list-group-item-action  border-0 active'
                  : 'd-flex list-group-item list-group-item-action  border-0'
              }
            >
              Inbox
              <span className="icon icon-xs ml-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                  style={{ width: '9px', fill: 'currentColor' }}
                >
                  <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                </svg>
              </span>
            </NavLink>
          </div>
          <div className="list-group dashboard-menu list-group-sm">
            <NavLink
              to="/sent"
              className="d-flex list-group-item list-group-item-action"
            >
              Sent
              <span className="icon icon-xs ml-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                  style={{ width: '9px', fill: 'currentColor' }}
                >
                  <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                </svg>
              </span>
            </NavLink>
          </div>
          <div className="list-group dashboard-menu list-group-sm">
            <NavLink
              to="/drafts"
              className="d-flex list-group-item list-group-item-action"
            >
              Drafts
              <span className="icon icon-xs ml-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                  style={{ width: '9px', fill: 'currentColor' }}
                >
                  <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                </svg>
              </span>
            </NavLink>
          </div>
          <div className="list-group dashboard-menu list-group-sm">
            <NavLink
              to="/trash"
              className="d-flex list-group-item list-group-item-action"
            >
              Trash
              <span className="icon icon-xs ml-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                  style={{ width: '9px', fill: 'currentColor' }}
                >
                  <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                </svg>
              </span>
            </NavLink>
          </div>
        </div>
      </div>
      {showCompose && <ComposeModal onClose={modalClose} />}
    </div>
  );
};

export default Sidebar;
