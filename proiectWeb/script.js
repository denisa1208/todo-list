document.addEventListener("DOMContentLoaded", () => {
    const newTodoInput = document.getElementById("new-todo"); // input field for new todo
    const todoList = document.getElementById("todo-list");  // the list element where todos will be displayed
    const taskCount = document.getElementById("task-count");    // remaining tasks
    const clearCompletedBtn = document.getElementById("clear-completed");
    const filterButtons = document.querySelectorAll(".filters button"); // all filters buttons (all, active, completed)

    // todos stored from localStorage
    let todos = JSON.parse(localStorage.getItem("todos")) || [];

    // actualizarea nr de sarcini si afisarea lor
    function updateTodos(filter = "all") {
        todoList.innerHTML = "";
        let filteredTodos = todos;

        // update pt numarul de taskuri ramase
        function updateTaskCount() {
            let items = 0;

            // Parcurgem fiecare sarcina din lista todos
            for (let i = 0; i < todos.length; i++) {
                if (!todos[i].completed) { // Daca sarcina nu este completata
                    items++; // Incrementam numarul de sarcini nefinalizate
                }
            }

            // Actualizam textul
            taskCount.textContent = `${items} items left`;
        }
    
        function saveTodos() {
            localStorage.setItem("todos", JSON.stringify(todos));
        }

        /*filtrarea taskurilor*/
        if (filter === "completed") {
            filteredTodos = todos.filter(todo => todo.completed);
        } else if (filter === "active") {
            filteredTodos = todos.filter(todo => !todo.completed);
        }

        filteredTodos.forEach((todo, index) => {
            
            const list_item = document.createElement("li");

            todoList.appendChild(list_item);    /*se ocupa de pastrarea vizuala a todo-ului in lista*/

            list_item.className = "todo-item";
            let checkboxChecked = "";
            if (todo.completed) {
                list_item.classList.add("completed");
                checkboxChecked = "checked";
            }

            let todo_text = todo.text;
            let delete_btn = "x";

            /*update la starea todo-ului cand este checked*/
            list_item.innerHTML = `
                <input type="checkbox" class="todo-checkbox" ${checkboxChecked} data-index="${index}">
                <span class="todo-text" data-index="${index}">${todo_text}</span>
                <button class="todo-delete" data-index="${index}">${delete_btn}</button>`
                list_item.className = "todo-item";
                if (todo.completed) {
                    list_item.className += " completed";
                }
            
        });

        updateTaskCount();
        saveTodos();
    }

   
    // adaugarea unei noi sarcini in lista
    newTodoInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && newTodoInput.value.trim()) {
            todos.push({ text: newTodoInput.value.trim(), completed: false });
            newTodoInput.value = "";
            updateTodos();  // actualizarea listei de sarcini si a numarului de sarcini
        }
    });

    // actiunile de checked, delete, edit task
    todoList.addEventListener("click", (e) => {
        const index = e.target.dataset.index;

        // elementul pe care s-a facut click
        if (e.target.classList.contains("todo-checkbox")) {
            todos[index].completed = e.target.checked;
        } else if (e.target.classList.contains("todo-delete")) {
            todos.splice(index, 1); // elimina todo-ul din lista pe baza indexului
        } else if (e.target.classList.contains("todo-text")) {
            const newText = prompt("Edit task:", todos[index].text);
            if (newText !== null) {
                todos[index].text = newText.trim(); // actualizarea textului
            }
        }

        updateTodos();
    });


    // functie caree sterge toate taskurile completed
    clearCompletedBtn.addEventListener("click", () => {
        todos = todos.filter(todo => !todo.completed);
        updateTodos();
    });


    // se schimba stilul butonului activ si se aplica filtru pe lista de todo-uri
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            document.querySelector(".filters button.active").classList.remove("active");
            button.classList.add("active");
            updateTodos(button.id.replace("filter-", ""));
        });
    });

    updateTodos();
});
