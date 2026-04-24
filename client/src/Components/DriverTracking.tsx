import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const DriverTracking = ({ orderId }: { orderId: string }) => {
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        socket.emit("update_location", {
          orderId,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => console.error(err),
      { enableHighAccuracy: true } 
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [orderId]);

  return <div className="badge bg-primary">GPS Tracking Active</div>;
};

export default DriverTracking;
