import React from "react";

const Login = () => {
  return (
    <div className="container">
      <div className="header">
        <div className="text">CondoMAXium</div>
      </div>
      <div className="input">
        <img src="" alt="" />
        <input type="email" />
      </div>
      <div className="input">
        <img src="" alt="" />
        <input type="password" />
      </div>
      <div className="submit-container">
        <div className="submit">Login</div>
        <div className="submit" onClick="">
          Create New Account
        </div>
      </div>
    </div>
  );
};

export default Login;
