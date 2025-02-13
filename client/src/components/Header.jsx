import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className="bg-mossGreen shadow-md">
      <div className="flex justify-between items-center max-w-5xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex-wrap">
            <span className="text-lightGreen">Estate</span>
            <span className="text-deepGreen">Easy</span>
          </h1>
        </Link>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>

        <ul className="flex gap-4 items-center">
          <Link to="/">
            <li className="hidden sm:inline text-deepGreen hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-deepGreen hover:underline">
              About
            </li>
          </Link>

          {currentUser ? (
            <Link to="/profile">
              <img
                className="rounded-full h-9 w-9 object-cover border-2 border-white"
                src={currentUser.avatar}
                alt="User Avatar"
              />
            </Link>
          ) : (
            <Link to="/sign-in">
              <button className="bg-deepGreen text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition">
                Sign In
              </button>
            </Link>
          )}
        </ul>
      </div>
    </header>
  );
}
