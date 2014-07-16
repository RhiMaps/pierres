var jsonMinZoom = 10;
var clusterMinZoom = 12;

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
    disableClusteringAtZoom: clusterMinZoom,
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
    switch (data.tags.site_type) {
        case 'dolmen':
            imageBase = 'dolmen';
            break;
        case "megalih":
        case "meglith":
        case 'megalith':
            imageBase = 'menhir';
            switch (data.tags.megalith_type) {
                case 'dolmen':
                case 'grosssteingrab':
                    imageBase = 'dolmen';
                    break;
                case 'menhir':
                    imageBase = 'menhir'
                    break;
                case 'alignment':
                    imageBase = 'alignment'
                    break;
                case 'stone_circle':
                    imageBase = 'circle'
                    break;
                case 'passage_grave':
                case 'chamber':
                default:
                    imageBase = 'ruine'
            }
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
