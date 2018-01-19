// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Query elements
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('mail');
const titleSelect = document.getElementById('title');
const titleTextInput = document.getElementById('other-title');
const designSelect = document.getElementById('design');
const colorSelect = document.getElementById('color');
const activitiesFieldSet = document.getElementsByClassName('activities')[0];
const choices = activitiesFieldSet.getElementsByTagName('label');
const paymentSelect = document.getElementById('payment');
const creditCardDiv = document.getElementById('credit-card');
const ccnumInput = document.getElementById('cc-num');
const zipInput = document.getElementById('zip');
const cvvInput = document.getElementById('cvv');
const paypalDiv = document.getElementById('paypal');
const bitcoinDiv = document.getElementById('bitcoin');
const submitButton = document.getElementsByTagName('button')[0];


const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ ;

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Handlers
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// make the optionnal text input appear or not
const titleHandler = (e) => {
  // if 'other' option is selected in the menu
  if (e.target.value === 'other') {
    titleTextInput.style.display = '';
    titleTextInput.focus();
  } else {
    titleTextInput.style.display = 'none';
  }
};
// disable items in the color menu
const designHandler = (e) => {
  const choice = e.target.value;
  // Sets disabled attribute of options according to the design selected
  if (choice === 'js puns') {
    colorSelect.children[0].disabled = false;
    colorSelect.children[1].disabled = false;
    colorSelect.children[2].disabled = false;
    colorSelect.children[3].disabled = true;
    colorSelect.children[4].disabled = true;
    colorSelect.children[5].disabled = true;
    // select the first color available for this design
    colorSelect.children[0].selected = true;
  } else if ( choice === 'heart js') {
    colorSelect.children[0].disabled = true;
    colorSelect.children[1].disabled = true;
    colorSelect.children[2].disabled = true;
    colorSelect.children[3].disabled = false;
    colorSelect.children[4].disabled = false;
    colorSelect.children[5].disabled = false;
    // select the first color available for this design
    colorSelect.children[3].selected = true;
  } else {
    colorSelect.children[0].disabled = false;
    colorSelect.children[1].disabled = false;
    colorSelect.children[2].disabled = false;
    colorSelect.children[3].disabled = false;
    colorSelect.children[4].disabled = false;
    colorSelect.children[5].disabled = false;
  }
};
// disable label
const activitiesHandler = (e) => {
  const disableChoice = (el, bool) => {
    if (bool) {
      el.firstChild.disabled = true;
      el.style.color = 'grey';
      el.firstChild.checked = false;
    } else {
      el.firstChild.disabled = false;
      el.style.color = 'black';
    }
  }
  if (e.target.name === 'js-libs') {
    // disable node 4
    disableChoice(choices[4], e.target.checked);
  } else if (e.target.name === 'node') {
    // disable js-libs 2
    disableChoice(choices[2], e.target.checked);
  } else if (e.target.name === 'js-frameworks') {
    // disable Express 3
    disableChoice(choices[3], e.target.checked);
  } else if (e.target.name === 'express') {
    // disable js-frameworks 1
    disableChoice(choices[1], e.target.checked);
  }
}
// compute total price for activities selected
const activitiesTotal = (e) => {
  const prices = [200, 100, 100, 100, 100, 100, 100];
  let total = 0;
  for (let i = 0; i < choices.length; i++) {
    total += choices[i].firstChild.checked ? prices[i] : 0;
  }
  //check for an existing p
  const totalParagraph = activitiesFieldSet.getElementsByTagName('p')[0];
  if (totalParagraph) {
    totalParagraph.textContent = `Total: ${total}$`;
  } else {
    const totalParagraph = document.createElement('p');
    totalParagraph.textContent = `Total: ${total}$`;
    choices[0].parentNode.appendChild(totalParagraph);
  }
}
// payment options hide / show
const paymentOptionsDisplay = (e) => {
  const choice = e.target.value;
  console.log(choice);
  if (choice === 'credit card') {
    creditCardDiv.style.display = '';
    paypalDiv.style.display = 'none';
    bitcoinDiv.style.display = 'none';
  } else if (choice === 'paypal') {
    creditCardDiv.style.display = 'none';
    paypalDiv.style.display = '';
    bitcoinDiv.style.display = 'none';
  } else if (choice === 'bitcoin') {
    creditCardDiv.style.display = 'none';
    paypalDiv.style.display = 'none';
    bitcoinDiv.style.display = '';
  }
}
// formValidation
const formValidation = (e) => {
  //Name field can't be blank
  e.preventDefault();
  console.log('submit form');
  try {
    nameValidation(nameInput.value);
    emailValidation(emailInput.value);
    activitiesValidation();
    if (paymentSelect.value === 'credit card') {
      creditCardNumberValidation(ccnumInput.value);
      zipcodeValidation(zipInput.value);
      cvvValidation(cvvInput.value);
    }
  } catch(err) {
    console.log(err);
  }
}
//
const prevent = (e) => {
  e.preventDefault();
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Validation functions
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// Name field can't be blank
const nameValidation = (name) => {
  if (name === '') {
    throw new Error("Name field can't be blank");
  }
}
// Email must test against emailRegExp found here http://emailregex.com/ ...
const emailValidation = (email) => {
  if( ! emailRegExp.test(email) ) {
    throw new Error('email not valid');
  }
}
// Must select at least one checkbox under the "Register for Activities" section of the form.
const activitiesValidation = () => {
  const testArray = Array.from(choices);
  for (el of testArray) {
    if (el.firstChild.checked) return;
  }
  throw new Error('Must select at least one checkbox under the "Register for Activities" section of the form.');
}
// Credit card field should only accept a number between 13 and 16 digits
const creditCardNumberValidation = (ccn) => {
  const length = ccn.length;
  if ( ! /[0-9]{13,16}/.test(ccn) ) {
    throw new Error('Credit card number should be between 13 and 16 digits')
  }
}
// Zip code Validation
const zipcodeValidation = (zipcode) => {
  if ( ! /[0-9]{5}/.test(zipcode.toString()) ) {
    throw new Error('Zip code must be 5 digits')
  };
}
// CVV Validation
const cvvValidation = (cvv) => {
  if ( ! /[0-9]{3}/.test(cvv) ) {
    throw new Error('CVV code must be 3 digits')
  };
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Event handling
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

titleSelect.addEventListener('change', titleHandler);
designSelect.addEventListener('change', designHandler);
activitiesFieldSet.addEventListener('change', activitiesHandler);
activitiesFieldSet.addEventListener('change', activitiesTotal);
paymentSelect.addEventListener('change', paymentOptionsDisplay);
submitButton.addEventListener('click', formValidation);
submitButton.addEventListener('submit', prevent);

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Do things
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// hide the optionnal job role input text
titleTextInput.style.display = 'none';
// hide payment options by default
paypalDiv.style.display = 'none';
bitcoinDiv.style.display = 'none';
// select credit card by default
paymentSelect.children[1].selected = 'true';

// focus on the name field... it seems not to work if not in last with a little delay !!???
setTimeout( function() { nameInput.focus() }, 200);
