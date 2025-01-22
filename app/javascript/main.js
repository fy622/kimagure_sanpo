import { getCurrentLocation } from "./modules/geolocation";

document.addEventListener("DOMContentLoaded", () => {
  const latitudeInput = document.getElementById("latitudeInput");
  const longitudeInput = document.getElementById("longitudeInput");
  const btn = document.getElementById("btn");

  btn.addEventListener("click", () => {
    getCurrentLocation(
      (position) => {
        const { latitude, longitude } = position.coords;
        latitudeInput.value = latitude;
        longitudeInput.value = longitude;

        console.log("現在地を取得しました:", { latitude, longitude });
      },
      (error) => {
        let message = "位置情報が取得できませんでした。";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "位置情報取得が拒否されました。ブラウザの設定を確認してください。";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "位置情報を取得できませんでした。デバイスの設定を確認してください。";
            break;
          case error.TIMEOUT:
            message = "位置情報の取得がタイムアウトしました。";
            break;
          default:
            message = "不明なエラーが発生しました。";
        }
        alert(message);
        console.error("エラー詳細:", error);
      }
    );
  });
});