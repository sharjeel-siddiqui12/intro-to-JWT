import { useEffect, useState } from "react";

import { Routes, Route, Link, Navigate } from "react-router-dom";

import Home from "./components/home/Home";
import About from "./components/about/About";
import Gallery from "./components/gallery/Gallery";
import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [fullName, setFullName] = useState("");

  const logoutHandler = () => {};

  return (
    <div className="container mx-auto p-4">
      <ul className="flex justify-between items-center mt-4 py-2 bg-gradient-to-r from-gray-100 to-gray-300 shadow-lg rounded-lg mb-9 p-5">
        {isLogin ? (
          <>
            <li className="ml-auto">
              <span className="text-gray-700 font-semibold">{userName}</span>{" "}
            </li>

            <div className="flex-grow flex justify-center">
              <li className="mr-6">
                <Link
                  to={`/`}
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
                >
                  Home
                </Link>
              </li>
              <li className="mr-6">
                <Link
                  to={`/gallery`}
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
                >
                  Gallery
                </Link>
              </li>
              <li className="mr-6">
                <Link
                  to={`/about`}
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
                >
                  About
                </Link>
              </li>
              <li className="mr-6">
                <Link
                  to={`/profile`}
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
                >
                  Profile
                </Link>
              </li>
            </div>

            <li>
              <button
                onClick={logoutHandler}
                className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-full transition-transform transform hover:scale-105"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <div className="flex-grow flex justify-center">
            <li className="mr-6">
              <Link
                to={`/`}
                className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
              >
                Login
              </Link>
            </li>
            <li className="mr-6">
              <Link
                to={`/signup`}
                className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
              >
                Signup
              </Link>
            </li>
          </div>
        )}
      </ul>

      {isLogin ? (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="*" element={<Navigate to="/" replace={true} />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/" replace={true} />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
