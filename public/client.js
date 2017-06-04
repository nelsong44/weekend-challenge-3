$(document).ready(function() {
  console.log('js linked');
  //display tasks currently in db on DOM on page load
  getTasks();
  // call createNewTask on click
  $('#newTaskButton').on('click', createNewTask);

// function to send new task inputted by user to db
function createNewTask() {
  //task object
  var newTaskObject = {
    task: $('#newTask').val()
  }; // end object
  console.log('new task: ' + $('#newTask').val());
// request to send new task to server to store in db
  $.ajax({
    type: 'POST',
    url: '/newTask',
    data: newTaskObject,
    success: function(response) {
      console.log('new task received by server: ' + response);
    } // end success
  }); // end ajax
} // end createNewTask()

// function to retrieve tasks from db
function getTasks(){
  $.ajax({
    type: 'GET',
    url: '/taskList',
    success: function(response) {
      console.log(response);
      console.log('array of tasks arrived at client');
      // dynamically add checkboxes and deletes to task items as they are added
      for (var i = 0; i < response.length; i++) {
        $('.output').append('<p id="singleItem"> <input id="checkbox" type="checkbox">' + " " + response[i].task + " " +
        '<button id="delete" type="button">Delete</button></p>');
      } // end for loop
      // delete specific task item and remove from db on delete click
      $('.output').on('click', '#delete', function() {
        $('#singleItem').remove();
      }); // end delete click
    } // end success
  }); // end ajax
} // end getTasks()

}); // end onReady


// use this?
















// Here are the specific components for the challenge:
//
// Create a front end experience (e.g. a form) that allows a user to create a Task.
// When the Task is created, it should be stored inside of a database.
// Whenever a Task is created, the front end should refresh to show all tasks that need to be completed.
// Each Task should have an option to "Complete" or "Delete".
// When a Task is complete, its visual representation should change on the front end. For example, the background of the task container could change from gray to green. The complete option should be checked off. Each of these are accomplished in CSS, but will need to hook into logic to know whether or not the task is complete.
// Whether or not a Task is complete should also be stored in the database.
// Deleting a Task should remove it both from the front end as well as the database.
