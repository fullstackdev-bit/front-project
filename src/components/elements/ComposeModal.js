import React, { useState, useEffect, useRef } from 'react';
import { form, control, button } from 'react-validation';

//import { useDispatch } from 'react-redux';
import { sendRequest } from '../../config/compose';

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

const required = (value) => {
  if (!value) {
    return (
      <div className="invalid-feedback d-block" role="alert">
        This field is required!
      </div>
    );
  }
};

const ComposeModal = ({ onClose }) => {
  //const [content, setContent] = useState();
  const username = JSON.parse(localStorage.getItem('user')).username;

  //const dispatch = useDispatch();
  const formDiv = useRef();
  const checkBtn = useRef();

  const [form, setForm] = useState({
    receiver_id: '',
    receiver_label_id: 1,
    sender_id: username,
    sender_label_id: 2,
    subject: '',
    message: '',
    attachment: '',
    parent_id: '',
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
          onClose();
        })
        .catch((err) => console.log(err));
    }
  };

  const saveDrafts = () => {
    if (form.message || form.subject) {
      let draftsForm = { ...form };
      draftsForm.receiver_id =
        draftsForm.receiver_id == '' ? 'undefined' : draftsForm.receiver_id;
      draftsForm.receiver_label_id = 3;
      draftsForm.sender_label_id = 3;

      sendRequest('email', 'POST', draftsForm)
        .then((res) => {
          onClose();
        })
        .catch((err) => console.log(err));
    } else {
      onClose();
    }
  };

  return (
    <div className="modal" id="compos-modal">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">New Message</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={saveDrafts}
            ></button>
          </div>
          <div className="modal-body">
            <MyValidationForm onSubmit={handleMessage} ref={formDiv}>
              <div>
                <div className="mb-3">
                  <label htmlFor="receiver_id">Recipient:</label>
                  <MyValidationInput
                    type="text"
                    id="receiver_id"
                    className="form-control"
                    name="receiver_id"
                    value={form.receiver_id}
                    onChange={(e) => updateForm('receiver_id', e.target.value)}
                    validations={[required]}
                  />
                  {errors?.receiver_id && (
                    <div className="invalid-feedback d-block" role="alert">
                      {errors.receiver_id}
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="subject">subject:</label>
                  <MyValidationInput
                    type="text"
                    id="subject"
                    className="form-control"
                    name="subject"
                    value={form.subject}
                    onChange={(e) => updateForm('subject', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message:</label>
                  <textarea
                    className="form-control"
                    name="message"
                    value={form.message}
                    onChange={(e) => updateForm('message', e.target.value)}
                  />
                </div>
              </div>
              <MyValidationButton style={{ display: 'none' }} ref={checkBtn} />
            </MyValidationForm>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={saveDrafts}
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleMessage}
              className="btn btn-primary"
            >
              Send message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComposeModal;
