$(document).ready(function(){


var firebaseConfig = {
    apiKey: "AIzaSyDg5u56kIdSjp0cvsSVNompNWWRfqfrQhk",
    authDomain: "trainschedule-d6a00.firebaseapp.com",
    databaseURL: "https://trainschedule-d6a00.firebaseio.com",
    projectId: "trainschedule-d6a00",
    storageBucket: "",
    messagingSenderId: "79292149699",
    appId: "1:79292149699:web:2c0f81a41b4d0afabe9776",
    measurementId: "G-EGM6LPVS6C"
  };

  firebase.initializeApp(firebaseConfig);
  
  var database = firebase.database();

  let name;
  let destination;
  let firstTrain;
  let frequency = 0;

  $("#add-train").on("click", function() {
        event.preventDefault();
        
        name = $("#train-name").val().trim();
        destination = $("#destination").val().trim();
        firstTrain = $("#first-train").val().trim();
        frequency = $("#frequency").val().trim();

       
        database.ref().push({
            name: name,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        $("form")[0].reset();
    });

    database.ref().on("child_added", function(save) {
        
        
        let firstTrainNew = moment(save.val().firstTrain, "hh:mm").subtract(1, "years");
        let time = moment().diff(moment(firstTrainNew), "minutes");
        let remainder = time % save.val().frequency;
        let minAway = save.val().frequency - remainder;
        let nextTrain = moment().add(minAway, "minutes");
        nextTrain = moment(nextTrain).format("hh:mm:ss");

        $("#row").append("<tr><td>" + save.val().name +
                "</td><td>" + save.val().destination +
                "</td><td>" + save.val().frequency +
                "</td><td>" + nextTrain + 
                "</td><td>" + minAway + "</td></tr>");

            
        }, function(error) {
            console.log(error.code);
    });

    database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
        $("#name-display").html(snapshot.val().name);
        $("#email-display").html(snapshot.val().email);
        $("#age-display").html(snapshot.val().age);
        $("#comment-display").html(snapshot.val().comment);
    });
})