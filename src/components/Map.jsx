import React, { useMemo } from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';

const libraries = ["places"];

function MapDisplay({ width, height }) {
    // Load the Google Maps script
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: libraries,
    });

    // Define the initial center point for the map (New York)
    const center = useMemo(() => ({ lat: 40.7128, lng: -74.0060 }), []);
    
    const options = useMemo(() => ({
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        fullscreenControl: false,
    }), []);

    if (loadError) return <div>Error loading maps.</div>;
    if (!isLoaded) return <div>Loading Map...</div>;

    return (
        <div style={{ width: width, height: height }}>
            <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                zoom={10}
                center={center}
                options={options}
            >
            </GoogleMap>
        </div>
    );
}

export default MapDisplay;