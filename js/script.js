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
    colorSelect.style.display = '';
    colorLabel.style.display = '';
    colorSelect.innerHTML = `<option value="cornflowerblue">Cornflower Blue</option>
    <option value="darkslategrey">Dark Slate Grey</option>
    <option value="gold">Gold</option>`;
    colorSelect.children[0].selected = true;
  } else if ( choice === 'heart js') {
    colorSelect.style.display = '';
    colorLabel.style.display = '';
    colorSelect.innerHTML = `<option value="tomato">Tomato</option>
    <option value="steelblue">Steel Blue</option>
    <option value="dimgrey">Dim Grey</option>`;
  } else {
    colorSelect.style.display = 'none';
    colorLabel.style.display = 'none';
    colorSelect.innerHTML = `<option value="Select a design">Please select a design</option>`;
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
const activitiesTotal = () => {
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

  const nameValidity = validators['name'].test(nameInput);
  const mailValidity = validators['mail'].test(emailInput);

  const basicValidity       = nameValidity
                              &&
                              mailValidity;

  const activitiesValidity  = activitiesValidation();

  const paymentValidity     = paymentSelect.value === 'credit card'
                              ?
                              validators['cc-num'].test(ccnumInput)
                              &&
                              validators['zip'].test(zipInput)
                              &&
                              validators['cvv'].test(cvvInput)
                              :
                              true;

  const formValidity        = basicValidity
                              &&
                              activitiesValidity
                              &&
                              paymentValidity;

  if (!nameValidity ) {
    notifyError(nameInput, 'Please, fill in your name');
    nameInput.focus();
  } else if (!mailValidity) {
    notifyError(nameInput, 'Please, fill in your e-mail');
    emailInput.focus();
  } else if (!activitiesValidity) {
    notifyError(choices[0], 'Please, choose an activity');
    choices[0].focus();
  } else if (!paymentValidity) {
    notifyError(creditCardDiv, 'Please, verify your payment infos');
    creditCardDiv.focus();
  }
  // query an error span for aactivities field set
  let activitiesErrorSpan = activitiesFieldSet.getElementsByTagName('span')[0];
  // query the legend element
  const activitiesLegend = activitiesFieldSet.querySelector('legend');
  // if the activities are not validated
  if ( ! activitiesValidity ) {
    // and the error span does not exist
    if ( ! activitiesErrorSpan ) {
      // create it and insert it
      activitiesErrorSpan = document.createElement('span');
      activitiesErrorSpan.innerText = "You must choose at least one activity";
      activitiesErrorSpan.className = 'error-message';
      activitiesLegend.appendChild(activitiesErrorSpan);
    }
  } else if (activitiesErrorSpan){
    // if activities are validated, remove the error span if any
    activitiesLegend.removeChild(activitiesErrorSpan);
  }
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

// all the validate functions for text inputs, and their error messages
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
    message: "CC number should be between 13 and 16 digits."
  },
  'zip': {
    test: input => /^[0-9]{5}$/.test(input.value),
    message: "Zipcode must be 5 digits."
  },
  'cvv': {
    test: input => /^[0-9]{3}$/.test(input.value),
    message: "CVV must be 3 digits."
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

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =

// notiiy an error message on the origin element's label
const notifyError = (origin, message) => {
  const destination = getParentElementByTagName(origin, 'FIELDSET').getElementsByTagName('legend')[0];
  const messageTarget = destination.getElementsByTagName('span')[0];
  if (message) {
    // add class error
    origin.classList.add('error');
    // message dans legend

  } else {
    // remove class error
    origin.classList.remove('error');
    // remove message
  }
  if(messageTarget) {
    destination.removeChild(messageTarget);
  }
  insertMessage(destination, message);
  //origin.focus();
};
// insert a message after the element (in a span)
const insertMessage = (element, message) => {
  const errorSpan = document.createElement('span');
  errorSpan.className = 'error-message';
  errorSpan.innerText = message;
  element.appendChild(errorSpan);
}
// find a parent of a certain tag name
const getParentElementByTagName = (element, tagName) => {
  while(element.tagName !== tagName) {
    element = element.parentNode;
    if (element.tagName === 'BODY') {
      return null;
    }
  }
  return element;
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Event handling
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

titleSelect.addEventListener('change', titleHandler);
designSelect.addEventListener('change', designHandler);
activitiesFieldSet.addEventListener('change', activitiesHandler);
activitiesFieldSet.addEventListener('change', activitiesTotal);
paymentSelect.addEventListener('change', paymentOptionsDisplay);
submitButton.addEventListener('click', formValidation, false);

Array.from(inputElements).forEach( (element) => {
  element.addEventListener('input', realTimeValidation);
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Do things
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// hide the optionnal job role input text
titleTextInput.style.display = 'none';
// hide color selection
colorSelect.style.display = 'none';
colorLabel.style.display = 'none';
// calculate the total price (display Total: 0$ for the moment)
activitiesTotal();
// hide payment options by default
paypalDiv.style.display = 'none';
bitcoinDiv.style.display = 'none';
// select credit card by default
paymentSelect.children[1].selected = 'true';
// focus on the name field... it seems not to work if not in last with a little delay !!???
nameInput.focus();
