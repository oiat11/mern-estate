import { current } from "@reduxjs/toolkit";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRef, useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserFailure, deleteUserSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

export default function Profile() {
  // the fileRef is used to reference the file input element to open the file dialog when the user clicks on the profile picture, so that we can hide the input element
  const fileRef = useRef();

  const { currentUser, loading, error } = useSelector((state) => state.user);

  // file is used to store the file that the user selects
  const [file, setFile] = useState(undefined);

  // filePerc is used to display the progress of the file upload
  const [filePerc, setFilePerc] = useState(0);

  // fileUploadError is used to display an error message if the file upload fails
  const [fileUploadError, setFileUploadError] = useState(null);

  // formData is used to temporarily store the form data before sending it to the server
  const [formData, setFormData] = useState({});

  // updateSuccess is used to display a success message if the update is successful
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload();
    }
  }, [file]);

  const handleFileUpload = () => {
    const storage = getStorage();

    // the file name is set to the current time in milliseconds plus the file name
    const fileName = new Date().getTime() + file.name;
    // this is the reference to the file in the storage
    const storageRef = ref(storage, fileName);
    // this is the upload task that uploads the file to the storage and it can listen to the state of the upload
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      // the first callback is called when the state of the upload changes
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setFilePerc(Math.round(progress));
      },
      // the second callback is called when there is an error
      (error) => {
        setFileUploadError(error.message);
      },
      // the third callback is called when the upload is successful
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


  // this function is called when the form data changes and show the new form data on the screen
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
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
  }

  const handleDeleteUser = async () => {
    try{
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
  };
}

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        {/* the file upload progress is displayed here */}
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">Image Upload Error</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">Uploading {filePerc}%</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image Successfully Uploaded</span>
          ) : (
            ""
          )}
        </p>

        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleFormChange}
        />
        <input
          type="email"
          placeholder="email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleFormChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleFormChange}
        />
        <button disabled={loading} onClick={handleSubmit} className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-85 disabled:75">
          {loading ? "Loading..." : "Update"}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete account</span>
        <div>
          <span className="text-red-700 cursor-pointer">Sign out</span>
        </div>
      </div>
      {error && <p className="text-red-700 mt-5">{error}</p>}
      {updateSuccess && (
        <p className="text-green-700 mt-5">Profile updated successfully</p>
      )}
    </div>
  );
}
