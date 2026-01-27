"use client";
import dynamic from "next/dynamic";

const MapBase = dynamic(() => import("@/app/components/MapBase"), {
  ssr: false,
  loading: () => <div className="h-[500px] flex items-center justify-center">
    Loading map...
  </div>
});

export default function AddWarehousePage() {
  return (
    <div className="h-[500px] w-full">
      <h1>Map Test</h1>
      <MapBase
        onLocationSelect={(lat, lng) => {
          console.log("Selected:", lat, lng);
        }}
      />
    </div>
  );
}