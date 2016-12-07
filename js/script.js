$(document).ready(function(){

	// Initialize Firebase
	var config = {
	    apiKey: "AIzaSyAnuHxFnFRPN9ps5Nu7CNORlToxDQgZyoc",
		authDomain: "wk11-8c911.firebaseapp.com",
		databaseURL: "https://wk11-8c911.firebaseio.com",
		storageBucket: "wk11-8c911.appspot.com",
		messagingSenderId: "345033888284"
	};
	firebase.initializeApp(config);

	  var dbChatRoom = firebase.database().ref().child('chatroom');
	  var dbUser = firebase.database().ref().child('user');

	  var photoURL;
	  var $img = $('img');

	  // REGISTER DOM ELEMENTS
	  const $email = $('#email');
	  const $password = $('#password');
	  const $btnSignIn = $('#btnSignIn');
	  const $btnSignUp = $('#btnSignUp');
	  const $btnSignOut = $('#btnSignOut');
	  const $hovershadow = $('.hover-shadow');
	  const $btnSubmit = $('#btnSubmit');
	  const $signInfo = $('#sign-info');
	  const $file = $('#file');
	  const $profileName = $('#profile-name');
	  const $profileEmail = $('#profile-email');
	  const $profileOccupation = $('#profile-Occupation');
	  const $profileAge = $('#profile-Age');
	  const $profileDescriptions = $('#profile-Descriptions');

	  // Hovershadow
	  $hovershadow.hover(
	    function(){
	      $(this).addClass("mdl-shadow--4dp");
	    },
	    function(){
	      $(this).removeClass("mdl-shadow--4dp");
	    }
	  );

	  var storageRef = firebase.storage().ref();

	  function handleFileSelect(evt) {
	    evt.stopPropagation();
	    evt.preventDefault();
	    var file = evt.target.files[0];

	    var metadata = {
	      'contentType': file.type
	    };

	    // Push to child path.
	    // [START oncomplete]
	    storageRef.child('images/' + file.name).put(file, metadata).then(function(snapshot) {
	      console.log('Uploaded', snapshot.totalBytes, 'bytes.');
	      console.log(snapshot.metadata);
	      photoURL = snapshot.metadata.downloadURLs[0];
	      console.log('File available at', photoURL);
	    }).catch(function(error) {
	      // [START onfailure]
	      console.error('Upload failed:', error);
	      // [END onfailure]
	    });
	    // [END oncomplete]
	  }

	  window.onload = function() {
	    $file.change(handleFileSelect);
	    // $file.disabled = false;
	  }

	  // SignIn/SignUp/SignOut Button status
	  var user = firebase.auth().currentUser;
	  if (user) {
	    $btnSignIn.attr('disabled', 'disabled');
	    $btnSignUp.attr('disabled', 'disabled');
	    $btnSignOut.removeAttr('disabled')
	  } else {
	    $btnSignOut.attr('disabled', 'disabled');
	    $btnSignIn.removeAttr('disabled')
	    $btnSignUp.removeAttr('disabled')
	  }

	  // Sign In
	  $btnSignIn.click(function(e){
	    const email = $email.val();
	    const pass = $password.val();
	    const auth = firebase.auth();
	    // signIn
	    const promise = auth.signInWithEmailAndPassword(email, pass);
	    promise.catch(function(e){
	      console.log(e.message);
	      $signInfo.html(e.message);
	    });
	    promise.then(function(){
	      console.log('SignIn User');
	    });
	  });

	  // SignUp
	  $btnSignUp.click(function(e){
	    const email = $email.val();
	    const pass = $password.val();
	    const auth = firebase.auth();
	    // signUp
	    const promise = auth.createUserWithEmailAndPassword(email, pass);
	    promise.catch(function(e){
	      console.log(e.message);
	      $signInfo.html(e.message);
	    });
	    promise.then(function(user){
	      console.log("SignUp user is "+user.email);
	      const dbUserid = dbUser.child(user.uid);
	      dbUserid.push({email:user.email});
	    });
	  });

	  // Listening Login User
	  firebase.auth().onAuthStateChanged(function(user){
	    if(user) {
	      console.log(user);
	      const loginName = user.displayName || user.email;
	      $signInfo.html(loginName+" is login...");
	      $btnSignIn.attr('disabled', 'disabled');
	      $btnSignUp.attr('disabled', 'disabled');
	      $btnSignOut.removeAttr('disabled')
	      $profileName.html(user.displayName);
	      //$profileEmail.html(user.email);
	      $img.attr("src",user.photoURL);
	    } else {
	      console.log("not logged in");
	      $profileName.html("N/A");
	      $profileEmail.html('N/A');
	      $img.attr("src","");
	    }
	  });

	  // SignOut
	  $btnSignOut.click(function(){
	    firebase.auth().signOut();
	    console.log('LogOut');
	    $signInfo.html('No one login...');
	    $btnSignOut.attr('disabled', 'disabled');
	    $btnSignIn.removeAttr('disabled')
	    $btnSignUp.removeAttr('disabled')
	  });

	  // Submit
	  $btnSubmit.click(function(){
	    var user = firebase.auth().currentUser;
	    const $userName = $('#userName').val();

	    //get value
	    const dbUserid = dbUser.child(user.uid);
	    var Occupation = $('#Occupation').val();
	    var Age = $('#Age').val();
	    var Descriptions = $('#Descriptions').val();
 	    
 	    dbUserid.set({dOccu: Occupation,dAge: Age,dDes: Descriptions})
 	    var $Occupation  = dbUserid.child('dOccu');
 	    var $Age = dbUserid.child('dAge'); 
 	    var $Descriptions = dbUserid.child('dDes');

 	    //show 
 	    $Occupation.on('value',function(snap){
 	    	$profileOccupation.html(snap.val());
 	    });
		$Age.on('value',function(snap){
 	    	$profileAge.html(snap.val());
 	    });
 	    $Descriptions.on('value',function(snap){
 	    	$profileDescriptions.html(snap.val());
 	    });

 	    console.log("clickSubmit");
	    const promise = user.updateProfile({
	      displayName: $userName,
	      photoURL: photoURL,
	    });
	    promise.then(function() {
	      console.log("Update successful.");
	      user = firebase.auth().currentUser;
	      if (user) {
	      	$profileName.html(user.displayName);
	        //$profileEmail.html(user.email);
	        $img.attr("src",user.photoURL);
	        const loginName = user.displayName || user.email;
	        $signInfo.html(loginName+" is login...");
	      }
	    });
	  });

	});