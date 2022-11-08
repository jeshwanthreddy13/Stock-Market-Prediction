
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./login.module.css";
import { useForm } from "react-hook-form";
import config from "../../config";

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState();
  const history = useNavigate();

  const onSubmit = (data, e) => {
    setMessage({
      data: "Login is in progress...",
      type: "alert-warning",
    });
    fetch(`${config.baseUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(({ error, data }) => {
        setMessage({
          data: error || "Logged in successfully, redirecting...",
          type: error ? "alert-danger" : "alert-success",
        });
        !error &&
          setTimeout(() => {
            localStorage.setItem("token", data.token);
            history.push("/dashboard");
          }, 3000);

        !error && e.target.reset();
        if (!error){
          setTimeout(function(){
            window.location.href = 'dashboard';
         }, 4000);
        }
      });

  };

  return (
    <div
      className={`${styles.container} container-fluid d-flex align-items-center justify-content-center`}
    >
      <div className={styles.loginFormContainer}>
        {message && (
          <div
            className={`alert fade show d-flex ${message.type}`}
            role="alert"
          >
            {message.data}
            <span
              aria-hidden="true"
              className="ml-auto cursor-pointer"
              onClick={() => setMessage(null)}
            >
              &times;
            </span>
          </div>
        )}
        <fieldset className="border p-3 rounded">
          <legend
            className={`${styles.loginFormLegend} border rounded p-1 text-center`}
          >
            Login Form
          </legend>
          <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
            <div className="form-group">
              <label htmlFor="inputForEmail">Email address</label>
              <span className="mandatory">*</span>
              <input
                id="inputForEmail"
                type="email"
                className="form-control"
                aria-describedby="Enter email address"
                placeholder="Enter email address"
                {...register("email", {
                    required: "Enter a email id",
                })}
              />
              {errors.email && (
                <span className={`${styles.errorMessage} mandatory`}>
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="inputForPassword">Password</label>
              <span className="mandatory">*</span>
              <input
                type="password"
                className="form-control"
                id="inputForPassword"
                placeholder="Enter password"
                {...register("password", {
                    required: "Enter a password",
                })}
              />
              {errors.password && (
                <span className={`${styles.errorMessage} mandatory`}>
                  {errors.password.message}
                </span>
              )}
            </div><br/>
            <div className="d-flex align-items-center justify-content-center">
              <button type="submit" className="btn btn-outline-danger">
                Login
              </button>
              </div> <br/>
              <div className="d-flex align-items-center justify-content-center">
                <a href="/register" className="link-danger">New User? Click to Register</a>
            </div>
          </form>
        </fieldset>
      </div>
    </div>
  );
};

export default Login;