import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// import Form from "react-validation/build/form";
// import Input from "react-validation/build/input";
// import CheckButton from "react-validation/build/button";
import { form, control, button } from 'react-validation';

import { register } from '../store/actions/auth';

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

const vusername = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="invalid-feedback d-block" role="alert">
        The username must be between 3 and 20 characters.
      </div>
    );
  }
};

const vpassword = (value) => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="invalid-feedback d-block" role="alert">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};

const Register = () => {
  const dispatch = useDispatch();
  const formDiv = useRef();
  const checkBtn = useRef();

  let navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    password: '',
    firstname: '',
    lastname: '',
  });
  const [successful, setSuccessful] = useState(false);
  const [errors, setErrors] = useState();

  const updateForm = (key, val) => {
    setForm((prv) => ({ ...prv, [key]: val }));
    setErrors(errors ? { ...errors, [key]: null } : null);
  };

  const handleRegister = (e) => {
    e.preventDefault();

    setSuccessful(false);

    formDiv.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      dispatch(
        register(form.username, form.password, form.firstname, form.lastname)
      )
        .then(() => {
          console.log('aaa');
          setSuccessful(true);
          navigate('/login');
        })
        .catch((err) => {
          console.log(err);
          setErrors(err);
          setSuccessful(false);
        });
    }
  };

  return (
    <section className="min-vh-100 d-flex align-items-center section-image overlay-soft-dark py-5 py-lg-0 sign-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="text-center text-md-center mb-5 mt-md-0 text-white">
              <h1 className="mb-0 h3">Create an account</h1>
            </div>
          </div>
        </div>
        <div className="col-12 d-flex align-items-center justify-content-center">
          <div className="signin-inner mt-3 mt-lg-0 bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
            <MyValidationForm onSubmit={handleRegister} ref={formDiv}>
              {!successful && (
                <div>
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <div className="input-group mb-4">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <svg
                            style={{ width: '16px' }}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                          >
                            <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                          </svg>
                        </span>
                      </div>
                      <MyValidationInput
                        type="text"
                        id="username"
                        className="form-control"
                        name="username"
                        value={form.username}
                        onChange={(e) => updateForm('username', e.target.value)}
                        validations={[required, vusername]}
                      />
                      {errors?.username && (
                        <div className="invalid-feedback d-block" role="alert">
                          {errors.username}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <div className="form-group">
                        <label htmlFor="firstname">First Name</label>
                        <MyValidationInput
                          type="text"
                          id="firstname"
                          className="form-control"
                          name="first_name"
                          value={form.firstname}
                          onChange={(e) =>
                            updateForm('firstname', e.target.value)
                          }
                          validations={[required]}
                        />
                        {errors?.first_name && (
                          <div
                            className="invalid-feedback d-block"
                            role="alert"
                          >
                            {errors.first_name}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="form-group">
                        <label htmlFor="lastname">Last Name</label>
                        <MyValidationInput
                          type="text"
                          id="lastname"
                          className="form-control"
                          name="last_name"
                          value={form.lastname}
                          onChange={(e) =>
                            updateForm('lastname', e.target.value)
                          }
                          validations={[required]}
                        />
                        {errors?.last_name && (
                          <div
                            className="invalid-feedback d-block"
                            role="alert"
                          >
                            {errors.last_name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="input-group mb-4">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <svg
                            style={{ width: '16px' }}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                          >
                            <path d="M224 64c-44.2 0-80 35.8-80 80v48H384c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80V144C80 64.5 144.5 0 224 0c57.5 0 107 33.7 130.1 82.3c7.6 16 .8 35.1-15.2 42.6s-35.1 .8-42.6-15.2C283.4 82.6 255.9 64 224 64zm32 320c17.7 0 32-14.3 32-32s-14.3-32-32-32H192c-17.7 0-32 14.3-32 32s14.3 32 32 32h64z" />
                          </svg>
                        </span>
                      </div>
                      <MyValidationInput
                        type="password"
                        className="form-control"
                        name="password"
                        value={form.password}
                        onChange={(e) => updateForm('password', e.target.value)}
                        validations={[required, vpassword]}
                      />
                      {errors?.password && (
                        <div className="invalid-feedback d-block" role="alert">
                          {errors.password}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <button className="btn btn-primary btn-block">
                      Sign Up
                    </button>
                  </div>
                </div>
              )}

              <MyValidationButton style={{ display: 'none' }} ref={checkBtn} />
            </MyValidationForm>
            <div className="d-block d-sm-flex justify-content-center align-items-center mt-4">
              <span className="font-weight-normal">
                Already have an account?{' '}
                <a href="/login" className="font-weight-bold">
                  Login here
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
