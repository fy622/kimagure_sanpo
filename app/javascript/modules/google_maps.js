let map;
let routePolyline;

function initMap(containerId, center) {
    const mapElement = document.getElementById(containerId);
    if (!mapElement) return console.error(`エラー: ID '${containerId}' の要素が見つかりません。`);
    map = new google.maps.Map(mapElement, { center, zoom: 14 });
}

function drawRoute(encodedPolyline) {
    if (!map) return console.error("エラー: initMap() が実行されていません。");

    const decodedPath = google.maps.geometry.encoding.decodePath(encodedPolyline);
    if (routePolyline) routePolyline.setMap(null);

    routePolyline = new google.maps.Polyline({
        path: decodedPath,
        geodesic: true,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 4,
    });

    routePolyline.setMap(map);
}

function clearRoute() {
    if (routePolyline) routePolyline.setMap(null);
}

window.KimagureMap = {
    initMap,
    drawRoute,
    clearRoute
};