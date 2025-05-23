const { initMap, drawRoute, clearRoute } = window.KimagureMap;
import { trackUserLocation } from "./modules/tracking";

function getCurrentLocation(callback) {
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

async function getRoute(lat, lng, baseDistance) {
  const apiKey = process.env.GRAPHHOPPER_API_KEY;
  const heading = Math.floor(Math.random() * 360);
  const seed = Math.floor(Math.random() * 10000);
  const adjustedDistance = Math.floor(baseDistance * (1 + (Math.random() * 0.2 - 0.1)));

  const url = `https://graphhopper.com/api/1/route?point=${lat},${lng}&type=json&vehicle=foot&locale=ja&round_trip.distance=${adjustedDistance}&round_trip.seed=${seed}&round_trip.heading=${heading}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.paths[0].points;
  } catch (error) {
    console.error("GraphHopper API error:", error);
    return null;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const mapContainer = "map";
  const distance = 5000;

  const regenerateButton = document.getElementById("regenerate-route");

  if (!regenerateButton) {
    console.warn("再生成ボタンが見つかりません。");
    return;
  }

  getCurrentLocation((location) => {
    if (!document.getElementById(mapContainer)) {
      console.error(`エラー: ID '${mapContainer}' の要素が見つかりません。`);
      return;
    }

    const mapInstance = initMap(mapContainer, location);

    async function generateNewRoute() {
      clearRoute();
      const encodedPolyline = await getRoute(location.lat, location.lng, distance);
      if (encodedPolyline) drawRoute(encodedPolyline);
    }

    generateNewRoute();
    regenerateButton.addEventListener("click", generateNewRoute);
    trackUserLocation(mapInstance);
  });
});