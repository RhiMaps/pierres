var z = 11;
var myLL = L.latLng(43.3317, 2.5808);
var jsonMinZoom = 9;

function init() {


    // create a map in the "map" div, set the view to a given place and zoom
    var map = L.map('map', {
        center: myLL,
        zoom: z
    });

    // 
    // Map Layers
    //

    var esriLayer = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }).addTo(map);

    var stamenLayer = L.tileLayer('http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 20
    });

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

    var osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: 'OpenStreetMap'
    });

    var mapqLayer = L.tileLayer('http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
        attribution: 'MapQuest OpenStreetMap',
        subdomains: ['otile1', 'otile2', 'otile3', 'otile4']
    });



    //
    // POIS Overlays 
    //

    function overpassPopup(data, marker) {
        var divPopup = "";
        if (data.tags.name) divPopup += "<b>name: </b>" + data.tags.name + "<br/>";
        if (data.tags.site_type) divPopup += "<b>site_type: </b>" + data.tags.site_type + "<br/>";
        if (data.tags.megalith_type) divPopup += "<b>megalith_type: </b>" + data.tags.megalith_type + "<br/>";
        if (data.tags.source) divPopup += "<b>source: </b>" + toHref(data.tags.source) + "<br/>";
        return divPopup;
    }

    var loader = L.DomUtil.get('loader');
    var clusterLayer = new L.MarkerClusterGroup({
        disableClusteringAtZoom: 17,
    }).addTo(map);

    function jsonLoading(e) {
        // show loader
        loader.style.display = 'block';
        // Disable drag and zoom handlers.
        map.dragging.disable();
        map.touchZoom.disable();
        map.doubleClickZoom.disable();
        map.scrollWheelZoom.disable();
        //
    }

    function jsonLoaded(e) {
        loader.style.display = 'none';
        // Enable drag and zoom handlers.
        map.dragging.enable();
        map.touchZoom.enable();
        map.doubleClickZoom.enable();
        map.scrollWheelZoom.enable();
    }


    function toHref(ref) {
        var href = ref;
        if (ref.indexOf("http") > -1) href = "<a href=\"" + ref + "\">lien</a>";
        return href;
    }

    function overpassIcon(data, title) {
        var imageBase = "";
        var archeoType = data.tags.site_type;
        switch (archeoType) {
            case 'dolmen':
                imageBase = 'dolmen';
                break;
            case "megalih":
            case "meglith":
            case 'megalith':
                imageBase = 'menhir';
                break;
            case 'fortification':
                imageBase = 'fortifications';
                break;
            case 'tumulus':
                imageBase = 'tumulus';
                break;
            default:
                imageBase = 'ruine';
                break;
                /*
            "site_type": "petroglyph",
            "site_type": "quarry"
            "site_type": "villa",
            */
        }
        if (data.tags.source && data.tags.source.indexOf("t4t35") > -1) imageBase += '_red';
        var iconUrl = 'images/' + imageBase + '.png';
        return new L.Icon({
            iconUrl: iconUrl,
            iconSize: new L.Point(32, 37),
            iconAnchor: new L.Point(18, 37),
            popupAnchor: new L.Point(0, -37)
        });
    }

    var jsonLayer = L.layerJSON({
        url: 'http://overpass-api.de/api/interpreter?data=[out:json];node({lat1},{lon1},{lat2},{lon2})[historic=archaeological_site];out;',
        propertyItems: 'elements',
        propertyTitle: 'tags.name',
        propertyLoc: ['lat', 'lon'],
        buildIcon: overpassIcon,
        buildPopup: overpassPopup,
        minZoom: jsonMinZoom,
        layerTarget: clusterLayer,
    }).on('dataloading', jsonLoading)
        .on('dataloaded', jsonLoaded).addTo(map);



    //
    // Map Controls and Layers
    //

    var baseLayers = {
        "Satellite": esriLayer,
        "OSM": osmLayer,
        "MapBox": mapqLayer,
        "Hybrid": hybridDay,
        "Basic": stamenLayer,
    };

    var overLays = {
        "points": jsonLayer,
        "cluster": clusterLayer,
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
