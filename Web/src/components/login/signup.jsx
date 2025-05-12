import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import { createUser } from "../../api/userAPI";

function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loginError, setLoginError] = useState(false);
  const navigate = useNavigate();

    async function handleSignup(data) {
      try {
        const user = await createUser(data);
        navigate(`/homepage`);
      } catch (err) {
        console.error("Signup error:", err);
        setLoginError(true);
      }
  }

return (
  <div className="login-container">
    {/* signup part */}
    <div className="login-left">
      <form className="login-form" onSubmit={handleSubmit(handleSignup)}>
        <h2>Sign up now!</h2>

        <input
          className="login-form-input"
          placeholder="Username"
          {...register("username", {
            required: "Username is required"
          })}
        />
        {errors.username && <p className="error">{errors.username.message}</p>}

        <input
            className="login-form-input"
            type="text"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email",
              },
            })}
          />
          {errors.email && <p className="error">{errors.email.message}</p>}

        <input
          className="login-form-input"
          type="password"
          placeholder="Password"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && <p className="error">{errors.password.message}</p>}

        <button type="submit" className="submit-btn">Create account</button>
      </form>
    </div>
    
    {/* login part thing */}
    <div className="login-right">
      <h2>Have an account?</h2>
      <p>Login now and listen to your favorite books!</p>
      <br/>
      <Link to="/">
        <button className="signup-btn">Log in</button>
      </Link>
    </div>
  </div>
);
}

export default Signup;