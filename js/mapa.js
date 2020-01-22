/* https://openlayers.org/en/v4.6.5/examples/simple.html */
export async function carga_mapa(cord) {
    let div_ = document.getElementById("el_mapa");
    let mapa_ = document.createElement("div");
    mapa_.setAttribute("class", "map");
    mapa_.setAttribute("id", "map");
    div_.appendChild(mapa_);

    let head2 = document.getElementsByTagName('body')[0];
    let script2 = document.createElement('script');
    script2.type = 'text/javascript';
    script2.src = 'https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.3.0/build/ol.js';
    head2.appendChild(script2);

    mapa(cord);
}

export async function mapa(cord) {
    let map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([-4.724121093749999, 41.65239288426815]),
            zoom: 9
        })
    });

    let puntos = [];

    for(let pos of cord){
        let iconFeature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.transform([pos.lon, pos.lat], 'EPSG:4326', 'EPSG:3857'))
        });
        puntos.push(iconFeature);
    }

    let iconLayerSource = new ol.source.Vector({
        features: puntos 
    });

    let iconLayer = new ol.layer.Vector({
        source: iconLayerSource,
        style: new ol.style.Style({
            image: new ol.style.Icon({
                src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Map_marker_font_awesome.svg/200px-Map_marker_font_awesome.svg.png',
                anchor: [0.5, 1],
                scale: 0.2
            }),
        })
    });

    map.on('click', function (evt) {
        let coords = ol.proj.toLonLat(evt.coordinate);
        let lat = coords[1];
        let lon = coords[0];
        let locTxt = "Latitude: " + lat + " Longitude: " + lon;
        console.log(locTxt);
    });

    map.addLayer(iconLayer);

    /* Solucion temporal problema resize mapa - no se muestra */
    setInterval(function() {
        map.updateSize();
    }, 1000);
}