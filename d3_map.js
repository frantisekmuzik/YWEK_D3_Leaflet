villes = ({
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            properties: { name: 'Yverdon', data: [1, 3, 5] },
            geometry: { type: 'Point', coordinates: [6.6412, 46.7785] }
        },
        {
            type: 'Feature',
            properties: { name: 'Lausanne', data: [2, 8, 3] },
            geometry: { type: 'Point', coordinates: [6.6323, 46.5197] }
        },
    ]
});

const WIDTH = 600; // Width of the map container
const HEIGHT = WIDTH * 0.6; // Height of the map container

// Creating a div container for the map
let container = document.createElement('div');
container.setAttribute('style', `width:${WIDTH}px;height:${HEIGHT}px;background-color:white`);
document.body.appendChild(container);

// Creating the Leaflet map instance
const map = L.map(container).setView([46.65192, 6.63574], 10);

// Adding OpenStreetMap tiles
const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const DATA = villes.features.map(f => {
    const c = f.geometry.coordinates;
    return {
        ...f,
        latlng: new L.LatLng(c[1], c[0]),
        pieData: d3.pie()(f.properties.data)
    };
});

L.svg().addTo(map);

const overlay = d3.select(map.getPanes().overlayPane);
const svg = overlay.select('svg');

const g = svg.append('g').attr('class', 'leaflet-zoom-hide');

const cities = g.selectAll('g')
    .data(DATA)
    .enter()
    .append('g')
    .attr('opacity', 0.5);

const arcCreator = d3.arc()
    .innerRadius(0)
    .outerRadius(30);

const getColor = (d, i) => {
    if (i === 0) { return 'blue'; }
    if (i === 1) { return 'red'; }
    return 'green';
};

cities.selectAll('path')
    .data(d => d.pieData)
    .enter()
    .append('path')
    .attr('d', arcCreator)
    .attr('fill', getColor)
    .attr('stroke', 'white');

const onZoom = () => {
    cities.attr('transform', ({ latlng }) => {
        const { x, y } = map.latLngToLayerPoint(latlng);
        return `translate(${x}, ${y})`;
    });
};

onZoom();

map.on('zoomend', onZoom);
