var z=7;
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


  var dolmenLayer = L.geoJson(  archeological, {
      pointToLayer: archeoMarker,
      onEachFeature: archeoPopup,
      filter: function( feature, layer){
          return 'dolmen' == feature.properties.site_type;
      }
  });


  var fortifLayer = L.geoJson(  archeological, {
      pointToLayer: archeoMarker,
      onEachFeature: archeoPopup,
      filter: function( feature, layer){
          return 'fortification' == feature.properties.site_type;
      }
  });


  var tumulusLayer = L.geoJson(  archeological, {
      pointToLayer: archeoMarker,
      onEachFeature: archeoPopup,
      filter: function( feature, layer){
          return 'tumulus' == feature.properties.site_type;
      }
  }).addTo(map);

  var megalithLayer = L.geoJson(  archeological, {
      pointToLayer: archeoMarker,
      onEachFeature: archeoPopup,
      filter: function( feature, layer){
          return 'megalih' == feature.properties.site_type||
                 'meglith' == feature.properties.site_type||
                 'megalith' == feature.properties.site_type;
      }
  });

  var dolmenCluster = new L.MarkerClusterGroup();
  dolmenCluster.addLayer(fortifLayer);
  dolmenCluster.addLayer(dolmenLayer);
  dolmenCluster.addLayer(megalithLayer);
  dolmenCluster.addTo(map);

  var otherCluster = new L.MarkerClusterGroup();
  otherCluster.addLayer( otherLayer );
  otherCluster.addTo(map);

  var otherLayer = L.geoJson(  archeological, {
      pointToLayer: archeoMarker,
      onEachFeature: archeoPopup,
      filter: function( feature, layer){
          return 'petroglyph' == feature.properties.site_type||
                 'quarry' == feature.properties.site_type||
                 'villa' == feature.properties.site_type;
      }
  });

  var notypeLayer = L.geoJson(  archeological, {
      pointToLayer: archeoMarker,
      onEachFeature: archeoPopup,
      filter: function( feature, layer){
          return undefined == feature.properties.site_type;
      }
  }).addTo(map);


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
//   "dolmen": dolmenLayer,
   "megalithes": megalithLayer,
   "fortification": fortifLayer,
   "tumulus": tumulusLayer,
   "petroglyphe, villa": otherLayer,
   "sans type": notypeLayer,
 };

  L.control.layers(baseLayers, overlays).setPosition('topright').addTo(map);


}


init();

