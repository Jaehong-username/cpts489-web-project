function validateEmail() {//document part of web api
    const email = document.getElementById("email").value; //instead og grabbing the element node we get an attribute
    var email_valid = false;
    const valid_first = email.includes("@"); //return boolean
    
    if (valid_first) email_valid = true;
    
    if (!email_valid) {
        alert("Email is bad. Fix it!\n");
    }
    
    
    const password = document.getElementById("password").value;
    var password_valid = false;
    const valid_second = password.Length > 10; //return boolean
    if (valid_second) password_valid = true;
    if (!password_valid) {
        alert("Password should be longer than 10 characters. Fix it!\n");
    }
    
    return (email_valid && password_valid); 
}

//Invoked when a sign up link is clicked
function showRegisterForm() {
    document.getElementById("login").style.display = "none";
    document.getElementById("register").style.display = "block";
}

//Invoked when a Sign in link is clicked
function showLoginForm() {
    document.getElementById("login").style.display = "block";
    document.getElementById("register").style.display = "none";
}