const subBtn = document.querySelector('.sub-btn');
var form = document.querySelector('#subscribeForm');
var name;
var email;
var loc;
var ERRORS = [0,0,0,0];

function init(){
    ERRORS = [0,0,0,0];
    form['name'].classList.remove('faulty-field');
    form['email'].classList.remove('faulty-field');
    form['location'].classList.remove('faulty-field');
    document.querySelector('#sub-log-div').classList.add('collapse');
    document.querySelector('#sub-log').classList.remove('text-success');
    document.querySelector('#sub-log').classList.remove('text-danger');
    document.querySelector('.spinner-border').classList.add('collapse');
    subBtn.classList.remove('bg-success');
}

subBtn.addEventListener('click', (e) => {
    init();
    e.preventDefault();
    document.querySelector('.spinner-border').classList.remove('collapse');
    
    if(formIsValid()){
        var data = {
            Name: name,
            Email: email,
            Location: loc
        }
        
        fetch("http://api.mykashback.co.uk/general/subscribe", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        }).then( response => {
            //console.log(response);
            success();
        }).catch(err => {
            //console.log(err);
            failed(err);
        });
    }
    else{
        //console.log("Form Invalid");
        failed();
    }

    
});

function formIsValid(){
    name = form['name'].value;
    email = form['email'].value;
    loc = form['location'].value;

    /*console.log('Name: '+ name);
    console.log('Email: '+ email);
    console.log('location: '+ loc);*/

    if(name === ''){
       // console.log("Form can't be empty");
        ERRORS[0] = 1;
        return 0;
    }
    else if(email === ''){
        //console.log("Form can't be empty")
        ERRORS[1] = 1;
        return 0;
    }
    else if(loc === ''){
        //console.log("Form can't be empty")
        ERRORS[2] = 1;
        return 0;
    }


    email_re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if(!email_re.test(email)){
        //console.log("Email Invalid");
        ERRORS[3] = 1;
        return 0;
    }

    return 1;
}

function success(){
    document.querySelector('.spinner-border').classList.add('collapse');
    document.querySelector('#sub-log').textContent = "Subscribtion Successful!";
    document.querySelector('#sub-log').classList.add('text-success');
    document.querySelector('#sub-log-div').classList.remove('collapse');
    subBtn.classList.add('bg-success');
}
function failed(err=null){
    document.querySelector('.spinner-border').classList.add('collapse');
    const logBox = document.querySelector('#sub-log');
    var messages = {
        empty_field_name: "Please Enter Your Name",
        empty_field_email: "Please Enter Your Email",
        empty_field_location: "PLease Enter your Location",
        email_invalid: "Your Email is Invalid",
        unknown: (err == "TypeError: Failed to fetch") ? "Unable to Connect" : "Subscription Unsuccessful :-( "+"Error: "+err
    }
    
    if(document.querySelector('#sub-log-div').classList.contains('collapse')){
        document.querySelector('#sub-log-div').classList.remove('collapse');
    }
    document.querySelector('#sub-log').classList.add('text-danger');

    if(ERRORS[0]){
        logBox.textContent = messages['empty_field_name'];
        form['name'].classList.add('faulty-field');
    }
    else if(ERRORS[1]){
        logBox.textContent = messages['empty_field_email'];
        form['email'].classList.add('faulty-field');
    }
    else if(ERRORS[2]){
        logBox.textContent = messages['empty_field_location'];
        form['location'].classList.add('faulty-field');
    }
    else if(ERRORS[3]){
        logBox.textContent = messages['email_invalid'];
        form['email'].classList.add('faulty-field');
    }
    else{
        logBox.textContent = messages['unknown'];
    }
    
}