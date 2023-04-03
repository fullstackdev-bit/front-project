import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { sendRequest } from '../config/compose';
import { useNavigate } from 'react-router-dom';
import Sidebar from './elements/Sidebar';
import { form, control, button } from 'react-validation';

// Define own Form component
const Form = (
  { getValues, validate, validateAll, showError, hideError, children, ...props } // destruct non-valid props
) => <form {...props}>{children}</form>;

// Define own Input component
const Input = ({ error, isChanged, isUsed, ...props }) => (
  <>
    <input {...props} />
    {isChanged && isUsed && error}
  </>
);

// Define own Button component
const Button = ({ hasErrors, ...props }) => {
  return <button {...props} disabled={hasErrors} />;
};

// Now call HOCs on components
const MyValidationForm = form(Form);
const MyValidationInput = control(Input);
const MyValidationButton = button(Button);

const moment = require('moment');
const fomatDate = (value) => {
  return moment(value).format('MMM Do');
};

const SingleMsg = () => {
  const params = useParams();
  const id = params.id;
  const inboxRead = 2;
  const sentRead = 2;
  const [content, setContent] = useState();
  const username = JSON.parse(localStorage.getItem('user')).username;

  const [showReply, setShowReply] = useState(false);

  const clickReply = () => {
    setShowReply(true);
  };

  let navigate = useNavigate();

  useEffect(() => {
    sendRequest('email/updatestate', 'POST', { id, inboxRead, sentRead })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));

    sendRequest('email/single', 'POST', { id })
      .then((res) => {
        setContent(res.msgs);
      })
      .catch((err) => navigate('/inbox'));
  }, []);

  const formDiv = useRef();
  const checkBtn = useRef();

  const [form, setForm] = useState({
    receiver_id: content ? content.sender_id : '',
    receiver_label_id: 1,
    sender_id: username,
    sender_label_id: 2,
    message: '',
    attachment: '',
    parent_id: id,
  });

  // const [successful, setSuccessful] = useState(false);
  const [errors, setErrors] = useState();

  const updateForm = (key, val) => {
    setForm((prv) => ({ ...prv, [key]: val }));
    setErrors(errors ? { ...errors, [key]: null } : null);
  };

  const handleMessage = (e) => {
    e.preventDefault();

    //setSuccessful(false);

    formDiv.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      console.log('sent' + form.subject);

      sendRequest('email', 'POST', form)
        .then((res) => {
          setShowReply(false);
        })
        .catch((err) => console.log(err));
    }
  };

  const saveDrafts = () => {
    if (form.message) {
      let draftsForm = { ...form };
      draftsForm.receiver_label_id = 3;
      draftsForm.sender_label_id = 3;

      sendRequest('email', 'POST', draftsForm)
        .then((res) => {
          setShowReply(false);
        })
        .catch((err) => console.log(err));
    } else {
      setShowReply(false);
    }
  };

  return (
    <section className="section section-lg bg-soft">
      <div className="container">
        <div className="row pt-5 pt-md-0">
          <Sidebar />
          <div className="col-8 col-lg-9">
            <div className="card border-light p-3 mb-4">
              <div className="card-header border-light p-3 mb-4 mb-md-0">
                <h3 className="h2 mb-4">{content?.subject}</h3>
                <div className="d-flex">
                  <div className="icon icon-shape icon-sm icon-shape-primary rounded-circle mr-3 mb-4 mb-md-0">
                    <svg
                      style={{ width: '1.2em' }}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="h5 font-weight-bold mb-1">
                      {username == content?.sender_id
                        ? 'Me'
                        : content?.first_name +
                          ' ' +
                          content?.last_name +
                          '<' +
                          content?.sender_id +
                          '@joker.com>'}
                    </h5>
                    <div className="small mt-2">
                      {username == content?.receiver_id
                        ? 'to me'
                        : 'to ' +
                          content?.first_name +
                          ' ' +
                          content?.last_name}
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body p-0 p-md-4">{content?.message}</div>
              <div className="card-footer border-light p-3">
                {showReply ? (
                  <div className="replay-form-wraper">
                    <MyValidationForm onSubmit={handleMessage} ref={formDiv}>
                      <div>
                        <div className="form-group">
                          <label htmlFor="message">
                            Reply to: {content?.sender_id}{' '}
                          </label>
                          <textarea
                            className="form-control"
                            name="message"
                            value={form.message}
                            onChange={(e) =>
                              updateForm('message', e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <MyValidationButton
                        style={{ display: 'none' }}
                        ref={checkBtn}
                      />
                    </MyValidationForm>
                    <div className="justify-content-between d-flex">
                      <button
                        type="button"
                        onClick={handleMessage}
                        className="btn btn-primary"
                      >
                        Send message
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        onClick={saveDrafts}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="btn btn-md btn-outline-black font-weight-bolder animate-up-2 mt-3"
                    onClick={clickReply}
                  >
                    <svg
                      className="d-inline mr-3"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      style={{ width: '15px', fill: 'currentcolor' }}
                    >
                      <path d="M205 34.8c11.5 5.1 19 16.6 19 29.2v64H336c97.2 0 176 78.8 176 176c0 113.3-81.5 163.9-100.2 174.1c-2.5 1.4-5.3 1.9-8.1 1.9c-10.9 0-19.7-8.9-19.7-19.7c0-7.5 4.3-14.4 9.8-19.5c9.4-8.8 22.2-26.4 22.2-56.7c0-53-43-96-96-96H224v64c0 12.6-7.4 24.1-19 29.2s-25 3-34.4-5.4l-160-144C3.9 225.7 0 217.1 0 208s3.9-17.7 10.6-23.8l160-144c9.4-8.5 22.9-10.6 34.4-5.4z" />
                    </svg>
                    <span className="d-inline">Reply</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SingleMsg;
