$(init);

function init(){
console.log("authentications script loaded");
  // set up event handlers
  // call checkLoginState
  $('form').on('submit', submitForm);
  $('.users-link').on('click',getUsers);
  $('.logout-link').on('click', logout);
  $('.register-link').on('click', showRegister);
  $('.login-link').on('click', logout);
  checkLoginState();
}

function checkLoginState(){
  // check for a token
  // if there is one, call loggedInState
  // otherwise, call loggedOutState

  if (getToken()){ loggedInState();
  } else {
    loggedOutState();
  }
}

function showRegister(){
  // hide login form
  // show register form
  $("section").hide()
  $("#register").show()
}

function showPage() {
  // hide all sections
  // hide errors
  // show the relevant section
  $('section').hide();
  hideErrors();
  window.location = "/manager/views"
  //getUsers();
}

function submitForm(){
console.log("submitting form")
  // get the data from the forms and make an ajaxRequest
  // call authenticationSuccessful
  event.preventDefault();
  var form = this;

  var method = $(this).attr('method');
  var url = "https://live-guard.co.uk/manager/api" + $(this).attr('action');
  var data = $(this).serialize(); // 

  form.reset();
  ajaxRequest(method, url, data, authenticationSuccessful);
}

function logout(){
  // remove the token
  // call loggedOutState
  removeToken();
  loggedOutState();
}

function getUsers(){
  // get the user data from the API and call displayUsers
  event.preventDefault();
   ajaxRequest('GET', 'https://live-guard.co.uk/manager/api/users', null, function(data){
    console.log(data);
    displayUsers(data);
  });
}

function displayUsers(data){
  // take the user data and display all the users as <li>s in the <ul>, eg:
  // <li class="list-group-item">mickyginger (mike.hayden@ga.co)</li>
 $(data.users).each(function( index, user) {
   $('.list-group').append("<li>" + user.email + " : " + user.username + "</li>");
 });
}

function hideUsers(){
  // remove all the users from the ul
 $('.list-group').empty()
}

function displayErrors(err){
  // display the errors from the AJAX request on the page, inside the alert
  // <div class="hide alert alert-danger" role="alert"></div>
  $(".alert-danger").html("<h3>"+ err +"</h3>");
  $(".alert").removeClass( "hidden");
}

function hideErrors(){
  // remove the errors from the alert and hide it
  $(".alert").addClass( "hidden");
}

function loggedInState(){
  // hide the login / register forms and links
  // show the users section and link
  // display the users
  $('section').hide();
  $('#Loggedin').show();
  $('.logged-out').hide();

}

function loggedOutState(){
  // show the login / register links, and the login form
  // hide the users section and links
  $('section').hide();
  $('.logged-in').hide();
  $('.logged-out').show();
  $('#login').show();
}

function authenticationSuccessful(data) {
  // set the token and call checkLoginState
  console.log(data)
  if(data.token){
  	setToken(data.token)
  	window.location = "/manager/views"
  }
}

function setToken(token) {
  // set the token into localStorage
  return localStorage.setItem('token', token);
}

function getToken() {
  // get the token from localStorage
  return localStorage.getItem('token');
}

function removeToken() {
  // remove the token from localStorage
  localStorage.clear();
}

function ajaxRequest(method, url, data, callback) {
console.log("arrived at ajax request function");
console.log(method, url, data)
  // create a re-useable ajaxRequest function
  return $.ajax({
    method: method,
    url: url,
    data: data,
    beforeSend: function(jqXHR, settings){
      var token = getToken();
       if(token) return jqXHR.setRequestHeader('Authorization', 'Bearer ' + token);
     },
     success:function(data) {
         return data; 
     }
    }).done(callback)
   .fail(function(err){
    console.log(err);
   displayErrors(err);
  });
}