function initMap() {
    const routeData = JSON.parse(decodeURIComponent(new URLSearchParams(window.location.search).get("route")));
  
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 14,
      center: { lat: routeData[0].latitude, lng: routeData[0].longitude }
    });
  
    const routeCoordinates = routeData.map(point => ({
      lat: point.latitude,
      lng: point.longitude
    }));
  
    const routePath = new google.maps.Polyline({
      path: routeCoordinates,
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
  
    routePath.setMap(map);
  }
  
  window.onload = initMap;