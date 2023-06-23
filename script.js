

const spainBounds = [
  [45.79, -20.0], // Northwest corner
  [26.0, 6.34]    // Southeast corner
];



const map = L.map('map', {
  center: [40.4637, -3.7492], // Madrid coordinates
  zoom: 6.5,
  dragging: true,
  tap: false,
  maxBounds: spainBounds,
    maxBoundsViscosity: 1.0
});


var iconsize1 = 55;
var iconsize2 = 55;

var iconAnchor1 = 25;
var iconAnchor2 = 50;

var popupAnchor1 = 0;
var popupAnchor2 = -50;


L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  subdomains: 'abcd',
  maxZoom: 8,
    minZoom: 6
}).addTo(map);

// GeoJSON data of Spain's provinces
var provincesData = {
  "type": "FeatureCollection",
  "features": [
    // Add the GeoJSON features for each province here
  ]
};

// Create a GeoJSON layer with the provinces data
var provincesLayer = L.geoJSON(provincesData).addTo(map);


const BASE_URL = "https://wttr.in";
const provinces = [
  "Álava",
  "Albacete",
  "Alicante",
  "Almería",
  "Asturias",
  "Ávila",
  "Badajoz",
  "Barcelona",
  "Burgos",
  "Cáceres",
  "Cádiz",
  "Cantabria",
  "Castellón",
  "Ciudad Real",
  "Córdoba",
  "Cuenca",
  "Girona",
  "Granada",
  "Guadalajara",
  "Guipúzcoa",
  "Huelva",
  "Huesca",
  "Islas Baleares",
  "Jaén",
  "A Coruña",
  "La Rioja",
  "Las Palmas",
  "León",
  "Lleida",
  "Lugo",
  "Madrid",
  "Málaga",
  "Murcia",
  "Navarra",
  "Ourense",
  "Palencia",
  "Pontevedra",
  "Salamanca",
  "Santa Cruz de Tenerife",
  "Segovia",
  "Sevilla",
  "Soria",
  "Tarragona",
  "Teruel",
  "Toledo",
  "Valencia",
  "Valladolid",
  "Vizcaya",
  "Zamora",
  "Zaragoza",
    "Ceuta",
    "Melilla",
    "Andorra"
];


async function getTemperature(city) {
  try {
    const params = new URLSearchParams({ format: "j1" });
    const response = await fetch(`${BASE_URL}/${city}?${params}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch data for ${city}`);
    }

    const data = await response.json();
    const temperature = data.current_condition[0].temp_C;
    const wh_desc = data.current_condition[0].weatherDesc[0].value;
    const coordinates = [data.nearest_area[0].latitude, data.nearest_area[0].longitude];
    return { city, temperature, coordinates, wh_desc };
  } catch (error) {
    console.error(`Error fetching temperature for ${city}:`, error);
    alert(`Failed to fetch temperature data for ${city}. Please try again later.`);
  }
}

