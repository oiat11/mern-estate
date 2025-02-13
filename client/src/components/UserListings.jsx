import { Link } from 'react-router-dom';

const UserListings = ({ userListings, handleListingDelete }) => {
  if (!userListings || userListings.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      {userListings.map((listing) => (
        <div key={listing._id} className="border rounded-lg p-3 flex justify-between items-center gap-4">
          <Link to={`/listing/${listing._id}`} className="flex items-center gap-4 flex-1">
            <img src={listing.imageUrls[0]} alt='listing cover' className="h-16 w-16 object-contain" />
            <p className="text-slate-700 font-semibold hover:underline truncate">{listing.title}</p>
          </Link>
          <div className="flex flex-col items-center">
            <button onClick={() => handleListingDelete(listing._id)} className="text-red-700 uppercase">Delete</button>
            <Link to={`/update-listing/${listing._id}`}>
              <button className="text-green-700 uppercase">Edit</button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserListings;
