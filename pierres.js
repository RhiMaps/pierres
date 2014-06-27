var z=9;
var myLL= L.latLng(43.59, 1.45);

function init(){


  // create a map in the "map" div, set the view to a given place and zoom
    var map = L.map('map', {
      center:myLL,
      zoom:z});

  // add an OpenStreetMap tile layer
  var osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: 'OpenStreetMap'
      });
  osmLayer.addTo(map);
  var mapqLayer = L.tileLayer('http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
      attribution: 'MapQuest OpenStreetMap',
      subdomains: ['otile1','otile2','otile3','otile4']
      });
  mapqLayer.addTo(map);



  var mnhOptions = {
      radius: 8,
      fillColor: "red",
      color: "black",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
  };
  var dlmOptions = {
      radius: 8,
      fillColor: "yellow",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
  };

  var dlmLayer = L.geoJson(  archeological, {
      pointToLayer: function (feature, latlng) {
          var imageUrl;
      var archeoType=feature.properties.site_type;
      switch( archeoType){
          case 'dolmen':
              imageUrl='images/dolmen.png'; break;
          case 'megalith':
              imageUrl='images/menhir.png'; break;
          case 'fortification':
              imageUrl='images/fortifications.png'; break;
          default:
              imageUrl='images/ruine.png'; break;
      }
          var myIcon = L.icon({
              iconUrl: imageUrl,
              iconSize: [40, 40],
              iconAnchor: [20, 20],
              popupAnchor: [0, -20]});
          var marker = L.marker(latlng, {icon:myIcon} );
          return  marker;
      },
      style: archeoColor,
    onEachFeature: function (feature, layer) {
        layer.bindPopup(feature.properties.site_type);
    }
  });
  dlmLayer.addTo(map);

  function archeoColor(feature){

      var archeoType=feature.properties.site_type;
      var archeoColor;
      switch( archeoType){
          case 'fortification':
              archeoColor='red'; break;
          case 'bigstone':
              archeoColor='blue'; break;
          case 'dolmen':
              archeoColor='green'; break;
          case 'megalith':
              archeoColor='yellow'; break;
          default:
              archeoColor='white'; 
      }

      return {fillColor: archeoColor};

  };




  var baseLayers = {
    "MapBox": mapqLayer,
    "OSM": osmLayer
  };

  var overlays = {
    "pierres": dlmLayer,
  };

  L.control.layers(baseLayers, overlays).setPosition('bottomleft').addTo(map);


}


init();

