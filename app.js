

const app = document.getElementById("app");

const textfield = getTextField();
const button = getButton();

var taskIdCounter = 999;

const taskContainer = createElement('div');
taskContainer.style.width = '300px';
taskContainer.style.height = '200px';
taskContainer.style.marginTop = '10px';
taskContainer.style.backgroundColor = 'lightcoral';
taskContainer.style.display = 'flex';
taskContainer.style.flexDirection = 'column';
taskContainer.style.overflow='auto';


app.append(textfield);
app.append(button);
app.append(taskContainer);

init();


function init() {
   const tasks = getTasks() || [];

   tasks.forEach(task => {
      createTask(task, true);
   });

   if(tasks?.length) {
      taskIdCounter = tasks.at(0).id + 1;
   }
}

function handleDelete(e) {
   const elem = document.getElementById(e.target.id);
   elem.parentElement.remove();

   deleteFromStore(e.target.id);
}

function handleTaskClick(event) {
   const id = event.target.id;

   const elem = document.getElementById(id);
   elem.contentEditable = true;

   elem.addEventListener("keypress", handleEdit);
}

function handleEdit(e) {
   if(e.key === 'Enter') {
      e.preventDefault();
      console.log('here');
      const elem = document.getElementById(e.target.id);
      const updatedTask = elem.innerText;
      updateTask(e.target.id, updatedTask);
      elem.contentEditable = false;
   }
}


function handleKeyPress(e) {
   if(e.key === 'Enter') {
      handleAddTodo();
   }
}


function handleAddTodo() {
   const input = document.getElementsByTagName("input")[0];
 
   const value = input.value;

   if(!value) {
      alert("Please enter a task!!");
      return;
   }
   const task = {task:value, id: taskIdCounter++};
   createTask(task);
   saveTask(task);
   input.value = '';

}

function createTask(taskObj, needToAppend) {
   const {task, id} = taskObj;
   const taskRow = createElement('div');
   const taskElement = createElement("span");

   const deleteBtn = createElement('button');
   deleteBtn.setAttribute("id", id);
   deleteBtn.addEventListener("click", handleDelete);
   deleteBtn.innerText = 'Delete Task';

   taskElement.innerText = task;
   taskElement.setAttribute("id", id);
   taskElement.addEventListener('click', handleTaskClick);

   taskRow.append(taskElement)
   taskRow.append(deleteBtn)


   if(needToAppend) {
      taskContainer.append(taskRow);
   } else {
      taskContainer.prepend(taskRow);
   }
  
}


function getTextField() {
   const textfield = createElement("input");
   textfield.placeholder = 'Enter you task';
    textfield.addEventListener("keypress",handleKeyPress );

   return textfield;
}




function getButton() {
   const button = createElement("button");
   button.innerText = "Add Todo";

   button.style.marginLeft = '6px';
  
   button.addEventListener('click',handleAddTodo);

   return button;
}

function createElement(type) {
   return  document.createElement(type);
}

function saveTask(task) {
  let previousTasks = getTasks();


  previousTasks = [task, ...previousTasks];

  // only work when task is strings
//   window.localStorage.setItem('tasks',previousTasks.join(','));


window.localStorage.setItem('tasks',JSON.stringify(previousTasks));


}

function getTasks() {
   const strTasks = window.localStorage.getItem('tasks');

   const parsedArray = JSON.parse(strTasks || '[]');
  
  
     // only work when task is strings
   // if(!strTasks) {
   //    return [];
   // }
   // return strTasks.split(',');

   return parsedArray;

}

function updateTask(id, newTask) {
   let tasks = getTasks();

   tasks = tasks.map(function(task) {
      console.log(task.id, id);
      if(task.id == id) {
         task.task =newTask;
      }

      return task;
   });

   window.localStorage.setItem('tasks',JSON.stringify(tasks));

}

function deleteFromStore(id) {
   let tasks = getTasks();

   tasks = tasks.filter((task) => task.id != id);

   window.localStorage.setItem('tasks',JSON.stringify(tasks));
}