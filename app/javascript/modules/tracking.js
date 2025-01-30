let userMarker;

export function trackUserLocation(map) {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const newPosition = new google.maps.LatLng(lat, lng);

                if (!userMarker) {
                    userMarker = new google.maps.Marker({
                        position: newPosition,
                        map: map,
                        title: "現在地",
                        icon: {
                            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                        }
                    });
                } else {
                    userMarker.setPosition(newPosition);
                }
            },
            (error) => console.error("現在地の追跡エラー:", error),
            { enableHighAccuracy: true }
        );
    }
}