

function initMap() {
  const carto = L.map('map').setView([38.98, -76.93], 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(carto);
  return carto
}

function markerPlace(array, map) {
  // console.log("Array for markers: ", array);
  array = array ? array : [];
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) layer.remove();
  });

  array.forEach(item => {
    const {geocoded_column_1} = item;
    if (geocoded_column_1 == undefined) return;
    const {coordinates} = geocoded_column_1;

    L.marker([coordinates[1], coordinates[0]]).addTo(map)
  })
}

async function mainEvent() { // the async keyword means we can make API requests
  const BASE_CONTENT = "A list of resturants from an API<br><br>"
  const form = document.querySelector('.main_form'); // This class name needs to be set on your form before you can listen for an event on it
  const restaurantList = document.querySelector("#restaurant_list")
  const textField = document.querySelector("#resto")
  const submitButton = document.querySelector("#submit-button")
  const retrieveDataButton = document.querySelector("#retrieve-data-button")
  const clearDataButton = document.querySelector("#clear-data-button")

  const carto = initMap();

  const storedData = localStorage.getItem("storedData")
  const parsedData = JSON.parse(storedData)
  if (parsedData?.length > 0) {
    submitButton.classList.remove("hidden")
  } else {
    submitButton.classList.add("hidden")
  }

  // define data
  let displayData = parsedData

  // retrive data from the pg api
  const retrieveData = async () => {
    // Basic GET request - this replaces the form Action
    const results = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
    const arrayFromJson = await results.json();
    let data = arrayFromJson.map((item) => {
      item.name = item.name.toUpperCase();
      return item 
    });
    localStorage.setItem("storedData", JSON.stringify(data));
    displayData = data

    // we can now load data
    if (data?.length > 0) {
      submitButton.classList.remove("hidden")
    }
  }

  // void function that updates data. filters based on 'restto' value. looks for all 
  // restaurants containing that value
  const filterList = (target) => {
    target = target.toLowerCase();
    const data = JSON.parse(localStorage.getItem("storedData"));
    displayData = data.filter(({name}) => name.toLowerCase().includes(target));
  }

  const displayResults = () => {
    // due to the nature of my code, it makes the most sense
    // to add in addMarker here. the randomization and slicing
    // all occurs here. in another world, where each of these methods
    // are decoupled, it would make more sense to do this outside of
    // this function
    
    // randomize
    displayData.sort(() => Math.random() - 0.5);

    // slice
    let results = displayData.slice(0, 15);

    // plot
    markerPlace(results, carto);

    // convert to array of names (strings)
    results = results.map(({name}) => name.toUpperCase());

    const content = results.length === 0 ?
      "No results found." : `<ol><li>${results.join("</li><li>")}</li></ol>`
    restaurantList.innerHTML = BASE_CONTENT + content
  }


  // submit data-- display it on the site
  form.addEventListener('submit', (submitEvent) => {
    submitEvent.preventDefault();
    displayResults()
  });

  retrieveDataButton.addEventListener('click', retrieveData)

  textField.addEventListener('input', async (event) => {
    filterList(event.target.value)
    displayResults()
  })

  clearDataButton.addEventListener('click', event => {
    console.log("clear browzer data");
    localStorage.clear();
    console.log("localStorage check: ", localStorage.getItem("storedData"));
  })
}

document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests
