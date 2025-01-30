import { getCurrentLocation } from "./modules/geolocation.js";
import { getRoute } from "./modules/graphhopper.js";
import { initMap, drawRoute, clearRoute } from "./modules/google_maps.js";
import { trackUserLocation } from "./modules/tracking.js";

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

        function generateNewRoute() {
            clearRoute();
            getRoute(location.lat, location.lng, distance).then((encodedPolyline) => {
                if (encodedPolyline) drawRoute(encodedPolyline);
            });
        }

        generateNewRoute();
        regenerateButton.addEventListener("click", generateNewRoute);
        trackUserLocation(mapInstance);
    });
});