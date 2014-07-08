var z=11;
var myLL= L.latLng(43.3317,2.5808);


function init(){


  // create a map in the "map" div, set the view to a given place and zoom
    var map = L.map('map', {
      center:myLL,
      zoom:z});

    var esriLayer = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }).addTo(map);

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


  // add an OpenStreetMap tile layer
  var osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: 'OpenStreetMap'
      });

  var mapqLayer = L.tileLayer('http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
      attribution: 'MapQuest OpenStreetMap',
      subdomains: ['otile1','otile2','otile3','otile4']
      });



  //
  // POIS Overlays 
  //



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

        function overpassPopup(data, marker) {
            var divPopup = "";
            if ( data.tags.name  )          divPopup+="<b>name: </b>"+data.tags.name +"<br/>";
            if ( data.tags.site_type )      divPopup+="<b>site_type: </b>"+data.tags.site_type+"<br/>" ;
            if ( data.tags.megalith_type )  divPopup+="<b>megalith_type: </b>"+data.tags.megalith_type+"<br/>";
            if ( data.tags.source )         divPopup+="<b>source: </b>"+toHref(data.tags.source)+"<br/>";
            return divPopup;
        }
        function overpassIcon(data, title) {
          var imageBase="";
          var archeoType=data.tags.site_type;
          switch( archeoType){
              case 'dolmen':
                  imageBase='dolmen'; break;
              case "megalih":
              case "meglith":
              case 'megalith':
                  imageBase='menhir'; break;
              case 'fortification':
                  imageBase='fortifications'; break;
              case 'tumulus':
                  imageBase='tumulus'; break;
              default:
                  imageBase='ruine'; break;
              /*
            "site_type": "petroglyph",
            "site_type": "quarry"
            "site_type": "villa",
            */
          }
            if ( data.tags.source && data.tags.source.indexOf("t4t35") > -1 ) imageBase +='_red';
            var iconUrl='images/'+imageBase+'.png';
            return new L.Icon({
                iconUrl:iconUrl,
                iconSize: new L.Point(32, 37),
                iconAnchor: new L.Point(18, 37),
                popupAnchor: new L.Point(0, -37)
            });
        }


  var loader = L.DomUtil.get('loader');

    L.layerJSON({
        url:
        'http://overpass-api.de/api/interpreter?data=[out:json];node({lat1},{lon1},{lat2},{lon2})[historic=archaeological_site];out;',
        propertyItems: 'elements',
        propertyTitle: 'tags.name',
        propertyLoc: ['lat','lon'],
        buildIcon: overpassIcon,
        buildPopup: overpassPopup,
    })
    .on('dataloading',function(e) {
        loader.style.display = 'block';
    })
    .on('dataloaded',function(e) {
        loader.style.display = 'none';
    })
    .addTo(map);

    function toHref( ref ){
        var href=ref;
        if (ref.indexOf("http") > -1 ) href = "<a href=\""+ref+"\">"+ref+"</a>";
        console.log("href: "+ href);
        return href;
    }


  var baseLayers = {
    "Satellite": esriLayer,
    "Hybrid": hybridDay,
    "MapBox": mapqLayer,
    "OSM": osmLayer
  };

 // layers switcher
  L.control.layers(baseLayers).setPosition('topright').addTo(map);

  // scale at bottom left
  L.control.scale().addTo(map);

  // rewrite url to show lat/lon/zoom
  // (uses leaflet-hash plugin as submodule)
  var hash = new L.Hash(map);

  // search field to find place
  // (use leaflet-geocoding plugin as submodule)
  new L.Control.GeoSearch({
          provider: new L.GeoSearch.Provider.OpenStreetMap(),
          zoomLevel: 15,
  }).addTo(map);





}


init();

