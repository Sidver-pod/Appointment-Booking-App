//helps to wait for the respective booking(s) to appear after 'GET' request is sent
//it takes the bookings about a few milliseconds to appear before the user can click on "change" or "cancel"
var flag = 0;

const URL_endpoint = 'https://crudcrud.com/api/8b3a099c2d5b49248075f5efe849bb95/appointmentBooking/';

let div = document.createElement('div');
let ol = document.createElement('ol');
div.appendChild(ol);
document.body.children[2].children[0].appendChild(div);

//accessing a single entity (single data) from the 'server' using the unique "key" stored in 'localStorage' 
Object.keys(localStorage).forEach((key) => {
    let value = localStorage.getItem(key);
    let singleEntityURL = URL_endpoint + value;
    
    //GET request
    axios
        .get(singleEntityURL)
        .then((res) => {
            console.log(res);
            let li = document.createElement('li');
            li.className = 'list';
            
            let span_details = document.createElement('span');
            span_details.innerText = `${res.data.username} - ${res.data.email}`;

            let span_buttons = document.createElement('span');
            let change = document.createElement('button');
            let cancel = document.createElement('button');
            let div_1 = document.createElement('div');
            let username = document.createElement('input');
            let email = document.createElement('input');
            span_buttons.className = 'buttons';
            span_buttons.id = value; //storing 'key' as ID
            change.id = 'change';
            change.innerText = `change`;
            cancel.id = 'cancel';
            cancel.innerText = `cancel`;
            div_1.className = 'input-fields';
            username.type = 'text';
            username.placeholder = 'Name';
            username.id = 'username';
            email.type = 'text';
            email.placeholder = 'Email';
            email.id = 'email';
            span_buttons.appendChild(change);
            span_buttons.appendChild(cancel);
            div_1.appendChild(username);
            div_1.appendChild(email);

            li.appendChild(span_details);
            li.appendChild(span_buttons);
            li.appendChild(div_1);
            ol.appendChild(li);

            flag = 1;
        })
        .catch(err => console.error(err));
});

//waiting for 1000 milliseconds so as to first allow for all the data to be received from the server to the user's Front-End
setTimeout(() => {
    if(flag === 1) {
        //making an array out of HTML Collection of 'li'
        Array.from(document.getElementsByTagName('li')).forEach((li) => {
            li.children[1].children[0].addEventListener('click', makeChanges);
            li.children[1].children[1].addEventListener('click', cancelAppointment);
        });
    }
    else {
        alert(`No bookings have been made. Please head over to the 'HOME' page to make one.`);
    }
}, 1000);

//in order to hide/reveal the inputs on clicking "change"!
var revealInputFlag = 0;

function makeChanges(e) {
    e.preventDefault();

    let changeInputs = e.target.parentElement.nextElementSibling;
    let updateButton = e.target;
    let backButton = e.target.nextElementSibling;

    if(revealInputFlag == 0){
        //revealing
        changeInputs.style.display = 'block'; //made visible in the Front-End to the user
        updateButton.innerText = "update"; //changing "change" into "update" (temporarily!)
        backButton.innerText = "back"; //changing "cancel" into "back" (temporarily!)
        revealInputFlag = 1; //set
    }
    else {
        let username = e.target.parentElement.nextElementSibling.children[0].value;
        let email = e.target.parentElement.nextElementSibling.children[1].value;

        if(username == "" || email == "") {
            alert(`Please fill in the valid credentials in order to make changes to the booking or click 'back' to leave it unchanged.`);
        }
        else {
            hideInputs(changeInputs, updateButton, backButton); //hiding the inputs from the Front-End

            let value = e.target.parentElement.id;
            let singleEntityURL = URL_endpoint + value;

            //PUT request
            axios
                .put(singleEntityURL, {
                    username: username,
                    email: email
                })
                .then((res) => {
                    console.log(res);
                    alert(`Your response has been received. Respective booking has been updated!`);
                    e.target.parentElement.previousElementSibling.innerText = `${username} - ${email}`;
                })
                .catch((err) => {
                    console.error(err);
                    alert(`Sorry! Changes requested could not be made. Please try again.`);
                });
        }
    }
}

function cancelAppointment(e) {
    e.preventDefault();
    
    //when user wanted to make a "change" but thought not to and clicks "back"
    if(e.target.innerText == "back") {
        let changeInputs = e.target.parentElement.nextElementSibling;
        let backButton = e.target;
        let updateButton = e.target.previousElementSibling;

        hideInputs(changeInputs, updateButton, backButton); //hiding the inputs from the Front-End
    }
    //when user clicks "cancel"
    else {
        let value = e.target.parentElement.id;
        let singleEntityURL = URL_endpoint + value;

        //DELETE request
        axios
            .delete(singleEntityURL)
            .then((res) => {
                console.log(res);
                alert(`Your response has been received. Respective booking has been deleted!`);
                e.target.parentElement.parentElement.remove(); //removing element from Front-End!
                localStorage.removeItem(`key_${value}`); //removing [key : value] from local storage as well
            })
            .catch(err => console.error(err));
    }
}

function hideInputs(changeInputs, updateButton, backButton) {
    //hiding
    changeInputs.style.display = 'none'; //made in-visible in the Front-End to the user
    updateButton.innerText = "change"; //changing "update" into "change" (reset!)
    backButton.innerText = "cancel"; //changing "back" into "cancel" (reset!)
    revealInputFlag = 0; //reset
}
