var z=11;
var myLL= L.latLng(43.3317,2.5808);


function init(){


  // create a map in the "map" div, set the view to a given place and zoom
    var map = L.map('map', {
      center:myLL,
      zoom:z});

    var hybridDay = L.tileLayer('http://{s}.{base}.maps.cit.api.here.com/maptile/2.1/maptile/{mapID}/hybrid.day/{z}/{x}/{y}/256/png8?app_id={app_id}&app_code={app_code}', {
    attribution: 'Map &copy; 1987-2014 <a href="http://developer.here.com">HERE</a>',
    subdomains: '1234',
    mapID: 'newest',
    app_id: '<insert your app_id here>',
    app_code: '<insert your app_code here>',
    base: 'aerial',
    minZoom: 0,
    maxZoom: 20
    });
hybridDay.addTo(map);

    var esriLayer = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });


  // add an OpenStreetMap tile layer
  var osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: 'OpenStreetMap'
      });

  var mapqLayer = L.tileLayer('http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
      attribution: 'MapQuest OpenStreetMap',
      subdomains: ['otile1','otile2','otile3','otile4']
      });


  var dolmenLayer = L.geoJson(  archaeological, {
      pointToLayer: archeoMarker,
      onEachFeature: archeoPopup,
      filter: function( feature, layer){
          return 'dolmen' == feature.properties.site_type;
      }
  }).addTo(map);

  var fortifLayer = L.geoJson(  archaeological, {
      pointToLayer: archeoMarker,
      onEachFeature: archeoPopup,
      filter: function( feature, layer){
          return 'fortification' == feature.properties.site_type;
      }
  }).addTo(map);

  var tumulusLayer = L.geoJson(  archaeological, {
      pointToLayer: archeoMarker,
      onEachFeature: archeoPopup,
      filter: function( feature, layer){
          return 'tumulus' == feature.properties.site_type;
      }
  }).addTo(map);

  var megalithLayer = L.geoJson(  archaeological, {
      pointToLayer: archeoMarker,
      onEachFeature: archeoPopup,
      filter: function( feature, layer){
          return 'megalih' == feature.properties.site_type||
                 'meglith' == feature.properties.site_type||
                 'megalith' == feature.properties.site_type;
      }
  }).addTo(map);

  var otherLayer = L.geoJson(  archaeological, {
      pointToLayer: archeoMarker,
      onEachFeature: archeoPopup,
      filter: function( feature, layer){
          return 'petroglyph' == feature.properties.site_type||
                 'quarry' == feature.properties.site_type||
                 'villa' == feature.properties.site_type;
      }
  }).addTo(map);

  var notypeLayer = L.geoJson(  archaeological, {
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
    "Satellite": esriLayer,
    "Hybrid": hybridDay,
    "MapBox": mapqLayer,
    "OSM": osmLayer
  };

 var overlays = {
   "dolmen": dolmenLayer,
   "megalithes": megalithLayer,
   "fortification": fortifLayer,
   "tumulus": tumulusLayer,
   "petroglyphe, villa": otherLayer,
   "sans type": notypeLayer,
 };

  L.control.layers(baseLayers, overlays).setPosition('topright').addTo(map);

  // rewrite url to show lat/lon/zoom
  // uses leaflet-hash as submodule
  var hash = new L.Hash(map);

  new L.Control.GeoSearch({
          provider: new L.GeoSearch.Provider.OpenStreetMap(),
          zoomLevel: 15,
  }).addTo(map);


}


init();

