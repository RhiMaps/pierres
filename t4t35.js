var t4t35Layer = L.geoCsv(null, {
    firstLineTitles: true,
    fieldSeparator: ';',
    onEachFeature: function (feature, layer) {
        var popupContent = '<b>'+feature.properties['nomsite']+'</b>'
                         + '</br><a href="http://www.t4t35.fr/Megalithes/AfficheSite.aspx?NumSite='+feature.properties['numsite']+'">Lien T4T35</a>'
                         + '</br><img src="http://www.t4t35.fr/Megalithes/AffichePreview.aspx?Projet=France&IDSite='+feature.properties['idsite']+'"/>'
    http://www.t4t35.fr/Megalithes/
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


$.ajax ({
    type:'GET',
    dataType:'text',
    url:'datas/T4T35-tous-82.csv',
   error: function() {
     alert('Chargement impossible');
   },
    success: function(csv) {
      //var cluster = new L.MarkerClusterGroup();
        t4t35Layer.addData(csv);
        //cluster.addLayer(bankias);
        //map.addLayer(cluster);
        map.addLayer(t4t35Layer);
        map.fitBounds(t4t35Layer.getBounds());
    },
   complete: function() {
      //$('#cargando').delay(500).fadeOut('slow');
   }
});
