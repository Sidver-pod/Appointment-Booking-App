var newDiv; //for Cue to show up on the Front-End on an API call
var newA; //helps wrap newDiv with <a> to provide link

document.getElementById('submit').addEventListener('click', appointmentBooking);

function appointmentBooking(e){
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    let flag = 0;

    if(username == '' || email == ''){
        flag = 1; //not applicable
        alert(`Please fill in your valid credentials before clicking the 'Submit' button.`);
    }

    if(flag == 0){
        //emtying out the content after clicking 'Submit'
        document.getElementById('username').value = '';
        document.getElementById('email').value = '';

        if(document.getElementsByClassName('responses').length) {
            //runs when an API call had already been made prior to this new one (meaning: "Response Received" exists!)
            newDiv.innerText = 'Awaiting Response...'; //reset
            newA.removeAttribute('href'); //reset

            //changing colors on mouse hovers
            changeColorsOnMouseHover('tomato', 'black');
        } else {
            //first-time-only!
            newDiv = document.createElement('div');
            newDiv.className = 'responses';
            newDiv.innerText = 'Awaiting Response...'; //initialized
            newA = document.createElement('a');
            newA.style.textDecoration = 'none';
            newA.appendChild(newDiv);
            document.body.children[2].appendChild(newA);
        }

        //note: api calls are made to 'crud-crud' [expires in 24 hours] (use new 'endpoint' after expiry)
        axios
            .post('https://crudcrud.com/api/8b3a099c2d5b49248075f5efe849bb95/appointmentBooking', {
                username: username,
                email: email
            })
            .then((res) => {
                console.log(`Name: ${res.data.username}, Email: ${res.data.email}, ID: ${res.data._id}`);
                // let apiCallUsername = res.data.username;
                //let apiCallEmail = res.data.email;
                let apiCallId = res.data._id;

                //storing unique key in localStorage
                let localKey = "key_" + apiCallId; //key_61bb7ac197069d03e849246a, key_61bb7d9197069d03e849246e...
                localStorage.setItem(localKey, apiCallId);

                //adding a response Cue that shows up in the Front-End when the API call is successful!
                setTimeout(() => {
                    //changing colors on mouse hovers
                    changeColorsOnMouseHover('#18A558', 'black');

                    newA.href = "./responses.html";
                    newA.style.color = 'black';
                    newDiv.innerText = 'Response Received!'; //updated
                }, 1000);
            })
            .catch(err => console.error(err));
    }
}

function changeColorsOnMouseHover(colorIn, colorOut){
    //changing colors on mouse hovers
    newDiv.addEventListener('mouseover', (e) => {
        e.preventDefault();
        newDiv.style.color = colorIn;
        newDiv.style.border = `1px solid ${colorIn}`;
    });
    newDiv.addEventListener('mouseout', (e) => {
        e.preventDefault();
        newDiv.style.color = colorOut;
        newDiv.style.border = `1px solid ${colorOut}`;
    });
}
