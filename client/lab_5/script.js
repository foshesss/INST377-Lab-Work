/*
  Hook this script to index.html
  by adding `<script src="script.js">` just before your closing `</body>` tag
*/

/* A quick filter that will return something based on a matching input */
function filterList(list, query) {
  /*
    Using the .filter array method, 
    return a list that is filtered by comparing the item name in lower case
    to the query in lower case

    Ask the TAs if you need help with this
  */
}

async function mainEvent() { // the async keyword means we can make API requests
  const BASE_CONTENT = "A list of resturants from an API<br><br>"
  const form = document.querySelector('.main_form'); // This class name needs to be set on your form before you can listen for an event on it
  const restaurantList = document.querySelector("#restaurant_list")

  // retrive data based on an event's target data
  const retrieveData = async event => {
    const formData = new FormData(event.target);
    const formProps = Object.fromEntries(formData);

    // Basic GET request - this replaces the form Action
    const results = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
    let arrayFromJson = await results.json();

    // make this a set, removing duplicates
    // after it's become a set, convert back to an array in order
    // to access array methods
    arrayFromJson = Array.from(
      new Set(arrayFromJson.map(({name, establishment_id}) =>
            `${name.toLowerCase()}, id: ${establishment_id}`
      )));

    return [arrayFromJson, formProps]
  }

  // initial load
  let [data] = await retrieveData({target: form})

  // void function that updates data. filters based on 'restto' value. looks for all 
  // restaurants containing that value
  const filterList = async () => {
    // use retrieveData to get json (in array format) + formProps for parsing
    const [list, formProps] = await retrieveData({target: form})
    const target = formProps.resto.toLowerCase()
    data = list.filter(name =>  name.toLowerCase().includes(target))
  }

  // submit data-- display it on the site
  form.addEventListener('submit', async (submitEvent) => {
    submitEvent.preventDefault();
    const content = data.length === 0 ? "No results found." : data.join("<br>")
    restaurantList.innerHTML = BASE_CONTENT + content
  });

  // filter data
  const filterButton = document.querySelector("#form_filter_button")
  filterButton.addEventListener('click', async () => {
    console.log("clicked filterButton")
    await filterList()
    console.table(data)
  })
}

document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests
