function CsvArcheoLayer(map) {
    var theLayer = L.geoCsv(null, {
        firstLineTitles: true,
        fieldSeparator: ',',
        onEachFeature: function(feature, layer) {
            var popupContent = '<b> hey </b>' // <--- change !!!
            http: //www.t4t35.fr/Megalithes/
            var popup = L.popup().setContent(popupContent);
            layer.bindPopup(popup);
        },
        //    pointToLayer: function(feature, latlng) {
        //          var myIcon = L.icon({
        //              iconUrl: 'images/chevre.png',
        //              iconSize: [40, 40],
        //              iconAnchor: [20, 20],
        //              popupAnchor: [0, -20]});
        //          var marker = L.marker(latlng, {icon:myIcon} );
        //          return  marker;
        //      },
    });


    $.ajax({
        type: 'GET',
        dataType: 'text',
        url: 'datas/archaeological.csv', // <--- change !!!
        error: function() {
            alert('Chargement impossible');
        },
        success: function(csv) {
            //var cluster = new L.MarkerClusterGroup();
            theLayer.addData(csv);
            //cluster.addLayer(bankias);
            //map.addLayer(cluster);
            map.addLayer(theLayer);
            map.fitBounds(theLayer.getBounds());
        },
        complete: function() {
            //$('#cargando').delay(500).fadeOut('slow');
        }
    });

    this.getLayer = function() {
        return theLayer;
    }
}
