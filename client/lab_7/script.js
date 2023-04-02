/* eslint-disable max-len */

/*
  Hook this script to index.html
  by adding `<script src="script.js">` just before your closing `</body>` tag
*/

/*
  ## Utility Functions
    Under this comment place any utility functions you need - like an inclusive random number selector
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
*/

function injectHTML(list) {
    console.log('fired injectHTML');

    const restaurantList = document.querySelector("#restaurant_list")

    // convert list to an ordered list with list elements
    const content = "<ol>" + 
      list.reduce((accumulator, {name, category}) => 
        `${accumulator} <li>${name}, ${category}</li>`, ""
      ) + "</ol>"

    // set innerHTML to content, which is an ordered list of restaurants
    restaurantList.innerHTML = content
}

function processRestaurants(list) {
  console.log('fired restaurants list');

  /*
    ## Process Data Separately From Injecting It
      This function should accept your 1,000 records
      then select 15 random records
      and return an object containing only the restaurant's name, category, and geocoded location
      So we can inject them using the HTML injection function

      You can find the column names by carefully looking at your single returned record
      https://data.princegeorgescountymd.gov/Health/Food-Inspection/umjn-t2iz

    ## What to do in this function:

    - Create an array of 15 empty elements (there are a lot of fun ways to do this, and also very basic ways)
    - using a .map function on that range,
    - Make a list of 15 random restaurants from your list of 100 from your data request
    - Return only their name, category, and location
    - Return the new list of 15 restaurants so we can work on it separately in the HTML injector
  */

    const listLen = list.length
    // create an empty array with 15 empty dicts
    let restaurants = Array.apply(null, Array(15)).map(() => { return {} }) 

    // create a set of selected numbers to ensure there are no duplicate restaurants
    const selectedNumbers = new Set()
    restaurants.forEach(info => {
      // find a restaurant to insert
      let index // define outside of 'do while' to be used later
      do {
        index = Math.floor(Math.random()*listLen)
      } while (selectedNumbers.has(index))

      selectedNumbers.add(index) // prevent using same index again

      // info is a reference copy, so modifying 'info' in this function will
      // also modify the dict within the restaurant array
      const selectedRestaurant = list[index]
      info.name = selectedRestaurant.name
      info.category = selectedRestaurant.category
      info.location = selectedRestaurant.location
    })

    return restaurants
}

async function mainEvent() {
  /*
    ## Main Event
      Separating your main programming from your side functions will help you organize your thoughts
      When you're not working in a heavily-commented "learning" file, this also is more legible
      If you separate your work, when one piece is complete, you can save it and trust it
  */

  // the async keyword means we can make API requests
  const form = document.querySelector('.main_form'); // get your main form so you can do JS with it
  const submit = document.querySelector('button[type="submit"]'); // get a reference to your submit button
  submit.style.display = 'none'; // let your submit button disappear

  /*
    Let's get some data from the API - it will take a second or two to load
    
   */
  const results = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
  const arrayFromJson = await results.json(); // here is where we get the data from our request as JSON

  /*
    Below this comment, we log out a table of all the results:
  */
  console.table(arrayFromJson);

  // As a next step, log the first entry from your returned array of data.
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
  console.log(arrayFromJson[0]);

  // Now write a log using string interpolation - log out the name and category of your first returned entry (index [0]) to the browser console
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors
  console.log(`name: ${arrayFromJson[0].name}, category: ${arrayFromJson[0].category}`);

  // get loading anim element
  const loadingElem = document.querySelector(".lds-ellipsis");
  loadingElem.style.display = "none"


  // This IF statement ensures we can't do anything if we don't have information yet
  if (arrayFromJson?.length > 0) { // the question mark in this means "if this is set at all"
    submit.style.display = 'block'; // let's turn the submit button back on by setting it to display as a block when we have data available

    // And here's an eventListener! It's listening for a "submit" button specifically being clicked
    // this is a synchronous event event, because we already did our async request above, and waited for it to resolve

    let lastClick = null// this just initializes the value
    form.addEventListener('submit', (submitEvent) => {
      // Using .preventDefault, stop the page from refreshing when a submit event happens
      // https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
      submitEvent.preventDefault();

      // used as a sanity check so someone that spams submit doesn't break the page
      const currentClick = new Date()
      lastClick = currentClick

      loadingElem.style.display = "inline-block"
      // This constant will contain the value of your 15-restaurant collection when it processes
      const restaurantList = processRestaurants(arrayFromJson);

      setTimeout(() => {
        if (currentClick != lastClick) return // this means a new click occurred before we could load the lsit

        loadingElem.style.display = "none"
        injectHTML(restaurantList);
      }, 1000);
    });
  }
}

/*
  This last line actually runs first!
  It's calling the 'mainEvent' function at line 57
  It runs first because the listener is set to when your HTML content has loaded
*/
document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests
