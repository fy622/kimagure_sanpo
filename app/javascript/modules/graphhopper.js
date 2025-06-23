export async function fetchRoute(lat, lng, baseDistance, apiKey) {
    const heading = Math.floor(Math.random() * 360);
    const seed = Math.floor(Math.random() * 10000);
    const adjustedDistance = Math.floor(baseDistance * (1 + (Math.random() * 0.2 - 0.1)));
  
    const url = `https://graphhopper.com/api/1/route?point=${lat},${lng}&type=json&vehicle=foot&locale=ja&round_trip.distance=${adjustedDistance}&round_trip.seed=${seed}&round_trip.heading=${heading}&algorithm=round_trip&ch.disable=true&key=${apiKey}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.paths[0].points;
    } catch (error) {
      console.error("GraphHopper API error:", error);
      return null;
    }
  }