(async () => {
  for (const province of provinces) {
    const { city, temperature, coordinates, wh_desc } = await getTemperature(province);

    var iconpath = "";
    var unknown = false;

    if (wh_desc == "Clear" || wh_desc == "clear"){
      iconpath = "media/clear.png"
    }
    else if (wh_desc == "Sunny" || wh_desc == "sunny"){
      if(temperature > 20 && temperature < 25){
        iconpath = "media/sunny1.png"
      }
        else if(temperature >= 25 && temperature < 35){
        iconpath = "media/sunny2.png"
      }
        else if(temperature >= 35){
        iconpath = "media/sunny3.png"
      }
        else{
        iconpath = "media/sunnylight.png"
      }
    }
    else if (wh_desc == "Partly cloudy" || wh_desc == "partly cloudy"){
      iconpath = "media/partly_cloudy.png"
    }
    else if (wh_desc == "Cloudy" || wh_desc == "cloudy"){
      iconpath = "media/cloudy.png"
    }
    else if (wh_desc == "Overcast" || wh_desc == "overcast"){
      iconpath = "media/overcast.png"
    }
    else if (wh_desc == "Light rain" || wh_desc == "light rain"){
        iconpath = "media/lightrain.png"
    }
    else if (wh_desc == "Heavy rain" || wh_desc == "heavy rain"){
      iconpath = "media/heavyrain.png"
    }
    else if (wh_desc == "Thunderstorms" || wh_desc == "thunderstorms" || wh_desc == "Thunderstorm" || wh_desc == "thunderstorm"){
      iconpath = "media/thunderstorm.png"
    }
    else if (wh_desc == "Snow" || wh_desc == "snow"){
      iconpath = "media/snow.png"
    }
    else if (wh_desc == "Mist" || wh_desc == "mist"){
      iconpath = "media/mist.png"
    }
    else if (wh_desc == "Fog" || wh_desc == "fog"){
      iconpath = "media/fog.png"
    }
    else if (wh_desc == "Hazle" || wh_desc == "hazle"){
      iconpath = "media/hazle.png"
    }
    else{
        unknown = true;
    }

    if(temperature > 0 && temperature <= 15){
      iconpath = "media/cold.png"
    }

    if(temperature < 0){
      iconpath = "media/below0.png"
    }



    if (unknown == true){
      const customIconFalse = L.icon({
        iconUrl: 'media/ditto.png', // Replace with the path to your custom icon
        iconSize: [iconsize1, iconsize2],
        iconAnchor: [iconAnchor1, iconAnchor2],
        popupAnchor: [popupAnchor1, popupAnchor2]
      });
      L.marker(coordinates, { icon: customIconFalse }).addTo(map)
          .bindPopup(`<strong>${city}</strong><br/>Temperature: ${temperature}°C<br/>Status: ${wh_desc}`)
          .on('click', function (e) {
            this.openPopup();
          });

    }
    else{
      const customIconTrue = L.icon({
        iconUrl: iconpath, // Replace with the path to your custom icon
        iconSize: [iconsize1, iconsize2],
        iconAnchor: [iconAnchor1, iconAnchor2],
        popupAnchor: [popupAnchor1, popupAnchor2]
      });

      L.marker(coordinates, { icon: customIconTrue }).addTo(map)
          .bindPopup(`<strong>${city}</strong><br/>Temperature: ${temperature}°C`)
          .on('click', function (e) {
            this.openPopup();
          });

    }


  }

})();

var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'legend');
  // Add your legend content here, including images
  div.innerHTML = `
    <div>
    <img src="media/clear.png"/>
      <span>Clear</span>
    </div>
    <div>
     <img src="media/cloudy.png"/>
      <span>Cloudy</span>
    </div>
    <div>
     <img src="media/fog.png"/>
      <span>Fog</span>
    </div>
    <div>
     <img src="media/haze.png"/>
      <span>Haze</span>
    </div>
    <div>
     <img src="media/heavyrain.png"/>
      <span>Heavy Rain</span>
    </div>
    <div>
     <img src="media/lightrain.png"/>
      <span>Light Rain</span>
    </div>
    <div>
     <img src="media/mist.png"/>
      <span>Mist</span>
    </div>
    <div>
     <img src="media/overcast.png"/>
      <span>Overcast</span>
    </div>
    <div>
     <img src="media/partly_cloudy.png"/>
      <span>Partly Cloudy</span>
    </div>
    <div>
     <img src="media/snow.png"/>
      <span>Snow</span>
    </div>
    <div>
     <img src="media/sunnylight.png"/>
      <span>Sunny (<20ºC)</span>
    </div>
        <div>
     <img src="media/sunny1.png"/>
      <span>Sunny (20-25ºC)</span>
    </div>
        <div>
     <img src="media/sunny2.png"/>
      <span>Sunny (25-35ºC)</span>
    </div>
        <div>
     <img src="media/sunny3.png"/>
      <span>Sunny (>35ºC)</span>
    </div>
    <div>
     <img src="media/thunderstorm.png"/>
      <span>Thunderstorm</span>
    </div>
    <div>
     <img src="media/ditto.png"/>
      <span>Unknown</span>
    </div>
    <div>
     <img src="media/cold.png"/>
      <span>Cold (0-15ºC)</span>
    </div>
    <div>
     <img src="media/below0.png"/>
      <span>Under 0</span>
    </div>
  `;
  return div;
};

legend.addTo(map);

var credits = L.control({ position: 'bottomleft' });
credits.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'legend');
  // Add your legend content here, including images
  div.innerHTML = `
  <div id="map-credits">
  <p>Images by <a href="https://pokemon.fandom.com/wiki/Pok%C3%A9mon_Wiki">Pokemon Wiki</a></p>
  <p>Powered by <a href="https://wttr.in/">Wttr</a></p>
  <p>Developed by <a href="https://github.com/RaymonDev">RaymonDev</a></p>
  <p>Inspired by <a href="https://www.infoanimales.com/wp-content/uploads/2017/06/Informaci%C3%B3n-sobre-el-mono-2.jpg">Xavi</a></p>
    </div>
  `;
  return div;
};

credits.addTo(map);
