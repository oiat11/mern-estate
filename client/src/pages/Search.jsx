import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import { set } from "mongoose";
import GoogleMapComponent from "../components/GoogleMapComponent ";

export default function Search() {
    const navigate = useNavigate();
    const [sidebardata, setSidebarData] = useState({
        searchTerm: "",
        type: "all",
        parking: false,
        furnished: false,
        sort: "createdAt",
        order: "desc",
    });

    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [showMore, setShowMore] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');
    
        if (
          searchTermFromUrl ||
          typeFromUrl ||
          parkingFromUrl ||
          furnishedFromUrl ||

          sortFromUrl ||
          orderFromUrl
        ) {
          setSidebarData({
            searchTerm: searchTermFromUrl || '',
            type: typeFromUrl || 'all',
            parking: parkingFromUrl === 'true' ? true : false,
            furnished: furnishedFromUrl === 'true' ? true : false,

            sort: sortFromUrl || 'created_at',
            order: orderFromUrl || 'desc',
          });
        }
    
        const fetchListings = async () => {
          setLoading(true);
          setShowMore(false);
          const searchQuery = urlParams.toString();
          const res = await fetch(`/api/listing/get?${searchQuery}`);
          const data = await res.json();
          if (data.length > 8) {
            setShowMore(true);
          } else {
            setShowMore(false);
          }
          setListings(data);
          setLoading(false);
        };
    
        fetchListings();
      }, [location.search]);

    const handleChange = (e) => {
        if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
            setSidebarData({...sidebardata, type: e.target.id});
        }

        if (e.target.id === 'searchTerm') {
            setSidebarData({...sidebardata, searchTerm: e.target.value});
        }

        if (e.target.id === 'parking' || e.target.id === 'furnished') {
            setSidebarData({...sidebardata, [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false});
        }

        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('-')[0];
            const order = e.target.value.split('-')[1];
            setSidebarData({...sidebardata, sort, order});
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams()
        urlParams.set('searchTerm', sidebardata.searchTerm);
        urlParams.set('type', sidebardata.type);
        urlParams.set('parking', sidebardata.parking);
        urlParams.set('furnished', sidebardata.furnished);
        urlParams.set('sort', sidebardata.sort);
        urlParams.set('order', sidebardata.order);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
        
    }

    const onShowMoreClick = async () => {
        const numberOfListings = listings.length;
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if (data.length > 8) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
        setListings([...listings, ...data]);
    }

    return (
        <div className="relative flex flex-col md:flex-row">
            <button 
                onClick={() => setShowSidebar(!showSidebar)}
                className="fixed top-4 left-4 z-50 text-deepGreen p-2 rounded-lg"
            >
                {showSidebar ? (
                    <svg 
                        className="w-6 h-6" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                ) : (
                    <svg 
                        className="w-6 h-6" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                )}
            </button>

            <div className={`text-sm p-7 border-b-2 md:border-r-2 md:min-h-screen bg-offWhite
                fixed md:static w-[300px] h-full transition-transform duration-300 ease-in-out z-40
                ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}>
                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    <div className="flex items-center gap-2">
                        <label className="whitespace-nowrap font-semibold">Search Term:</label>
                        <input
                            type="text"
                            id="searchTerm"
                            placeholder="Search..."
                            className="border rounded-lg p-3 w-full"
                            value = {sidebardata.searchTerm}
                            onChange = {handleChange}
                        />
                    </div>
                    <div className="flex gap-2 items-center">
                        <label className="font-semibold">Type:</label>
        
                        <div className="flex gap-2">
                            <input type="checkbox" id="rent" className="w-5" onChange={handleChange} checked={sidebardata.type === 'rent'}></input>
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="sale" className="w-5" onChange={handleChange} checked={sidebardata.type === 'sale'}></input>
                            <span>Sale</span>
                        </div>
                      
                    </div>
                    <div className="flex gap-2 items-center">
                        <label className="font-semibold">Amenities:</label>
                        <div className="flex gap-2">
                            <input type="checkbox" id="parking" className="w-5" onChange={handleChange} checked={sidebardata.parking}></input>
                            <span>Parking</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="furnished" className="w-5"  onChange={handleChange} checked={sidebardata.furnished}></input>
                            <span>Furnished</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="font-semibold">Sort:</label>
                        <select onChange={handleChange} defaultValue={'created_at_desc'}id="sort_order" className="border rounded-lg p-3">
                            <option value='regularPrice-desc'>Price high to low</option>
                            <option value='regularPrice-asc'>Price low to high</option>
                            <option value='createdAt-desc'>Latest</option>
                            <option value='createdAt-asc'>Oldest</option>
                        </select>
                    </div>
                    <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">Search</button>
                </form>
            </div>
            <div className="flex-1">
                <div className="sticky top-0 z-10">
                    <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
                        Listing results:
                    </h1>
                </div>
                
                <div className="flex flex-row gap-4">
                    <div className="p-7 flex-1">
                        <div className="h-[calc(100vh-150px)] overflow-y-auto scrollbar-hide">
                            {!loading && listings.length === 0 && (
                                <p className="text-xl text-slate-700">No listing found!</p>
                            )}
                            {loading && (
                                <p className="text-xl text-slate-700 text-center w-full">Loading...</p>
                            )}
                            <div className="flex flex-wrap gap-4">
                                {!loading && listings && listings.map((listing) => (
                                    <ListingItem key={listing._id} listing={listing}/>
                                ))}
                            </div>
                            {showMore && (
                                <button onClick={onShowMoreClick} className='text-green-700 hover:underline p-7 text-center w-full'>
                                    Show more
                                </button>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
