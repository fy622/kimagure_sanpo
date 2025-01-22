export function getCurrentLocation(successCallback, errorCallback) {
  if (!navigator.geolocation) {
    alert("このブラウザでは位置情報を取得できません。");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    successCallback,
    errorCallback,
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}