const newTodoForm = document.querySelector(".create-todo");
const userInput = document.querySelector(".new-todo-text");
const todoList = document.querySelector(".todo-list");
const dropdown = document.querySelector("#priority");
const radioButtons = Array.from(
  document.querySelectorAll('input[name="sorting"]')
);

let todosArray = JSON.parse(localStorage.getItem("todosArray")) || [];

const saveLocalStorage = () => {
  localStorage.setItem("todosArray", JSON.stringify(todosArray));
};

const renderTodos = () => {
  todoList.innerHTML = "";

  todosArray.forEach((todo) => {
    let childToAppend = document.createElement("li");
    let priorityDiv = document.createElement("div");
    let todoInput = document.createElement("input");
    let completedBtn = document.createElement("button");
    let deleteBtn = document.createElement("button");

    childToAppend.setAttribute("class", "todo-item");
    priorityDiv.setAttribute("class", "priority-div");
    todoInput.setAttribute("class", "todo-text");
    completedBtn.setAttribute("class", "todo-completed");
    deleteBtn.setAttribute("class", "delete-todo btn");

    let priority = todo.priority;
    switch (priority) {
      case "1":
        priorityDiv.style = "background-color: red";
        break;
      case "2":
        priorityDiv.style = "background-color: orange";
        break;
      case "3":
        priorityDiv.style = "background-color: green";
        break;
    }

    priorityDiv.innerText = "!";
    todoInput.value = todo.description;
    completedBtn.innerText = "Done";
    deleteBtn.innerText = "Delete";

    completedBtn.addEventListener("click", completeTodo);
    deleteBtn.addEventListener("click", deleteTodo);

    childToAppend.append(priorityDiv);
    childToAppend.append(todoInput);
    childToAppend.append(completedBtn);
    childToAppend.append(deleteBtn);

    childToAppend.id = todo.id;

    if (todo.done) {
      todoInput.classList.toggle("crossed");
      completedBtn.innerText = "Undo";
    }

    todoList.appendChild(childToAppend);
  });
};

renderTodos();

const addTodo = () => {
  if (userInput.value === "") {
    userInput.style = "border: 2px solid red";
    alert("Insert a To-Do!");
  } else {
    let todo = {
      description: userInput.value,
      priority: dropdown.value,
      done: false,
      creation: Date.now(),
      id: Date.now().toString(),
    };

    todosArray.push(todo);

    userInput.style = "revert";
    userInput.value = "";

    saveLocalStorage();
    renderTodos();
  }
};

function completeTodo(e) {
  let parentElement = e.target.parentElement;
  let idOfParentElement = parentElement.id;

  todosArray.map((todo) => {
    if (todo.id === idOfParentElement) todo.done = !todo.done;
  });

  saveLocalStorage();
  renderTodos();
}

function deleteTodo(e) {
  let elementToDelete = e.target.parentElement;
  let idOfElementToDelete = elementToDelete.id;

  todosArray.filter((todo, index) => {
    if (todo.id === idOfElementToDelete) todosArray.splice(index, 1);
  });

  saveLocalStorage();
  renderTodos();
}

const sortTodos = (btn) => {
  let sortingChoice = btn.value;

  switch (sortingChoice) {
    case "date":
      todosArray.sort((a, b) => b.creation - a.creation);
      break;
    case "need":
      todosArray.sort((a, b) => a.priority - b.priority);
      break;
    case "completed":
      todosArray.sort((a, b) => a.done - b.done);
      break;
  }

  saveLocalStorage();
  renderTodos();
};

newTodoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addTodo();
});

radioButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    sortTodos(btn);
  });
});
