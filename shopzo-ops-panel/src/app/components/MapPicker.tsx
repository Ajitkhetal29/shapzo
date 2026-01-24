"use client";

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { useState, useEffect, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

type Props = {
  onLocationSelect: (lat: number, lng: number) => void;
  center?: { lat: number; lng: number };
};

// Component to handle search
function SearchField({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    // @ts-ignore - leaflet-geosearch types can be tricky
    const searchControl = new GeoSearchControl({
      provider: provider,
      style: 'bar',
      showMarker: false,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: true,
      searchLabel: 'Search for warehouse location...',
    });

    map.addControl(searchControl);

    map.on('geosearch/showlocation', (result: any) => {
      const { x, y } = result.location; // x is lng, y is lat
      onLocationSelect(y, x);
    });

    return () => {
      map.removeControl(searchControl);
    };
  }, [map, onLocationSelect]);

  return null;
}

// Component to handle clicks
function LocationMarker({ 
  position, 
  setPosition, 
  onLocationSelect 
}: { 
  position: [number, number], 
  setPosition: (pos: [number, number]) => void,
  onLocationSelect: (lat: number, lng: number) => void 
}) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelect(lat, lng);
    },
  });

  return <Marker position={position} />;
}

// Component to update map center when external center changes
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export default function MapPicker({ onLocationSelect, center }: Props) {
  const [position, setPosition] = useState<[number, number]>([
    center?.lat || 20.5937,
    center?.lng || 78.9629,
  ]);

  const handleManualSelect = useCallback((lat: number, lng: number) => {
    setPosition([lat, lng]);
    onLocationSelect(lat, lng);
  }, [onLocationSelect]);

  return (
    <div className="h-full w-full relative z-0">
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <SearchField onLocationSelect={handleManualSelect} />
        <LocationMarker 
          position={position} 
          setPosition={setPosition} 
          onLocationSelect={onLocationSelect} 
        />
        {center && <ChangeView center={[center.lat, center.lng]} />}
      </MapContainer>
    </div>
  );
}
