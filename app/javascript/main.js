import { getCurrentLocation } from "./modules/geolocation";
import { fetchNearbyHistoricalSites } from "./modules/google_maps";
import { generateRoute } from "./modules/graphhopper";
import { initMap, addMarkers, drawRoute } from "./modules/google_maps";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const { latitude, longitude } = await getCurrentLocation();

    // Google Places APIで史跡を取得
    const waypoints = await fetchNearbyHistoricalSites(latitude, longitude);

    // GraphHopper APIでルートを生成
    const routePoints = await generateRoute({ latitude, longitude }, waypoints);

    // Google Mapsで地図とルートを描画
    const map = initMap(latitude, longitude);
    addMarkers(map, { lat: latitude, lng: longitude }, waypoints);
    drawRoute(map, routePoints);
  } catch (error) {
    console.error("エラーが発生しました:", error);
  }
});