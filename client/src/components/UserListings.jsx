import { Link } from 'react-router-dom';
import { CiEdit } from "react-icons/ci";
import { MdLocationOn, MdDeleteOutline } from 'react-icons/md';

const UserListings = ({ userListings, handleListingDelete }) => {
  if (!userListings || userListings.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      {userListings.map((listing) => (
        <div key={listing._id} className="flex gap-6 p-4">
          <img 
            src={listing.imageUrls[0]} 
            alt="listing cover" 
            className="h-48 w-60 object-cover rounded-lg"
          />

          <div className="flex flex-col flex-1 justify-start gap-4 relative">
            <Link to={`/listing/${listing._id}`}>
              <p className="text-deepGreen font-semibold text-xl hover:underline truncate mb-2">
                {listing.title}
              </p>
            </Link>

            <div className="absolute top-0 right-0">
              <Link to={`/update-listing/${listing._id}`}>
                <button className="text-mossGreen hover:opacity-75">
                  <CiEdit className="h-6 w-6" />
                </button>
              </Link>
            </div>

            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <MdLocationOn className="h-5 w-5 text-mossGreen" />
              <p>{listing.address}</p>
            </div>

            <p className="bg-lightGreen max-w-[80px] text-deepGreen text-semibold text-sm p-1.5 rounded-md text-center">
              ${listing.price}
            </p>

            <div className="absolute bottom-0 right-0">
              <button 
                onClick={() => handleListingDelete(listing._id)} 
                className="text-deepGreen hover:opacity-75"
              >
                <MdDeleteOutline className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserListings;
