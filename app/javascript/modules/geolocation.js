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
        }
      );
    } else {
      alert("このブラウザはGeolocationをサポートしていません。");
      callback(null);
    }
  }