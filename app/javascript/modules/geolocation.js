export function getCurrentLocation(callback) {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
          (position) => callback({
              lat: position.coords.latitude,
              lng: position.coords.longitude
          }),
          (error) => {
              console.error("Geolocation error:", error);
              alert("現在地を取得できませんでした。");
              callback(null);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
  } else {
      alert("このブラウザはGeolocationをサポートしていません。");
      callback(null);
  }
}