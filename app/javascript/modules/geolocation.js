export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation APIがサポートされていません");
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject("現在地を取得できませんでした");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
}