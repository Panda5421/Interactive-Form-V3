const form = document.querySelector('form');
const jobRoles = document.querySelector('#title');
const otherJobRoles = document.querySelector('#other-job-role');
const designSelect = document.querySelector('#design');
const colorSelect = document.querySelector('#color');
const colorOptions = document.querySelectorAll('#color option');
const activitySection = document.querySelector('#activities');
const activityCheckboxes = document.querySelectorAll('#activities input[type="checkbox"]');
let total = document.querySelector('#activities-cost').textContent;
let totalCost = parseInt(total.match(/([\d*])$/));
const paymentMethods = document.querySelector('#payment');
const name = document.querySelector('#name');
const email = document.querySelector('#email');
const cardNum = document.querySelector('#cc-num');
const zip = document.querySelector('#zip');
const cvv = document.querySelector('#cvv');

//autofocuses on first input field on page load
name.focus();
//hides input field for 'Other' job role
otherJobRoles.style.display = 'none';
//disables color dropdow
colorSelect.disabled = true;
//selects credit card option as default payment method on page load
paymentMethods.children[1].selected = true;
updatePayment(paymentMethods.children[1].value);


//listens for clicks on job roles dropdown and hides other job role
//input field unless 'Other' job choice selected
jobRoles.addEventListener('change', e => {
	if(e.target.value === 'other') {
		otherJobRoles.style.display == 'none' ? 
		otherJobRoles.style.display = '' : 
		otherJobRoles.style.display = 'none';
	} else {
		otherJobRoles.style.display = 'none';
	}
});

//function to show/hide certain color options based on which design user chooses
function showAvailColors(design) {
	let regEx;
	//decides what to search for when hiding certain color options
	//depending on what design choice the user picks
	design == 'js puns' ? 
	regEx = /\(JS Puns shirt only\)$/ :
	regEx = /JS shirt only\)$/;

	//iterates through list of color options and hides certain choices
	//based on if they match the name of the design chosen
	for(let i = 1; i<colorOptions.length; i++) {
		regEx.test(colorOptions[i].text) ?
		colorOptions[i].hidden = false :
		colorOptions[i].hidden = true;
	}
	//iterates through list of color options, selects first option
	//that's not hidden from user, and breaks out of loop
	for(let i = 1; i<colorOptions.length; i++) {
		if(colorOptions[i].hidden == false) {
			colorOptions[i].selected = true;
			break;
		}
	}
}

//listens for click event on design theme dropdown and shows available color
//options based on theme chosen
designSelect.addEventListener('change', e => {
	if(e.target.value !== 'Select Theme') {
		colorSelect.disabled = false;
		showAvailColors(e.target.value);
	}
});

//updates available activities based on whether they conflict with
//the user's chosen activities
function updateActivities(activity, checked) {
	activityCheckboxes.forEach(act => {
		const time = act.getAttribute('data-day-and-time');
		if(checked && act !== activity && activity.getAttribute('data-day-and-time') === time) {
			act.disabled = true;
			act.parentNode.classList.add('disabled');
		} else if(act !== activity && activity.getAttribute('data-day-and-time') === time) {
			act.disabled = false;
			act.parentNode.classList.remove('disabled');			}
	});
}
//listens for a change in the state of the activities section and
//adjusts total price depending on the activities chosen
activitySection.addEventListener('change', e => {
	let dataCost = parseInt(e.target.getAttribute('data-cost'));
	isValid('activities-box', isActivitiesValid());
	if(e.target.checked) {
		updateActivities(e.target, true);
		totalCost += dataCost;
	} else {
		updateActivities(e.target, false);
		totalCost -= dataCost;
	}
	document.querySelector('#activities-cost').textContent = total.replace(/([\d*])$/, totalCost);
});

//helper updates the payment field to show the information necessary
//for the payment type chosen
function updatePayment(method) {
	const paymentSection = document.querySelector('fieldset.payment-methods').children;
	for(let i=2; i<paymentSection.length; i++) {
		method === paymentSection[i]['id'] ?
		paymentSection[i].hidden = false :
		paymentSection[i].hidden = true;
		
	}
}

//listens for a change in the payment method chosen and 
//calls on helper method to update payment field
paymentMethods.addEventListener('change', e => {
	updatePayment(e.target.value);
});

//helper functions to check if required form fields are valid
function isNameValid() {
	return name.value !== '' && !/^[ ]*$/.test(name.value);
}
function isEmailValid() {
	return email.value !== '' && /^\w+@\w+\.com$/.test(email.value);
}
function isCardNumValid() {
	return cardNum.value !== '' && /^\d{13,16}$/.test(cardNum.value);
}
function isZipValid() {
	return zip.value !== '' && /^\d{5}$/.test(zip.value);
}
function isCvvValid() {
	return cvv.value !== '' && /^\d{3}$/.test(cvv.value);
}
function isActivitiesValid() {
	const activities = document.querySelector('#activities-box').children;
	for(let i=0; i<activities.length; i++) {
		if(activities[i].firstElementChild.checked){
			return true;
		}
	}
	return false;

}

//helper function makes form validation errors visible
function isValid(element, valid) {
	const formField = document.querySelector('#'+element);
	const fieldParent = formField.parentElement;
	if(valid) {
		fieldParent.classList.add('valid');
		fieldParent.classList.remove('not-valid');
		fieldParent.lastElementChild.style.display = '';
		return true;
	} else {
		fieldParent.classList.add('not-valid');
		fieldParent.classList.remove('valid');
		fieldParent.lastElementChild.style.display = 'inherit';
		return false;
	}
}

//listens for submit event on form and prevents form submission
//if any required form fields invalid
form.addEventListener('submit', e => {
	const isValidList = [isValid('name', isNameValid()), 
						isValid('email', isEmailValid()),
						isValid('activities-box', isActivitiesValid())];

	const isValidCard = [isValid('cc-num', isCardNumValid()),
						isValid('zip', isZipValid()), 
						isValid('cvv', isCvvValid())];

	for(let i=0; i<isValidList.length; i++) {
		if(!isValidList[i]) {
			e.preventDefault();
		}
		//only checks validation of credit card form fields if
		//credit card chosen as payment option
		if(paymentMethods.children[1].selected) {
			if(!isValidCard[i]) {
				e.preventDefault();
			}
		}
	}
});

//makes focus states of activities obvious
activityCheckboxes.forEach(item => {
	item.addEventListener('focus', e => {
		item.parentElement.className = 'focus';
	});
});
activityCheckboxes.forEach(item => {
	item.addEventListener('blur', e => {
		document.querySelector('.focus').classList.remove('focus');
	});
});

//validates required form fields in real time
name.addEventListener('input', e => {
	isValid('name', isNameValid());
});
email.addEventListener('input', e => {
	isValid('email', isEmailValid());
});
cardNum.addEventListener('input', e => {
	isValid('cc-num', isCardNumValid());
});
zip.addEventListener('input', e => {
	isValid('zip', isZipValid());
});
cvv.addEventListener('input', e => {
	isValid('cvv', isCvvValid());
});