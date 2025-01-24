// 近隣の史跡を取得する関数
export async function fetchNearbyHistoricalSites(latitude, longitude, radius = 5000) {
  const apiKey = ENV['GOOGLE_MAPS_API_KEY'];
  const endpoint = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&keyword=historical&key=${apiKey}`;
  
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error("Failed to fetch historical sites.");
  }
  const data = await response.json();
  return data.results.map(site => ({
    name: site.name,
    latitude: site.geometry.location.lat,
    longitude: site.geometry.location.lng
  }));
}

// 地図を初期化する関数
export function initMap(center) {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: center,
    zoom: 14,
  });

  addMarkers(map, { lat: center.lat, lng: center.lng }, waypoints); // マーカーを追加

  return map;
}

// ルートを地図上に描画する関数
export function drawRoute(routePoints, map) {
  const decodedPath = decodePolyline(routePoints);
  const polyline = new google.maps.Polyline({
    path: decodedPath,
    geodesic: true,
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 2,
  });
  polyline.setMap(map);
}

// Polylineをデコードする関数
function decodePolyline(encoded) {
  const points = [];
  let index = 0, lat = 0, lng = 0;

  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const deltaLat = (result & 1 ? ~(result >> 1) : (result >> 1));
    lat += deltaLat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const deltaLng = (result & 1 ? ~(result >> 1) : (result >> 1));
    lng += deltaLng;

    points.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }

  return points;
}

export function addMarkers(map, start, waypoints = []) {
  // スタート地点をマーカーとして表示
  new google.maps.Marker({
    position: start,
    map: map,
    label: "S", // スタート地点のマーカーラベル
    title: "スタート地点"
  });

  // ゴール地点をマーカーとして表示（今回はスタート地点と同じ）
  new google.maps.Marker({
    position: start,
    map: map,
    label: "G", // ゴール地点のマーカーラベル
    title: "ゴール地点"
  });

  // 経由する史跡のマーカーを追加
  waypoints.forEach((point, index) => {
    new google.maps.Marker({
      position: { lat: point.latitude, lng: point.longitude },
      map: map,
      label: `${index + 1}`, // 経由地の番号ラベル
      title: point.name || `経由地 ${index + 1}`
    });
  });
}