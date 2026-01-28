"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";

// 🔧 Fix default marker icon (Next.js issue)
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

/* ---------------- SEARCH BAR ---------------- */
function LeafletGeoSearch() {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl =  GeoSearchControl({
      provider,
      style: "bar",
      showMarker: false,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
    });

    map.addControl(searchControl);

    return () => {
      map.removeControl(searchControl);
    };
  }, [map]);

  return null;
}

/* ---------------- CLICK HANDLER ---------------- */
function ClickHandler({
  onPick,
}: {
  onPick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

/* ---------------- FLY TO ---------------- */
function FlyToLocation({ position }: { position: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, 15, {
      animate: true,
      duration: 1.5,
    });
  }, [position, map]);

  return null;
}

type Props = {
  onLocationSelect: (lat: number, lng: number) => void;
};

/* ---------------- MAIN MAP ---------------- */
export default function MapPicker({ onLocationSelect }: Props) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  // 📍 Get user location
  useEffect(() => {
    if (!navigator.geolocation) {
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPosition([pos.coords.latitude, pos.coords.longitude]);
        setLoading(false);
      },
      (err) => {
        console.error("Location error:", err);
        setLoading(false);
      }
    );
  }, []);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        Fetching your location...
      </div>
    );
  }

  return (
    <MapContainer
      center={userPosition || [20.5937, 78.9629]}
      zoom={userPosition ? 15 : 5}
      className="h-full w-full"
    >
      <LeafletGeoSearch />

      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ClickHandler
        onPick={(lat, lng) => {
          setPosition([lat, lng]);
          onLocationSelect(lat, lng);
        }}
      />

      {position && (
        <>
          <Marker position={position} />
          <FlyToLocation position={position} />
        </>
      )}
    </MapContainer>
  );
}
