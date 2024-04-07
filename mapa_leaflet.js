const map = L.map('mapa').setView([50.12, 14.4], 14);

const tileLayer1 = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const tileLayer2 = L.tileLayer('https://www.chartae-antiquae.cz/TMS/Military2/{z}/{x}/{y}');

// BODÍKY, POLYGONY

const marker = L.marker([50.1040, 14.3907])
.addTo(map).bindPopup(`<strong>Ahoj.</strong><br />Já jsem pop-up.<br>Právě jsem v  NTK.`);


var mujgeojson = {
"type": "Feature",
"properties": {
"name": "Bodík",
"amenity": "stadion",
"popupContent": "Pop-up"
},
"geometry": {
"type": "Point",
"coordinates": [14.32, 50.1]
}
};

var myLines = [{
"type": "LineString",
"coordinates": [[14.5,50], [14.6,50], [14.7,50]]
}, {
"type": "LineString",
"coordinates": [[14.6,50], [14.6,50.2], [14.6,50.5]]
}];

var styl1 = {
"color": "#FF0000",
"weight": 4,
"opacity": 0.65
};


var geojsonMarkerOptions = {
radius: 6,
fillColor: "#ff7800",
color: "#000",
weight: 1,
opacity: 1,
fillOpacity: 0.8
};


const info = L.control();

info.onAdd = function (map) {
this._div = L.DomUtil.create('div', 'info');
this.update();
return this._div;
};


info.update = function (props) {
const contents = props ? `<b>${props.NAZEV}</b><br />${props.HUSTOTA} obyv. / km<sup>2</sup>` : 'Přejeďte nad ORP';
this._div.innerHTML = `<h4>Hustota obyvatelstva</h4>${contents}`;

};

info.addTo(map);

function getColor(d) {
return d > 2000 ? '#4a1486' :
    d > 1000  ? '#6a51a3' :
    d > 500  ? '#807dba' :
    d > 250  ? '#9e9ac8' :
    d > 150  ? '#bcbddc' :
    d > 80   ? '#dadaeb' : '#f2f0f7';
}

function kartogram(feature) {
return {
    weight: 2,
    opacity: 1,
    color: '#121212',
    fillOpacity: 0.7,
    fillColor: getColor(feature.properties.HUSTOTA)
};
}


function highlightFeature(e) {
const layer = e.target;

layer.setStyle({
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.7
});

layer.bringToFront();

info.update(layer.feature.properties);
}


geojson = L.geoJSON(ORP, {
style: kartogram,
onEachFeature: onEachFeature
}).addTo(map);

function resetHighlight(e) {
geojson.resetStyle(e.target);
info.update();
}

function zoomToFeature(e) {
map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature
});
}


const legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

const div = L.DomUtil.create('div', 'info legend');
const grades = [0, 80, 150, 250, 500, 1000, 2000];
const labels = [];
let from, to;

for (let i = 0; i < grades.length; i++) {
    from = grades[i];
    to = grades[i + 1];

    labels.push(`<i style="background:${getColor(from + 1)}"></i> ${from}${to ? `&ndash;${to}` : '+'}`);
}

div.innerHTML = labels.join('<br>');
return div;
};

legend.addTo(map);


