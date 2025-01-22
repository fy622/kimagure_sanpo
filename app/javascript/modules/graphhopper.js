export async function generateRoute(start, waypoints, distance) {
    const apiKey = "YOUR_GRAPHHOPPER_API_KEY";
    const endpoint = "https://graphhopper.com/api/1/route";
    const coordinates = [start, ...waypoints].map(point => `${point.longitude},${point.latitude}`).join("|");
  
    const params = new URLSearchParams({
      key: apiKey,
      point: coordinates,
      vehicle: "foot",
      optimize: true,
      round_trip: distance
    });
  
    const response = await fetch(`${endpoint}?${params.toString()}`);
    if (!response.ok) {
      throw new Error("Failed to generate route.");
    }
    const data = await response.json();
    return data.paths[0].points;
  }