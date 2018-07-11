var baseCoords = [38.897663, -77.036574];
var mymap = L.map("mapid").setView(baseCoords, 16);

L.tileLayer(
  "https://api.tiles.mapbox.com/v4/mapbox.emerald/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2FtLXBvcCIsImEiOiJjamhucjhhNXgwNTE0MzZwYWQxenprNG5kIn0.9c-GiLb45NYrZeAiy3TZ6w",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    minZoom: 13,
    id: "mapbox.emerald",
    accessToken:
      "pk.eyJ1Ijoic2FtLXBvcCIsImEiOiJjamhucjhhNXgwNTE0MzZwYWQxenprNG5kIn0.9c-GiLb45NYrZeAiy3TZ6w"
  }
).addTo(mymap);

// Show my current location
var myLoc = mymap.locate({
  setView: true,
  maxZoom: 16,
  // watch: true,
  enableHighAccuracy: true
});

// Current location custom icon
// var currentLocIcon = L.icon({
//   iconUrl: "./assets/img/map-marker-person.png",
//   iconSize: [38, 42],
//   iconAnchor: [20, 36],
//   popupAnchor: [-3, -76],
//   shadowUrl: "",
//   shadowSize: [68, 95],
//   shadowAnchor: [22, 94]
// });

// truck location custom icon
var truckCustomMaker = L.icon({
  iconUrl: "./assets/img/marker.png",
  iconSize: [34, 44],
  iconAnchor: [20, 36],
  popupAnchor: [-3, -76],
  shadowUrl: "",
  shadowSize: [68, 95],
  shadowAnchor: [22, 94]
});

// Current location success function
function onLocationFound(e) {
  // mymap.removeLayer(currentMarker);
  var radius = e.accuracy / 2;
  var currentMarker = L.marker(e.latlng, {
    icon: currentLocIcon
  });
  currentMarker.addTo(mymap);
  // L.circle(e.latlng, radius).addTo(mymap);
}
// Current location error function
function onLocationError(e) {
  alert(e.message);
}
// mymap.on("locationfound", onLocationFound);
mymap.on("locationerror", onLocationError);

$(function() {
  mymap.setView(baseCoords, 15);

  // Display truck markers on map
  $.get("/api/trucks").then(function(data) {
    console.log(data);

    for (var i of data) {
      var latlon = [i.Location.lat, i.Location.lon];
      var truckMarker = L.marker(latlon, {
        icon: truckCustomMaker
      });
      truckMarker.bindPopup(i.truckName);
      truckMarker.addTo(mymap);
      //addes truck to the truck list
      if (i.truckName) {
        var main = $("<div>").addClass("col-md-3 col-sm-6 mb-4");
        var name = $("<div>")
          .addClass("text-center")
          .css({
            "font-weight": "bold"
          })
          .text(i.truckName);
        var link = $("<a>").attr({
          href: "/profile/truck/" + i.id
        });
        var pic = $("<img>")
          .attr({
            src: i.pictureURL,
            width: "255",
            height: "153"
          })
          .addClass("shadow-sm");
        link.append(pic);
        main.append(link);
        main.append(name);
        $("#truckList").append(main);
      }
    }
  });
});
