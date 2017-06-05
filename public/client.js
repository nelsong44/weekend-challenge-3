$(document).ready(function() {
  console.log('js linked');
  //display tasks currently in db on DOM on page load
  // getTasks();

  // function to send new task inputted by user to db and display on DOM
  $('#newTaskButton').on('click', function () {
    var newTaskObject = {
      task: $('#newTask').val()
    }; // end object
    console.log('new task: ' + $('#newTask').val());
    // request to send new task to server to store in db
    $.ajax({
      type: 'POST',
      url: '/task',
      data: newTaskObject,
      success: function(response) {
        console.log('new task received by server: ' + response);
        // clear input after button click
        document.getElementById('newTask').value= '';
        getTasks();
      } // end success
    }); // end ajax
  }); // end on click

  // function to retrieve tasks from db, delete tasks from db, update status in db
  function getTasks(){
    $.ajax({
      type: 'GET',
      url: '/task',
      success: function(response) {
        console.log(response);
        console.log('array of tasks arrived at client');
        // dynamically add checkboxes and deletes to task items as they are added by user
        for (var i = 0; i < response.length; i++) {
          $('.output').append('<p class="singleTask"> <input id="checkbox" data-id="' + response[i].id + '" type="checkbox">' + ' ' + '<button class="delete" id="' + response[i].id + '" type="button">Delete</button>' + ' ' + response[i].task + '</p>');
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
            type: 'DELETE',
            url: '/task',
            data: taskToDelete,
            success: function(response) {
              console.log('task to be deleted sent to server');
            } // end success
           }); // end ajax
       }); // end deleteTask()

       // function to change status of task in db based on status of checkbox
       $('.output').on('click', '#checkbox', function() {
         $(this).parent().toggleClass('statusColorChange');
           var update = $(this).data('id');
           console.log(update);
             // object to send
             var updateStatus = {
               status: update,
               complete: $(this)[0].checked
             }; // end object
             console.log(updateStatus);
             $.ajax({
               type: 'PUT',
               url: '/task',
               data: updateStatus,
               success: function(response) {
                 console.log('server received task status to update: ' + response);
               } //end success
             }); //end ajax

       }); //end click
      } // end success
    }); // end ajax
  } // end getTasks()
}); // end onReady
