(function () {
  const form = document.querySelector("[data-form]");
  const list = document.querySelector("[data-todo-list]");
  const baseUrl = "http://localhost:3000";

  form.addEventListener("submit", handleAddTodo);
  list.addEventListener("click", handleDeleteTodo);

  async function handleAddTodo(e) {
    e.preventDefault();
    const title = getTitleFromForm();
    const todo = await saveTodoItem(title);

    const listItem = buildHtmlItem(todo);
    renderHtml(listItem);
  }

  async function handleDeleteTodo(e) {
    const todoId = e.target.dataset.deleteTodo;
    if (!todoId) {
      return;
    }

    await fetch(`${baseUrl}/todos/${todoId}`, {
      method: "DELETE",
    }).then((res) => res.json());

    e.target.parentNode.remove();
  }

  function getTitleFromForm() {
    return form.children.title.value;
  }

  function buildHtmlItem(todo) {
    const item = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.dataset.completed = todo.id;
    checkbox.addEventListener("change", handleCheckTodo);
    item.appendChild(checkbox);
    checkbox.checked = todo.completed;

    const title1 = document.createElement("label");
    title1.textContent = todo.title1;
    title1.setAttribute("for", checkbox.dataset.completed);
    item.appendChild(title1);

    const title = document.createElement("span");
    title.textContent = todo.title;
    item.appendChild(title);

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "&times;";
    deleteBtn.dataset.deleteTodo = todo.id;
    deleteBtn.classList.add("btn", "btn-delete");
    deleteBtn.addEventListener("click", handleDeleteTodo);
    item.appendChild(deleteBtn);

    return item;
  }
  async function handleCheckTodo(e) {
    const todoId = e.target.dataset.completed;
    const isCompleted = e.target.checked;
  
    const updatedTodo = await updateTodoItem(todoId, {
      completed: isCompleted,
    });
  
    e.target.checked = updatedTodo.completed;
  }
  
  function updateTodoItem(todoId, data) {
    return fetch(`${baseUrl}/todos/${todoId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json",
      },
    }).then((res) => res.json());
  }
  function saveTodoItem(title1, completed = false) {
    return fetch(`${baseUrl}/todos`, {
      method: "POST",
      body: JSON.stringify({
        title,
        completed,
        userId: 1,
      }),
      headers: {
        "Content-type": "application/json",
      },
    }).then((res) => res.json());
  }

  function renderHtml(item) {
    list.append(item);
  }

  function saveTodoItem(title) {
    return fetch(`${baseUrl}/todos`, {
      method: "POST",
      body: JSON.stringify({
        title,
        completed: false,
        userId: 1,
      }),
      headers: {
        "Content-type": "application/json",
      },
    }).then((res) => res.json());
  }

  (async function init() {
    const todos = await getDataFromServer();
    displayTodoList(todos);
  })();

  function getDataFromServer() {
    return fetch(`${baseUrl}/todos`).then((res) => res.json());
  }

  function displayTodoList(todos) {
    const fragment = document.createDocumentFragment();
    for (const todo of todos) {
      const item = buildHtmlItem(todo);
      fragment.append(item);
    }
    renderHtml(fragment);
    
  }
})();
