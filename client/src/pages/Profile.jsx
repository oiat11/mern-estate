import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../redux/user/userSlice";
import UserListings from "../components/UserListings.jsx";
import { Link } from "react-router-dom";

export default function Profile() {
  const fileRef = useRef();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const dispatch = useDispatch();
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  useEffect(() => {
    if (file) {
      handleFileUpload();
    }
  }, [file]);

  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        const response = await fetch(`/api/user/listings/${currentUser._id}`);
        const data = await response.json();
        setUserListings(data.listings);
      } catch (err) {
        setShowListingsError(true);
      }
    };
    fetchUserListings();
  }, [currentUser._id]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setShowListingsError(false);
        const res = await fetch(`/api/user/listings/${currentUser?._id}`);
        if (!res.ok) throw new Error("Failed to fetch listings");
        const data = await res.json();

        if (data.success === false) {
          setShowListingsError(true);
          return;
        }

        setUserListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
        setShowListingsError(true);
      }
    };

    if (activeTab === "listings") {
      fetchListings(); 
    }
  }, [activeTab, currentUser]);

  const handleFileUpload = () => {
    const storage = getStorage();
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            avatar: downloadURL,
          }));
        });
      }
    );
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch(`/api/auth/signout`, {
        method: "GET",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listings/delete/${listingId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        setUserListings((prevListings) =>
          prevListings.filter((listing) => listing._id !== listingId)
        );
      }
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  };

  return (
    <div className="flex max-w-4xl mx-auto p-6 gap-6 text-deepGreen">
      <div className="w-1/4 flex flex-col items-center p-4 border-r">
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer"
        />
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <nav className="flex flex-col gap-4 mt-6 w-full text-center">
          <button
            className={`p-2 ${
              activeTab === "profile"
                ? "text-deepGreen font-semibold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={`p-2 ${
              activeTab === "listings"
                ? "text-deepGreen font-semibold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("listings")}
          >
            My Listings
          </button>
          <button
            className={`p-2 ${
              activeTab === "saved"
                ? "text-deepGreen font-semibold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("saved")}
          >
            Saved Properties
          </button>
        </nav>
      </div>

      <div className="w-3/4 p-4">
        {activeTab === "profile" && (
          <div>
            <h1 className="text-5xl font-semibold">Profile</h1>
            <form className="flex flex-col gap-4 mt-4 max-w-md">
              <div className="flex flex-col gap-1">
                <label>Username</label>
                <input
                  type="text"
                  placeholder="Username"
                  defaultValue={currentUser.username}
                  className="border p-3 rounded-xl"
                  id="username"
                  onChange={handleFormChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  defaultValue={currentUser.email}
                  className="border p-3 rounded-xl"
                  id="email"
                  onChange={handleFormChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="New Password"
                  className="border p-3 rounded-xl"
                  id="password"
                  onChange={handleFormChange}
                />
              </div>
              <button
                disabled={loading}
                onClick={handleSubmit}
                className="bg-deepGreen text-white p-3 rounded-lg uppercase hover:opacity-85"
              >
                {loading ? "Loading..." : "Update"}
              </button>
            </form>
            <div className="flex justify-between mt-5 max-w-md">
              <span
                onClick={handleDeleteUser}
                className="text-mossGreen cursor-pointer"
              >
                Delete account
              </span>
              <span
                onClick={handleSignOut}
                className="text-mossGreen cursor-pointer"
              >
                Sign out
              </span>
            </div>
            {filePerc > 0 && filePerc < 100 && <p>{filePerc}%</p>}
            {fileUploadError && (
              <p className="text-red-500">{fileUploadError}</p>
            )}
          </div>
        )}

{activeTab === "listings" && (
  <div className="flex flex-col gap-6">
    <div className="flex justify-between items-center">
      <h1 className="text-5xl font-semibold">My Listings</h1>
      <Link to="/create-listing">
        <button type="button" className="bg-deepGreen text-white rounded-lg p-3 hover:opacity-85">
          Add Listing
        </button>
      </Link>
    </div>
    <div className="w-full">
      {showListingsError ? (
        <div className="text-red-500">
          <p>Failed to load listings. Try again later.</p>
          <button
            onClick={fetchListings}
            className="mt-2 text-blue-600 underline"
          >
            Retry
          </button>
        </div>
      ) : (
        <UserListings
          userListings={userListings}
          handleListingDelete={handleListingDelete}
        />
      )}
    </div>
  </div>
)}


        {activeTab === "saved" && <h1 className="text-5xl font-semibold">Saved Properties</h1>}
      </div>
    </div>
  );
}
