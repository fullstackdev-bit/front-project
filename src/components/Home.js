import React, { useState, useEffect } from 'react';
import { sendRequest } from '../config/compose';
import { Link } from 'react-router-dom';
import Sidebar from './elements/Sidebar';

const moment = require('moment');
const fomatDate = (value) => {
  return moment(value).format('MMM Do');
};
const parseId = (id) => {
  return (id * 1 + 1000000005).toString(16);
};
const Home = () => {
  const [content, setContent] = useState();
  const username = JSON.parse(localStorage.getItem('user')).username;

  useEffect(() => {
    sendRequest('email/inbox', 'POST', { username })
      .then((res) => {
        setContent(res?.msgs);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      sendRequest('email/inbox', 'POST', { username })
        .then((res) => {
          setContent(res?.msgs);
        })
        .catch((err) => console.log(err));
    }, 30000);

    return () => {
      clearInterval(timer);
    };
  });

  const changeReadState = (position, id) => {
    let mid_content = [...content];
    mid_content[position].receiver_state =
      mid_content[position].receiver_state == 2 ? 1 : 2;
    sendRequest('email/updatestate', 'POST', {
      id: parseId(id),
      inboxRead: mid_content[position].receiver_state,
    })
      .then((res) => {
        setContent(mid_content);
        console.log(res);
      })
      .catch((err) => console.log(err));
  };
  const removeMsg = (position, id) => {
    let mid_content = [...content];
    mid_content.splice(position, 1);
    sendRequest('email/updatestate', 'POST', {
      id: parseId(id),
      inboxRemove: true,
    })
      .then((res) => {
        console.log(res);
        setContent(mid_content);
      })
      .catch((err) => console.log(err));
  };

  return (
    <section className="section section-lg bg-soft">
      <div className="container">
        <div className="row pt-5 pt-md-0">
          <Sidebar />
          <div className="col-8 col-lg-9">
            <div className="d-flex align-items-center mb-3">
              <h1 className="h5 mb-3 font-weight-bolder">Inbox</h1>
            </div>
            {content?.map((item, i) => {
              // if (item.receiver_label_id == 1) {
              return (
                <div
                  className={
                    item.receiver_state == 2
                      ? 'card border-light mb-1 py-3 bg-soft'
                      : 'card border-light mb-1 py-3 '
                  }
                  key={i}
                >
                  <div className="card-body d-flex align-items-center flex-wrap flex-lg-nowrap py-0">
                    <div className="col-auto col-lg-1 d-flex align-items-center px-0">
                      <div className="form-check inbox-check mr-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={'defaultCheck' + i}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={'defaultCheck' + i}
                        ></label>
                      </div>
                    </div>
                    <div className="col-lg-3 col-6 pl-0 ml-2">
                      <Link
                        to={'/single/' + parseId(item.id)}
                        className={
                          item.receiver_state == 2
                            ? 'h6 text-sm'
                            : 'h6 text-sm font-weight-bolder'
                        }
                      >
                        {item.first_name} {item.last_name}
                      </Link>
                    </div>
                    <div className="col col-lg-1 text-right px-0 order-lg-4">
                      <span
                        className={
                          item.receiver_state == 2
                            ? 'text-muted small'
                            : 'text-muted small font-weight-bolder'
                        }
                      >
                        {fomatDate(item.created)}
                      </span>
                    </div>
                    <div className="col col-lg-1 text-right px-0 order-lg-4">
                      <span
                        onClick={() => removeMsg(i, item.id)}
                        className="remove-message cursor-pointer"
                        title="Remove Message"
                      >
                        <svg
                          style={{ width: '11px' }}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 448 512"
                        >
                          <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                        </svg>
                      </span>
                    </div>
                    <div className="col col-lg-1 text-right px-0 order-lg-4">
                      <span
                        onClick={() => changeReadState(i, item.id)}
                        className={
                          item.receiver_state == 2
                            ? 'make-unread  cursor-pointer'
                            : 'make-read  cursor-pointer'
                        }
                        title={
                          item.receiver_state == 2
                            ? 'Make as unread'
                            : 'Make as read'
                        }
                      >
                        <svg
                          className="make-unread"
                          style={{ width: '15px' }}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                        >
                          <path d="M64 112c-8.8 0-16 7.2-16 16v22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1V128c0-8.8-7.2-16-16-16H64zM48 212.2V384c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V212.2L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64H448c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z" />
                        </svg>
                        <svg
                          className="make-read"
                          style={{ width: '15px' }}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                        >
                          <path d="M255.4 48.2c.2-.1 .4-.2 .6-.2s.4 .1 .6 .2L460.6 194c2.1 1.5 3.4 3.9 3.4 6.5v13.6L291.5 355.7c-20.7 17-50.4 17-71.1 0L48 214.1V200.5c0-2.6 1.2-5 3.4-6.5L255.4 48.2zM48 276.2L190 392.8c38.4 31.5 93.7 31.5 132 0L464 276.2V456c0 4.4-3.6 8-8 8H56c-4.4 0-8-3.6-8-8V276.2zM256 0c-10.2 0-20.2 3.2-28.5 9.1L23.5 154.9C8.7 165.4 0 182.4 0 200.5V456c0 30.9 25.1 56 56 56H456c30.9 0 56-25.1 56-56V200.5c0-18.1-8.7-35.1-23.4-45.6L284.5 9.1C276.2 3.2 266.2 0 256 0z" />
                        </svg>
                      </span>
                    </div>
                    <div className="col-12 col-lg-5 d-flex align-items-center px-0">
                      <div className="col col-lg-11 px-0">
                        <div className="d-flex flex-wrap flex-lg-nowrap align-items-center">
                          <Link
                            to={'/single/' + parseId(item.id)}
                            className={
                              item.receiver_state == 2
                                ? 'col-12 col-lg pl-0 font-weight-normal text-dark d-none d-sm-block mt-2 mt-lg-0'
                                : 'col-12 col-lg pl-0 font-weight-normal text-dark d-none d-sm-block mt-2 mt-lg-0 font-weight-bolder'
                            }
                          >
                            {item.subject}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
              // }
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
