var z = 9;
var myLL = L.latLng(43.4459, 2.8606);

function init() {


    // create a map in the "map" div, set the view to a given place and zoom
    var map = L.map('map', {
        center: myLL,
        zoom: z
    });

    // 
    // Map Layers
    //

    var esriLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, '+
                     'USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, '+
                     'and the GIS User Community'
    }).addTo(map);

    var stamenLayer = L.tileLayer('https://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png', {
        attribution: 'Map tiles by <a href="https://stamen.com">Stamen Design</a>, <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 20
    });

    var osmLayer = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: 'OpenStreetMap'
    });

    var mapqLayer = L.tileLayer('https://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
        attribution: 'MapQuest OpenStreetMap',
        subdomains: ['otile1', 'otile2', 'otile3', 'otile4']
    });



    //
    // POIS Overlays 
    //


    var overpassDynLayer = new OverpassDynLayer(map).getLayer();
    overpassDynLayer.addTo(map);


    var t4t35Layer = new T4T35Layer(map).getLayer();
    t4t35Layer.addTo(map);

    //
    // Map Controls and Layers
    //

    var baseLayers = {
        "Satellite": esriLayer,
        "OSM": osmLayer,
        "MapBox": mapqLayer,
        "Basic": stamenLayer,
    };

    var overLays = {
        "Pierres": overpassDynLayer,
        "T4T35 Tarn": t4t35Layer,
    };



    // layers switcher
    L.control.layers(
        baseLayers,
        overLays, {
            collapsed: false,
        }
    ).setPosition('topright').addTo(map);

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
