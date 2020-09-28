import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./app.scss";

const Register = () => {
  const history = useHistory();
  const [name, setName] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState(null);

  const loginHandler = async (e) => {
    e.preventDefault();
    const res = await axios.post("http://localhost:5000/api/login", {
      user_name: name,
      user_password: password,
    });
    if (res.data.authToken) {
      localStorage.setItem("auth", res.data.authToken);
      localStorage.setItem("id", res.data.userId);
      localStorage.setItem("name", name);
      console.log(res.data);
      history.push("/join");
    } else {
      setError(res.data.message);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <div>
        <label for="fname">Nick Name</label>
        <input
          type="text"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </div>
      <div>
        <label for="password">Password</label>
        <input
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </div>
      <div>
        Not have an account? <a href="/register">Here</a> to sign up.
      </div>
      <button
        onClick={(e) => {
          loginHandler(e);
        }}
      >
        Login
      </button>

      {error !== null && <p>{error}</p>}
    </div>
  );
};

export default Register;
