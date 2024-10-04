"use client";
import axios from "axios";
import React, { useRef } from "react";
const Login = ({ setSign }) => {
  const emailRef = useRef();
  const passWordRef = useRef();
  const handleSubmit = async () => {
    const details = {
      email: emailRef.current.value,
      password: passWordRef.current.value,
    };
    try {
      const response = await axios.post("/api/users/login", details);
      emailRef.current.value = "";
      passWordRef.current.value = "";
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };
  const handleForgotPassword = () => {};
  return (
    <>
      <div className="flex flex-col absolute w-3/4 top-[20vh] right-[12.5vw] md:w-1/2 md:top-1/4 md:right-1/4 gap-2 justify-center content-center flex-wrap border-1  rounded-xl p-3 bg-slate-950 bg-opacity-50 drop-shadow-[0rem_0rem_0.5rem_rgba(50,250,250,0.5)]">
        <div className="font-black text-2xl w-full text-center text-white font-serif">
          Login
        </div>
        <div>
          <label
            htmlFor="email"
            className="block font-bold text-fuchsia-300 w-full"
          >
            Email:
          </label>
          <input
            type="email"
            placeholder="enter your institute email"
            className="bg-slate-800 text-white px-2 py-1 text-sm lg:text-xl sm:text-lg rounded-xl w-full"
            ref={emailRef}
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block font-bold text-fuchsia-300"
          >
            Password:
          </label>
          <input
            type="password"
            placeholder="enter password"
            className="bg-slate-800 text-white px-2 py-1 text-sm lg:text-xl sm:text-lg rounded-xl w-full"
            ref={passWordRef}
          />
          <p className="text-sm text-right" onClick={handleForgotPassword}>
            forgot password?
          </p>
          <div className="content-center justify-evenly flex mt-2">
            <button
              type="submit"
              className="bg-fuchsia-600 rounded-xl px-3 p-1 text-lg font-bold text-fuchsia-300 my-2"
              onClick={handleSubmit}
            >
              Log In
            </button>
            <button
              type="submit"
              className="bg-fuchsia-600 rounded-xl px-3 p-1 text-lg font-bold text-fuchsia-300 my-2"
              onClick={() => {
                setSign(true);
              }}
            >
              Join
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
