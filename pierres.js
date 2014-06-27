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


  var dlmLayer = L.geoJson(  archeological, {
      pointToLayer: archeoMarker,
      onEachFeature: archeoPopup,
  });
  dlmLayer.addTo(map);

   function archeoMarker (feature, latlng) {
          var imageUrl;
      var archeoType=feature.properties.site_type;
          switch( archeoType){
              case 'dolmen':
                  imageUrl='images/dolmen.png'; break;
              case "megalih":
              case "meglith":
              case 'megalith':
                  imageUrl='images/menhir.png'; break;
              case 'fortification':
                  imageUrl='images/fortifications.png'; break;
              case 'tumulus':
                  imageUrl='images/tumulus.png'; break;
              default:
                  imageUrl='images/ruine.png'; break;
              /*
            "site_type": "petroglyph",
            "site_type": "quarry"
            "site_type": "villa",
            */
          }
          var myIcon = L.icon({
              iconUrl: imageUrl,
              iconSize: [40, 40],
              iconAnchor: [20, 20],
              popupAnchor: [0, -20]});
          var marker = L.marker(latlng, {icon:myIcon} );
          return  marker;
      }

  function archeoPopup(feature, layer){
      var popupTxt='';
      if( undefined == feature.properties.site_type )
          popupTxt+='';
      else
          popupTxt+=feature.properties.site_type;

      if( undefined == feature.properties.name )
          popupTxt+='';
      else
          popupTxt+='</br>'+feature.properties.name;

    layer.bindPopup(popupTxt);
  }



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

