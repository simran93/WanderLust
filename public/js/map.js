  
mapboxgl.accessToken = window.mapToken;

const coordinates = window.listing.geometry.coordinates;

console.log("coordinates are:", coordinates);

if (!coordinates || coordinates.length !== 2) {
    console.log("❌ No valid coordinates for this listing");
} else {

    const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v12",
        center: coordinates,
        zoom: 9
    });

    new mapboxgl.Marker({ color: "red" })
        .setLngLat(coordinates)
        .setPopup(
            new mapboxgl.Popup({ offset: 25 })
                .setHTML(`
                    <h3>${window.listing.title}</h3>
                    <p>Exact location will be provided after booking</p>
                `)
        )
        .addTo(map);
}