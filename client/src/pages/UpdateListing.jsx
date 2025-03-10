import React from "react";
import { useState , useRef} from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { FaTrash } from 'react-icons/fa';

export default function UpdateListing() {
    const params = useParams();
    const navigate = useNavigate();
    const {currentUser} = useSelector(state => state.user);
    const [files, setFiles] = useState([])
    const [formData, setFormData] = useState({
        imageUrls: [],
        title: "",
        description: "",
        address: "",
        type: "",
        bedrooms: 1,
        bathrooms: 1,
        price: 0,
        parking: false,
        furnished: false,
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchListing = async() => {
            const listingId = params.id;
            const res = await fetch(`/api/listing/get/${listingId}`);
            const data = await res.json();
            if(data.success === false){
                setError(data.message);
                return;
            }
            setFormData(data);
        }
        fetchListing();
    }, []);

    // This function will be called when the user clicks on the upload button
    const handleImageSubmit = (e) => {
        if (files.length === 0) {
            setImageUploadError("Please select images to upload.");
            setUploading(false);
            return;
        }
        
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true);
            setImageUploadError(false);
            // Create an array of promises to store the images
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
                }
                // Wait for all the promises to resolve and then update the imageUrls in the formData
                Promise.all(promises).then((urls) => {
                    setFormData({
                        ...formData,
                        imageUrls: formData.imageUrls.concat(urls),
                    });
                    setImageUploadError(false);
                    setUploading(false);
                    setFiles([]);

                    if (fileInputRef.current) {
                        fileInputRef.current.value = ''; // Reset input value
                    }
                }).catch((error) => {
                    setImageUploadError("Image upload failed(2 mb per image limit)");
                });
        } else {
            setImageUploadError("You can only upload 6 images");
            setUploading(false);
        }
    };

    const storeImage = async(file) => {
        return new Promise(async(resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log("Upload is " + progress + "% done");
                },
                (error) => {
                    reject(error);
                },
                ()=>{
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            )
        });
    }

    const handleDeleteImage=(index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((url, i) => i !== index),
        })
    }

    const handleChange= (e) => {
        if (e.target.id === 'sale' || e.target.id === 'rent') {
            setFormData({
                ...formData,
                type: e.target.checked ? e.target.id : '', 
            });
        }

        if(e.target.id === 'parking' || e.target.id === 'furnished'){
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked,
            });
        }
        if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            });
        }

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(formData.imageUrls.length < 1) return setError('Please upload at least one image');
            if(+formData.regularPrice < +formData.discountPrice) return setError('Discount price cannot be higher than regular price');
            setLoading(true);
            setError(false);
            const res = await fetch(`/api/listing/update/${params.id}`, {
                method:"PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({...formData,userRef: currentUser._id}),
            });
            const data = await res.json();
            setLoading(false);
            if (data.success === false) {
                setError(data.message);
                return;
            }
            navigate(`/listing/${data._id}`);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }   

    return (
        <main className="p-3 max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">
                Update listing
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-4 flex-1">
                    <input
                        type="text"
                        placeholder="Title"
                        className="border p-3 rounded-lg"
                        id="title"
                        maxLength="62"
                        minLength="10"
                        required
                        value = {formData.title}
                        onChange={handleChange}
                    ></input>
                    <textarea
                        type="text"
                        placeholder="Description"
                        className="border p-3 rounded-lg"
                        id="description"
                        required
                        value = {formData.description}
                        onChange={handleChange}
                    ></textarea>
                    <input
                        type="text"
                        placeholder="Address"
                        className="border p-3 rounded-lg"
                        id="address"
                        required
                        value={formData.address}
                        onChange={handleChange}
                    ></input>
                    <div className="flex gap-6 flex-wrap">
                        <div className="flex gap-2">
                            <input type="checkbox" id="sale" className="w-5" onChange={handleChange} checked={formData.type === 'sale'}/>
                            <span>Sale</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="rent" className="w-5" onChange={handleChange} checked={formData.type === 'rent'}/>
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="parking" className="w-5" onChange={handleChange} checked={formData.parking}/>
                            <span>Parking</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="furnished" className="w-5" onChange={handleChange} checked={formData.furnished}/>
                            <span>Furnished</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                            <input type="number" id="bedrooms" min='1' max='10' required onChange={handleChange} value={formData.bedrooms} className="p-3 border border-gray-300 rounded-lg"/>
                            <p>Bedrooms</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="number" id="bathrooms" min='1' max='10' required onChange={handleChange} value={formData.bathrooms} className="p-3 border border-gray-300 rounded-lg"/>
                            <p>Bathrooms</p>
                        </div>
                        <div className="flex items-center gap-2">
                        <p>Price : </p>
                            <input type="number" id="price"  min='0' max='10000000' required onChange={handleChange} value={formData.price} className="p-3 border border-gray-300 rounded-lg"/>
                            <div className="flex flex-col items-center">
                                
                                {formData.type === 'rent' && <span className="text-xs">($/month)</span>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-4 flex-1">
                    <p className="fint-semibold">Images: <span className="font-normal text-gray-600 ml-2">The first image will be the cover (max 6)</span></p>
                    <div className="flex gap-4">
                        <input onChange={(e)=>setFiles(e.target.files)} className="p-3 border border-gray-300 rounded w-full"type="file" id='images' accept='image/*' multiple ref={fileInputRef}></input>
                        <button type='button' onClick={handleImageSubmit} disabled={uploading} className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80">{uploading ? 'Uploading...' : 'Upload'}</button>
                    </div>
                    <p className="text-red-700">{imageUploadError && imageUploadError}</p>
                    { formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                      <div key={url} className="flex justify-between p-3 border items-center">
                        <img src={url} alt="listing image" className="w-20 h-20 object-contain rounded-lg"></img>
                        <button type='button' onClick={()=> handleDeleteImage(index)} className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75">Delete</button>
                      </div>
                    ))
                    }
                    <button disabled={loading || uploading} className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-85 disabled:opacity-75" >{loading ? 'Updating...' : 'Update'}</button>
                    {error && <p className="text-red-700 text-sm">{error}</p>}
                </div>
            </form>
        </main>
    );
}
