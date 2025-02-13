import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      // spread form data and add the new value to the id of the input
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // post the form data to the server, prevent the default form submission to refresh the page
  // use setLoad to show loading state
  // use setError to show error message
  const handleSubmit = async (e) => {
    e.preventDefault();
    // add and try and catch for the front end
    try {
      dispatch(signInStart());
      // post the form data to the server
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      // get the response from the server
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      // navigate to the sign in page after signing up
      navigate("/sign-in");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-3">
      <div className="flex items-center h-screen">
        {/* SignUp Form */}
        <div className="w-full lg:w-1/3 flex justify-center max-w-7xl mx-auto p-3">
          <div className="p-3 max-w-md bg-white px-10 py-20 rounded-3xl border-2 border-gray-100">
            <h1 className="text-5xl font-semibold my-7">Create Account</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <div className="mb-5 flex flex-col">
                <label>Username</label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  className="w-full border-2 border-gray-100 p-3 rounded-xl mt-1 bg-transparent"
                  id="username"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-5 flex flex-col">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full border-2 border-gray-100 p-3 rounded-xl mt-1 bg-transparent"
                  id="email"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-5 flex flex-col gap-1">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full border-2 border-gray-100 p-3 rounded-xl mt-1 bg-transparent"
                  id="password"
                  onChange={handleChange}
                />
              </div>

              <button
                disabled={loading}
                className="active:scale-[.98] bg-deepGreen text-white p-3 rounded-xl hover:opacity-85 disabled:opacity-70"
              >
                {loading ? "Loading..." : "Sign Up"}
              </button>
            </form>

            <div className="flex mt-5 justify-between">
              <div className="flex gap-1 text-sm">
                <p>Already have an account?</p>
                <Link to={"/sign-in"}>
                  <span className="text-mossGreen">Sign in</span>
                </Link>
              </div>
            </div>

            {error && <p className="text-red-700 mt-5">{error}</p>}
          </div>
        </div>

        {/* Picture */}
        <div className="w-auto lg:w-1/2 hidden lg:flex justify-center items-center pr-5">
          <img
            src="https://www.thespruce.com/thmb/M9KPri57C950IxoIloqQd7Uqh6I=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/house-ninedesign-zannaoursurreynest3607-ZrL-ce37a3b733e34ea1a3a2e3f2103e1449.jpeg"
            alt="SignIn Image"
            className="w-100 aspect-square object-cover rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
