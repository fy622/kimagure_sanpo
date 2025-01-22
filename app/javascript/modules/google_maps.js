export async function fetchNearbyHistoricalSites(latitude, longitude, radius = 5000) {
    const apiKey = "YOUR_GOOGLE_MAPS_API_KEY";
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