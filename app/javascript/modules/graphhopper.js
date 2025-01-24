export async function generateRoute(start, waypoints, distance) {
  const apiKey = ENV['GRAPHHOPPER_API_KEY'];
  const endpoint = "https://graphhopper.com/api/1/route";

  const params = new URLSearchParams({
    key: apiKey,
    point: `${start.latitude},${start.longitude}`, // スタート地点
    vehicle: "foot",
    round_trip: true, // 周回ルートを指定
  });

  // 距離指定を修正
  params.append("round_trip.distance", distance);

  // 経由地を追加
  waypoints.forEach((waypoint) => {
    params.append("point", `${waypoint.latitude},${waypoint.longitude}`);
  });

  const response = await fetch(`${endpoint}?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to generate route.");
  }
  const data = await response.json();
  return data.paths[0].points; // ルートポイントを返す
}