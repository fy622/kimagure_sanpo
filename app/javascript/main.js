const { initMap, drawRoute, clearRoute } = window.KimagureMap;
import { trackUserLocation } from "./modules/tracking";
import { fetchRoute } from "./modules/graphhopper";
import { getCurrentLocation } from "./modules/geolocation";

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
      const apiKey = document.querySelector('meta[name="graphhopper-api-key"]').content;
      const encodedPolyline = await fetchRoute(location.lat, location.lng, distance, apiKey);
      if (encodedPolyline) drawRoute(encodedPolyline);
    }

    generateNewRoute();
    regenerateButton.addEventListener("click", generateNewRoute);
    trackUserLocation(mapInstance);
  });
});