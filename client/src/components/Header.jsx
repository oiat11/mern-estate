import React from "react";
import {FaSearch} from 'react-icons/fa'

export default function Header() {
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <h1 className="font-bold text-sm sm:text-xl flex-wrap">
          <span className="text-slate-500">Estate</span>
          <span className="text-slate-600">Easy</span>
        </h1>
        <form className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input type="text" placeholder="Search..." className='bg-transparent focus:outline-none w-24 sm:w-64'></input>
          <FaSearch className="text-slate-600"/>
        </form>
      </div>
    </header>
  );
}
