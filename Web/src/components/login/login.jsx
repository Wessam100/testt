import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../../Context.jsx'
import "./Login.css";
import { login } from "../../api/userAPI";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();



  const { login: loginContext } = useAuth();
  const [loginError, setLoginError] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(data) {
    try {
      const response = await login(data);
      // console.log("log 1")
      // console.log("does this have a token: ", response)
      // console.log("or check here: ", response.token)
      
      loginContext(response.token);
      if (response.user.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/homepage');
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(true);
    }
  }

  return (
   <div className="login-container">
      <div className="login-left">
        <form className="login-form" onSubmit={handleSubmit(handleLogin)}>
          <h2>Login to Your Account</h2>

          <input
            className="login-form-input"
            type="text"
            placeholder="Email or Username"
            {...register("username", {
              required: "Username or Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._@-]{3,}$/,
                message: "Invalid input",
              },
            })}
          />
          {errors.username && <p className="error">{errors.username.message}</p>}

          <input
            className="login-form-input"
            type="password"
            placeholder="Password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && <p className="error">{errors.password.message}</p>}

          {loginError && (
            <p className="error">
              Email or password incorrect. Try again or sign up.
            </p>
          )}

          <button type="submit" className="submit-btn">Login</button>
        </form>
      </div>

      <div className="login-right">
        <h2>New Here?</h2>
        <p>Start your free reading journey today</p>
        <Link to="/signup">
          <button className="signup-btn">Sign up</button>
        </Link>
      </div>
    </div>
  );
}

export default Login;
