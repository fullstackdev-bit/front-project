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
const Drafts = () => {
  const [content, setContent] = useState();
  const username = JSON.parse(localStorage.getItem('user')).username;

  useEffect(() => {
    sendRequest('email/drafts', 'POST', { username })
      .then((res) => {
        setContent(res?.msgs);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      sendRequest('email/drafts', 'POST', { username })
        .then((res) => {
          setContent(res?.msgs);
        })
        .catch((err) => console.log(err));
    }, 30000);

    return () => {
      clearInterval(timer);
    };
  });

  //   const changeReadState = (position, id) => {
  //     let mid_content = [...content];
  //     mid_content[position].sender_state =
  //       mid_content[position].sender_state == 2 ? 1 : 2;
  //     sendRequest('email/updatestate', 'POST', {
  //       id: parseId(id),
  //       inboxRead: mid_content[position].sender_state,
  //     })
  //       .then((res) => {
  //         setContent(mid_content);
  //         console.log(res);
  //       })
  //       .catch((err) => console.log(err));
  //   };
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
              <h1 className="h5 mb-3 font-weight-bolder">Drafts</h1>
            </div>
            {content?.map((item, i) => {
              return (
                <div className="card border-light mb-1 py-3 bg-soft" key={i}>
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
                      <span className="h6 text-sm">
                        {item.first_name} {item.last_name}
                      </span>
                    </div>
                    <div className="col col-lg-1 text-right px-0 order-lg-4">
                      <span className="text-muted small">
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
                    <div className="col-12 col-lg-5 d-flex align-items-center px-0">
                      <div className="col col-lg-11 px-0">
                        <div className="d-flex flex-wrap flex-lg-nowrap align-items-center">
                          <span className="col-12 col-lg pl-0 font-weight-normal text-dark d-none d-sm-block mt-2 mt-lg-0">
                            {item.subject}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Drafts;
