$(document).ready(function() {
  console.log('js linked');
  //display tasks currently in db on DOM on page load
  getTasks();
  // function to send new task inputted by user to db and display on DOM
  $('#newTaskButton').on('click', function () {
      // display user-input on DOM immediately after click
      $('.output').append('<p class="singleTask"><input id="checkbox" type="checkbox">' + '  ' + '<button id="delete" type="button">Delete</button> ' + $('#newTask').val() + '</p>');
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
        // clear input after button click
        document.getElementById('newTask').value= '';
      } // end success
    }); // end ajax
  }); // end on click

  // function to retrieve tasks from db, delete tasks from db, update status in db
  function getTasks(){
    $.ajax({
      type: 'GET',
      url: '/taskList',
      success: function(response) {
        console.log(response);
        console.log('array of tasks arrived at client');
        // dynamically add checkboxes and deletes to task items as they are added by user
        for (var i = 0; i < response.length; i++) {
          $('.output').append('<p class="singleTask"> <input id="checkbox" type="checkbox">' + ' ' + '<button class="delete" id="' + response[i].task + '" type="button">Delete</button>' + ' ' + response[i].task + '</p>');
        } // end for loop

      // function to delete task from DOM and db on delete click
      $('.output').on('click', '.delete', function() {
        $(this).parent().remove();
        var item = $(this).attr('id');
          // object to send
          var taskToDelete = {
            delete: item
          }; // end object
          console.log(taskToDelete);
          // request to send task to server to be deleted from db
          $.ajax({
            type: 'POST',
            url: '/deleteTask',
            data: taskToDelete,
            success: function(response) {
              console.log('task to be deleted sent to server');
            } // end success
           }); // end ajax
       }); // end deleteTask()

       // function to change status of task in db based on status of checkbox
       $('.output').on('click', '#checkbox', function() {
         if(document.getElementById('checkbox').checked) {
           var update = $(this).siblings().attr('id');
           console.log(update);
             // object to send
             var updateStatus = {
               status: update
             }; // end object
             console.log(updateStatus);
             $.ajax({
               type: 'POST',
               url: '/changeStatus',
               data: updateStatus,
               success: function(response) {
                 console.log('server received task status to update: ' + response);
               } //end success
             }); //end ajax
         } //end if
       }); //end click

      } // end success
    }); // end ajax
  } // end getTasks()


}); // end onReady

//---------------------------------------------------------
// Here are the specific components for the challenge:
//
// Create a front end experience (e.g. a form) that allows a user to create a Task.
// When the Task is created, it should be stored inside of a database.
// Whenever a Task is created, the front end should refresh to show all tasks that need to be completed.
// Each Task should have an option to "Complete" or "Delete".
// When a Task is complete, its visual representation should change on the front end. For example, the background of the task container could change from gray to green. The complete option should be checked off. Each of these are accomplished in CSS, but will need to hook into logic to know whether or not the task is complete.
// Whether or not a Task is complete should also be stored in the database.
// Deleting a Task should remove it both from the front end as well as the database.
