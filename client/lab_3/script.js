/* eslint-disable max-len */
/*
  Welcome to Javascript!

  This file contains parts of a simple script to make your carousel work.
  Please feel free to edit away - the main version of this with all the notes is safely stored elsewhere
*/
/* eslint-enable max-len */
// set our first slide's position to "0", the opening position in an array
let slidePosition = 0;

// gather a reference to every slide we're using via the class name and querySelectorAll
const slides = document.querySelectorAll('.carousel_item');

// change that "NodeList" into a Javascript "array", to get access to "array methods"
const slidesArray = Array.from(slides);

// Figure out how many slides we have available
const totalSlides = slidesArray.length;

function updateSlidePosition() {
  // add hidden, remove visible classes to all images
  slidesArray.forEach((elem) => {
    elem.classList.add("hidden");
    elem.classList.remove("visible");
  })

  // make target visible
  const target = slidesArray[slidePosition];
  target.classList.remove("hidden")
  target.classList.add("visible")
}

function moveToNextSlide() {
  slidePosition += 1
  slidePosition %= slidesArray.length // go back to 0 if we hit length

  updateSlidePosition(); // this is how you call a function within a function
}
function moveToPrevSlide() {
  // if slidePos == 1, go to end of array. otherwise, subtract 1 from curr pos
  slidePosition = (slidePosition === 0) ? 
    slidesArray.length - 1 : slidePosition - 1;

  updateSlidePosition();
}

document.querySelector('.next')
  .addEventListener('click', () => {
    moveToNextSlide();
  });
  
document.querySelector('.prev')
  .addEventListener('click', () => {
    moveToPrevSlide();
  });