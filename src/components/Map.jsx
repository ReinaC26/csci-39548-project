import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { GoogleMap, useLoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';

const libraries = ["places"];

function MapDisplay({ width, height, startLocation, endLocation, showRoute }) {
    const [directions, setDirections] = useState(null);
    const [startCoords, setStartCoords] = useState(null);
    const [endCoords, setEndCoords] = useState(null);
    const [map, setMap] = useState(null);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: libraries,
    });

    const center = useMemo(() => ({ lat: 40.7128, lng: -74.0060 }), []);
    
    const options = useMemo(() => ({
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        fullscreenControl: false,
    }), []);

    // Geocode locations and get directions
    useEffect(() => {
        if (!isLoaded || !showRoute || !startLocation || !endLocation || !window.google) {
            setDirections(null);
            setStartCoords(null);
            setEndCoords(null);
            return;
        }

        const geocoder = new window.google.maps.Geocoder();
        const directionsService = new window.google.maps.DirectionsService();

        // Geocode start location
        geocoder.geocode({ address: startLocation }, (results, status) => {
            if (status === 'OK') {
                const startPos = {
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng()
                };
                setStartCoords(startPos);

                // Geocode end location
                geocoder.geocode({ address: endLocation }, (results2, status2) => {
                    if (status2 === 'OK') {
                        const endPos = {
                            lat: results2[0].geometry.location.lat(),
                            lng: results2[0].geometry.location.lng()
                        };
                        setEndCoords(endPos);

                        // Get directions
                        directionsService.route(
                            {
                                origin: startPos,
                                destination: endPos,
                                travelMode: window.google.maps.TravelMode.WALKING,
                            },
                            (result, status) => {
                                if (status === 'OK') {
                                    setDirections(result);
                                } else {
                                    console.error('Directions request failed:', status);
                                }
                            }
                        );
                    }
                });
            }
        });
    }, [isLoaded, showRoute, startLocation, endLocation]);

    // Fit bounds when directions are loaded
    useEffect(() => {
        if (map && directions) {
            const bounds = new window.google.maps.LatLngBounds();
            directions.routes[0].overview_path.forEach(point => {
                bounds.extend(point);
            });
            map.fitBounds(bounds);
        }
    }, [map, directions]);

    const onLoad = useCallback((map) => {
        setMap(map);
    }, []);

    if (loadError) return <div>Error loading maps.</div>;
    if (!isLoaded) return <div>Loading Map...</div>;

    return (
        <div style={{ width: width, height: height }}>
            <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                zoom={10}
                center={center}
                options={options}
                onLoad={onLoad}
            >
                {/* Show route line without default markers */}
                {directions && (
                    <DirectionsRenderer
                        directions={directions}
                        options={{
                            suppressMarkers: true, // Hide default markers
                            polylineOptions: {
                                strokeColor: '#0B556C',
                                strokeWeight: 5,
                                strokeOpacity: 0.75,
                            },
                        }}
                    />
                )}

                {/* Custom start marker */}
                {showRoute && startCoords && (
                    <Marker
                        position={startCoords}
                        icon={{
                            url: '/start_location.png',
                            scaledSize: new window.google.maps.Size(30, 40),
                            anchor: new window.google.maps.Point(15, 40),
                        }}
                        title="Start Location"
                    />
                )}

                {/* Custom end marker */}
                {showRoute && endCoords && (
                    <Marker
                        position={endCoords}
                        icon={{
                            url: '/end_location.png',
                            scaledSize: new window.google.maps.Size(30, 40),
                            anchor: new window.google.maps.Point(15, 40),
                        }}
                        title="End Location"
                    />
                )}
            </GoogleMap>
        </div>
    );
}

export default MapDisplay;