import './form.css';
import { useNavigate, Link } from "react-router-dom";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { createUser } from "../../api/userAPI";

function Adduser(){

    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();

      const [addError, setAddError] = useState(false);
      const navigate = useNavigate();
    
        async function handleAddUser(data) {
          try {
            const user = await createUser(data);
            navigate('/admin');
          } catch (err) {
            console.error("Create user error:", err);
            setAddError(true);
          }
      }

    return(
      <>
        <h2 className='addusertitle'>Add User</h2>
        <form className='add-user-form' onSubmit={handleSubmit(handleAddUser)}>
            <input className='add-field-input ' placeholder='Username' {...register("username", {
                required: "Username is required"})}/>
            {errors.username && <p className="error">{errors.username.message}</p>}

            <input className='add-field-input' type="email"
          placeholder="Email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Invalid email",
            },
          })}/>
        {errors.email && <p className="error">{errors.email.message}</p>}


            <input className='add-field-input'  type="password"
          placeholder="Password"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && <p className="error">{errors.password.message}</p>}
        <div className='buttons-div'>
          <button type="submit" className="submit-btn">Add user</button>
          <Link to='/admin'>
          <button className="cancel-btn submit-btn">
            Cancel
          </button> </Link>
        </div>
        
      </form>
      </>
    )
}

export default Adduser;