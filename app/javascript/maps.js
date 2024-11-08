function generateRoute() {
  const distance = parseFloat(document.getElementById("distance").value);
  
  if (!distance || distance <= 0) {
    alert("有効な距離を入力してください。");
    return;
  }

  // 位置情報の取得
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      
      // APIに送信
      fetch('/generate_route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ distance, latitude, longitude })
      })
      .then(response => response.json())
      .then(data => {
        // ルート生成結果ページへ遷移
        window.location.href = `/result?route=${encodeURIComponent(JSON.stringify(data.route))}`;
      })
      .catch(error => console.error('エラー:', error));
    });
  } else {
    alert("位置情報が利用できません。");
  }
}

// イベントリスナーの設定
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("routeForm").onsubmit = generateRoute;
});