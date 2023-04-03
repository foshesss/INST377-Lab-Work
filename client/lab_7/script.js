
async function mainEvent() { // the async keyword means we can make API requests
  const BASE_CONTENT = "A list of resturants from an API<br><br>"
  const form = document.querySelector('.main_form'); // This class name needs to be set on your form before you can listen for an event on it
  const restaurantList = document.querySelector("#restaurant_list")
  const textField = document.querySelector("#resto")
  const submitButton = document.querySelector("#submit-button")
  const retrieveDataButton = document.querySelector("#retrieve-data-button")
  const filterButton = document.querySelector("#form_filter_button")

  // define data
  let data = []
  let displayData = []

  submitButton.classList.add("hidden")
  console.log(submitButton.classList)

  // retrive data from the pg api
  const retrieveData = async () => {
    if (data.length != 0) return data // prevent multiple api calls

    // Basic GET request - this replaces the form Action
    const results = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
    let arrayFromJson = await results.json();
    data = arrayFromJson.map(({ name }) => name.toUpperCase());
    displayData = data

    // we can now load data
    submitButton.classList.remove("hidden")
  }

  // void function that updates data. filters based on 'restto' value. looks for all 
  // restaurants containing that value
  const filterList = (target) => {
    target = target.toLowerCase();
    displayData = data.filter(name => name.toLowerCase().includes(target));
  }

  const displayResults = (results) => {
    results = results || displayData
    const content = results.length === 0 ?
      "No results found." : `<ol><li>${results.join("</li><li>")}</li></ol>`
    restaurantList.innerHTML = BASE_CONTENT + content
  }


  // submit data-- display it on the site
  form.addEventListener('submit', (submitEvent) => {
    submitEvent.preventDefault();
    let results = displayData.slice(0, 15)

    // shuffle array (seems like we should be shuffling here based on vid)
    results.sort(() => Math.random() - 0.5);
    displayResults(results)
  });

  retrieveDataButton.addEventListener('click', retrieveData)

  // filter data
  filterButton.addEventListener('click', () => {
    const formData = new FormData(form);
    const formProps = Object.fromEntries(formData);
    filterList(formProps.resto) // filter based on 'resto'
    console.table(displayData)
  })

  textField.addEventListener('input', async (event) => {
    filterList(event.target.value)
    displayResults()
  })
}

document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests
