document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("routeForm");
    const mapElement = document.getElementById("map");
  
    let map, directionsRenderer, directionsService;
  
    // Google Mapsの初期化
    function initMap() {
      map = new google.maps.Map(mapElement, {
        center: { lat: 35.0, lng: 135.0 }, // 初期中心座標
        zoom: 14,
      });
  
      directionsRenderer = new google.maps.DirectionsRenderer();
      directionsRenderer.setMap(map);
  
      directionsService = new google.maps.DirectionsService();
    }
  
    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
  
        const formData = new FormData(form);
        const token = document.querySelector('meta[name="csrf-token"]').getAttribute("content");
  
        fetch(form.action, {
          method: "POST",
          headers: {
            "X-CSRF-Token": token,
            "Accept": "application/json",
          },
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Success:", data);
  
            // マップにルートを描画
            const route = data.route;
            const waypoints = route.map((point) => ({
              location: new google.maps.LatLng(point.latitude, point.longitude),
              stopover: false,
            }));
  
            const origin = waypoints.shift().location;
            const destination = waypoints.pop().location;
  
            directionsService.route(
              {
                origin,
                destination,
                waypoints,
                travelMode: google.maps.TravelMode.WALKING,
              },
              (result, status) => {
                if (status === "OK") {
                  directionsRenderer.setDirections(result);
                } else {
                  console.error("Directions request failed due to " + status);
                }
              }
            );
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      });
    }
  
    // Google Mapsの初期化を実行
    initMap();
  });