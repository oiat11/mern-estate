import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { FaMessage } from "react-icons/fa6";
import { MdOutlineBookmarkAdd, MdBookmarkAdd } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { updateUserSuccess } from "../redux/user/userSlice";

export default function ListingItem({ listing }) {
  const { currentUser } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const checkIfSaved = () => {
      if (currentUser && currentUser.savedListing && listing) {
        const isListingSaved = currentUser.savedListing.some(
          savedId => savedId === listing._id || savedId.toString() === listing._id
        );
        setIsSaved(isListingSaved);
      }
    };

    checkIfSaved();
  }, [currentUser, listing._id]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Please sign in to save listings');
      return;
    }

    try {
      if (isSaved) {
        // Remove from saved listings
        const res = await fetch(`/api/user/saved/${listing._id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        const data = await res.json();
        
        if (data.success === false) {
          console.log(data.message);
          return;
        }
        
        // Update Redux state
        const updatedSavedListings = currentUser.savedListing.filter(
          id => id.toString() !== listing._id.toString()
        );
        dispatch(updateUserSuccess({
          ...currentUser,
          savedListing: updatedSavedListings
        }));
        
        setIsSaved(false);
      } else {
        // Add to saved listings
        const res = await fetch(`/api/user/saved/${listing._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        const data = await res.json();
        
        if (data.success === false) {
          console.log(data.message);
          return;
        }
        
        // Update Redux state
        const updatedSavedListings = [...currentUser.savedListing, listing._id];
        dispatch(updateUserSuccess({
          ...currentUser,
          savedListing: updatedSavedListings
        }));
        
        setIsSaved(true);
      }
    } catch (error) {
      console.log('Error saving/removing listing:', error);
    }
  };

  return (
    <Link to={`/listing/${listing._id}`} className="block w-full sm:w-[700px]">
      <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full flex">
        <div className="flex-shrink-0">
          <img
            src={listing.imageUrls[0]}
            alt="listing cover"
            className="h-[200px] w-[300px] object-cover hover:scale-105 transition-scale duration-300"
          />
        </div>
        <div className="p-4 flex flex-col gap-2 w-full relative">
          <p className="truncate text-lg font-semibold text-slate-700">
            {listing.title}
          </p>
          <div className="flex items-center gap-2">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="text-sm text-gray-600 truncate">{listing.address}</p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>
          <p className="text-slate-500 mt-2 font-semibold flex items-center">
            $
            {listing.price ? listing.price.toLocaleString("en-US") : "N/A"}
            {listing.type === "rent" && "/ month"}
          </p>
          <div className="flex items-center gap-4 text-slate-700">
            <div className="font-bold text-xs">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} bedrooms`
                : `${listing.bedrooms} bedroom`}
            </div>
            <div className="font-bold text-xs">
              {listing.bathrooms > 1
                ? `${listing.bathrooms} bathrooms`
                : `${listing.bathrooms} bathroom`}
            </div>
          </div>
          
          {/* Action Icons */}
          <div className="absolute bottom-4 right-4 flex gap-3">
            <button 
              onClick={handleSave}
              className="text-deepGreen hover:text-mossGreen transition-colors"
            >
              {isSaved ? (
                <MdBookmarkAdd className="text-xl" />
              ) : (
                <MdOutlineBookmarkAdd className="text-xl" />
              )}
            </button>
            <button 
              onClick={(e) => {
                e.preventDefault();
                // Add contact functionality here
              }}
              className="text-deepGreen hover:text-mossGreen transition-colors"
            >
              <FaMessage className="" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
