'use strict';

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Query elements
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// form element
const formElement        = document.getElementsByTagName('form')[0];
// name and email
const nameInput          = document.getElementById('name');
const emailInput         = document.getElementById('mail');
// Job role
const titleSelect        = document.getElementById('title');
const titleTextInput     = document.getElementById('other-title');
// T-shirt section
const designSelect       = document.getElementById('design');
const colorLabel         = document.querySelector('label[for="color"]');
const colorSelect        = document.getElementById('color');
// activities section
const activitiesFieldSet = document.getElementsByClassName('activities')[0];
const choices            = activitiesFieldSet.getElementsByTagName('label');
// Payment section
const paymentSelect      = document.getElementById('payment');
const creditCardDiv      = document.getElementById('credit-card');
const ccnumInput         = document.getElementById('cc-num');
const zipInput           = document.getElementById('zip');
const cvvInput           = document.getElementById('cvv');
const paypalDiv          = document.getElementById('paypal');
const bitcoinDiv         = document.getElementById('bitcoin');
// Submit button
const submitButton       = document.getElementsByTagName('button')[0];
// ALl Inputs
const inputElements      = document.getElementsByTagName('input');

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Handlers
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// make the optionnal text input appear or not
const titleHandler = (e) => {
  // if 'other' option is selected in the menu
  if (e.target.value === 'other') {
    // display the text input elemnt
    titleTextInput.style.display = '';
    // and set focus on it
    titleTextInput.focus();
  } else {
    // else hide it
    titleTextInput.style.display = 'none';
  }
};
// disable items in the color menu
const designHandler = (e) => {
  const choice = e.target.value;
  // Sets disabled attribute of options according to the design selected
  if (choice === 'js puns') {
    // show menu and label
    colorSelect.style.display = '';
    colorLabel.style.display = '';
    // set the content of the menu
    colorSelect.innerHTML = `<option value="cornflowerblue">Cornflower Blue</option>
    <option value="darkslategrey">Dark Slate Grey</option>
    <option value="gold">Gold</option>`;
    // select a valid option
    colorSelect.children[0].selected = true;
  } else if ( choice === 'heart js') {
    colorSelect.style.display = '';
    colorLabel.style.display = '';
    colorSelect.innerHTML = `<option value="tomato">Tomato</option>
    <option value="steelblue">Steel Blue</option>
    <option value="dimgrey">Dim Grey</option>`;
  } else {
    // hide the menu and label if no design is selected
    colorSelect.style.display = 'none';
    colorLabel.style.display = 'none';
    colorSelect.innerHTML = `<option value="Select a design">Please select a design</option>`;
  }
};
// disable label
const activitiesHandler = (e) => {
  // here's a handy function to disable an option (uncheck and grey out)
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
  // erase error, if any, when user selects an activity
  if (e.target.checked) {
    notifyError(choices[0], '');
  }
}
// compute total price for activities selected
const activitiesTotal = () => {
  // list of prices
  const prices = [200, 100, 100, 100, 100, 100, 100];
  let total = 0;
  // every check box add its list price if it's checked
  for (let i = 0; i < choices.length; i++) {
    total += choices[i].firstChild.checked ? prices[i] : 0;
  }
  //check for an existing p
  const totalParagraph = activitiesFieldSet.getElementsByTagName('p')[0];
  if (totalParagraph) {
    // if it exists set its content
    totalParagraph.textContent = `Total: ${total}$`;
  } else {
    // else create it and append it
    const totalParagraph = document.createElement('p');
    totalParagraph.textContent = `Total: ${total}$`;
    choices[0].parentNode.appendChild(totalParagraph);
  }
}
// payment options hide / show
const paymentOptionsDisplay = (e) => {
  const choice = e.target.value;
  // every choice make its div show and the others disappear
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
  } else if (choice === 'select_method') {
    creditCardDiv.style.display = 'none';
    paypalDiv.style.display = 'none';
    bitcoinDiv.style.display = 'none';
  }
}
// formValidation
const formValidation = (e) => {

  // credit card inputs are valid if test return true OR credit card payment is NOT selected
  const cvvValidity         = validators['cvv'].test(cvvInput)
                                || !(paymentSelect.value === 'credit card');
  const zipValidity         = validators['zip'].test(zipInput)
                                || !(paymentSelect.value === 'credit card');
  const ccnumValidity       = validators['cc-num'].test(ccnumInput)
                                || !(paymentSelect.value === 'credit card');

  // activities, mail and name validations
  const activitiesValidity  = activitiesValidation();
  const mailValidity        = validators['mail'].test(emailInput);
  const nameValidity        = validators['name'].test(nameInput);

  // form is valid if ALL the fields are valid
  const formValidity        = nameValidity
                              &&
                              mailValidity
                              &&
                              activitiesValidity
                              &&
                              ccnumValidity
                              &&
                              zipValidity
                              &&
                              cvvValidity
                              ;
  // if input is invalid, notify a message and set the focus on it
  // conditionnals are on reverse order so the first error in the page gets the focus
  // error message is different if the input is empty
  if ( !cvvValidity ) {
    let message = cvvInput.value.length === 0
                  ? 'required'
                  : 'not valid';
    notifyError(cvvInput, message);
    cvvInput.focus();
  }
  if ( !zipValidity ) {
    let message = zipInput.value.length === 0
                  ? 'required'
                  : 'not valid';
    notifyError(zipInput, message);
    zipInput.focus();
  }
  if ( !ccnumValidity ) {
    let message = ccnumInput.value.length === 0
                  ? 'required'
                  : 'not valid';
    notifyError(ccnumInput, message);
    ccnumInput.focus();
  }
  if ( !activitiesValidity ) {
    notifyError(choices[0], 'Please, choose an activity');
    // the page scrolls automatically to the first error in the page
    scrollBy(0, choices[0].parentElement.getBoundingClientRect().top);
  }
  if ( !mailValidity ) {
    let message = emailInput.value === ''
                  ? 'Please, fill in your e-mail'
                  : 'e-mail not formatted properly';
    notifyError(emailInput, message);
    emailInput.focus();
    scrollBy(0, emailInput.parentElement.getBoundingClientRect().top);
  }
  if ( !nameValidity ) {
    notifyError(nameInput, 'Please, fill in your name');
    nameInput.focus();
    scrollBy(0, nameInput.parentElement.getBoundingClientRect().top);
  }
  // prevent submitting the form if not completely validated
  if ( !formValidity ) {
    e.preventDefault();
  }
};
// test input as the user is typing
const realTimeValidation = (e) => {
  // use event's target id to get the right validator object
  const validator = validators[e.target.id];
  // notify error. If no error test returns true and empty string is sent as second argument
  notifyError(e.target, validator.test(e.target) ? '' : validator.message );
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Validation functions
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// all the validate functions for text inputs, and their error messages in an object
const validators = {
  'name': {
    test: input => /\w/.test(input.value),
    message: "Name can't be blank."
  },
  'mail': {
    test: input =>
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(input.value),
    message: "E-mail not valid."
  },
  'cc-num': {
    test: input => /^\d{13,16}$/y.test(input.value),
    message: "13 - 16 digits."
  },
  'zip': {
    test: input => /^[0-9]{5}$/.test(input.value),
    message: "5 digits"
  },
  'cvv': {
    test: input => /^[0-9]{3}$/.test(input.value),
    message: "3 digits"
  },
  'other-title': {
    test: () => true,
    message: ''
  }
}
// Must select at least one checkbox under the "Register for Activities" section of the form.
const activitiesValidation = () => {
  const el = activitiesFieldSet;
  //make an iterable array from the HTMLCollection
  const testArray = Array.from(choices);
  // check for all checkboxes
  for (let el of testArray) {
    // it's ok if one's checked
    if (el.firstChild.checked) return true;
  }
  return false;
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Helper function
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// notify an error message on the origin element's label
const notifyError = (origin, message) => {
  // the message will be displayed in the label element upon the input field
  const destination = origin.previousElementSibling;
  const messageTarget = destination.getElementsByTagName('span')[0];
  //
  if (message) {
    // add class error
    origin.classList.add('error');
  } else {
    // remove class error
    origin.classList.remove('error');
  }
  // if the span already exist remove it
  if(messageTarget) {
    destination.removeChild(messageTarget);
  }
  // create a new span
  const errorSpan = document.createElement('span');
  errorSpan.className = 'error-message';
  errorSpan.innerText = message;
  destination.appendChild(errorSpan);
  //insertMessage(destination, message);
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Event handling
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

titleSelect.addEventListener('change', titleHandler);
designSelect.addEventListener('change', designHandler);
activitiesFieldSet.addEventListener('change', activitiesHandler);
activitiesFieldSet.addEventListener('change', activitiesTotal);
paymentSelect.addEventListener('change', paymentOptionsDisplay);
submitButton.addEventListener('click', formValidation, false);
// put a handler on every input element for realtime validation
Array.from(inputElements).forEach( (element) => {
  element.addEventListener('input', realTimeValidation);
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Set up the page at load time
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// hide the optionnal job role input text
titleTextInput.style.display = 'none';
// hide color selection
colorSelect.style.display = 'none';
colorLabel.style.display = 'none';
// hide payment options by default
paypalDiv.style.display = 'none';
bitcoinDiv.style.display = 'none';
// select credit card by default
paymentSelect.children[1].selected = 'true';
// calculate the total price (display Total: 0$ for the moment)
activitiesTotal();
// focus on the name field
nameInput.focus();
