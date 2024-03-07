// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    var id = nextId;
    nextId++;
    localStorage.setItem("nextId", JSON.stringify(nextId));
    return id;
}

// Todo: create a function to create a task card
function createTaskCard(task) {

    var formattedDueDate = dayjs(task.dueDate).format("MM/DD/YYYY");
    var backgroundColor = getColor(task.dueDate);
    var cardHTML = `
    <div class="task-card" data-task-id="${task.id}" style="background-color: ${backgroundColor};">
        <div class="card-header">${task.name}</div>
        <div class="card-content">
            <p><strong> ${task.description}</strong></p>
            <p><strong> ${formattedDueDate}</strong></p>
  
        </div>
        <button class="btn btn-danger delete-task">Delete</button>
      </div>`;
  
    var lane = $("#" + task.status);
    console.log(lane);
    lane.append(cardHTML);
  
     var card = $(".task-card[data-task-id='" + task.id + "']");
     card.find(".card-header").css("background-color", backgroundColor);
     if (task.status === 'done') {
      card.css("background-color", "white");
      card.find(".card-header").css("background-color", "white");
    }
  }

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    $(".lane ").empty();
  
    taskList.forEach((task) => createTaskCard(task));
    taskList.map((task) => {
      console.log(task);
    });

    $(".task-card").draggable({
      revert: "invalid",
      cursor: "grab",
      start: function (event, ui) {
        $(this).css("z-index", 1000); 
      },
      stop: function (event, ui) {
        $(this).css("z-index", ""); 
      },
    });
  }

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();
  
    var taskName = $("#taskName").val().trim();
    var dueDate = $("#dueDate").val();
    var description = $("#description").val().trim();
    var color = getColor(dueDate);
    var task = {
      id: generateTaskId(),
      name: taskName,
      dueDate: dueDate,
      description: description,
      status: "to-do",
      color: color
  
    };
  
    taskList.push(task);
    localStorage.setItem("tasks", JSON.stringify(taskList));
  
    renderTaskList();
  
    $("#formModal").modal("hide");
    $("#taskName").val("");
    $("#dueDate").val("");
    $("#description").val("");
  }

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    var taskId = $(this).closest(".task-card").data("task-id");
  
    taskList = taskList.filter((task) => task.id !== taskId);
  
    localStorage.setItem("tasks", JSON.stringify(taskList));
   
    renderTaskList();
    window.location.reload();
  }

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    var taskId = ui.draggable.data("task-id");
    var newStatus = $(this).attr("id");
    var taskIndex = taskList.findIndex((task) => task.id == taskId);
    if (taskIndex !== -1) {
      taskList[taskIndex].status = newStatus;
  
      ui.draggable.detach().css({ top: 0, left: 0 }).appendTo(this);
  
      if (newStatus === "done") {
        ui.draggable.css("background-color", "white"); 
        ui.draggable.find(".card-header").css("background-color", "white");
  
      } else {
        ui.draggable.css(
          "background-color",
          getColor(taskList[taskIndex].dueDate)
        );
  
        ui.draggable.find(".card-header").css(
          "background-color",
          getColor(taskList[taskIndex].dueDate)
        );
      }
      
      localStorage.setItem("tasks", JSON.stringify(taskList));
    } else {
      console.error("Task has not been found");
    }
  }
  
  // Todo: function to get color based on due date
  function getColor(dueDate) {
    var now = dayjs();
    var deadline = dayjs(dueDate);
    var daysUntilDeadline = deadline.diff(now, "day");
  
    if (daysUntilDeadline < 0) {
      return "red";
    } else if (daysUntilDeadline <= 7) {
      return "yellow";
    } else {
      return "white";
    }
  }

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();
    console.log("Task has been rendered");
  
    $("#addTaskForm").submit(handleAddTask);
    $(document).on("click", ".delete-task", handleDeleteTask);
    $(".lane").droppable({
      accept: ".task-card",
      drop: handleDrop,
    });
  
  $("#dueDate").datepicker({
    dateFormat: "mm/dd/yy",
    changeMonth: true,
    changeYear: true,
  });
  
  
  });
  
  
