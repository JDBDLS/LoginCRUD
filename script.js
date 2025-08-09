class TaskManager {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem("tasks")) || []
    this.editingTaskId = null
    this.initializeEventListeners()
    this.renderTasks()
  }

  initializeEventListeners() {
    document.getElementById("loginForm").addEventListener("submit", this.handleLogin.bind(this))
    document.getElementById("logoutBtn").addEventListener("click", this.handleLogout.bind(this))
    document.getElementById("addTaskBtn").addEventListener("click", this.addTask.bind(this))
    document.getElementById("updateTaskBtn").addEventListener("click", this.updateTask.bind(this))
    document.getElementById("cancelEditBtn").addEventListener("click", this.cancelEdit.bind(this))
    document.getElementById("taskInput").addEventListener("keypress", this.handleKeyPress.bind(this))
  }

  handleLogin(e) {
    e.preventDefault()
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value
    const errorMessage = document.getElementById("errorMessage")

    if (username === "usuario" && password === "contraseña") {
      document.getElementById("loginContainer").classList.add("hidden")
      document.getElementById("dashboard").classList.add("active")
      document.body.style.alignItems = "flex-start"
      errorMessage.textContent = ""
    } else {
      errorMessage.textContent = "Usuario o contraseña incorrectos"
    }
  }

  handleLogout() {
    document.getElementById("loginContainer").classList.remove("hidden")
    document.getElementById("dashboard").classList.remove("active")
    document.body.style.alignItems = "center"
    document.getElementById("username").value = ""
    document.getElementById("password").value = ""
    this.cancelEdit()
  }

  handleKeyPress(e) {
    if (e.key === "Enter") {
      if (this.editingTaskId !== null) {
        this.updateTask()
      } else {
        this.addTask()
      }
    }
  }

  addTask() {
    const taskInput = document.getElementById("taskInput")
    const taskText = taskInput.value.trim()

    if (taskText === "") return

    const newTask = {
      id: Date.now(),
      text: taskText,
      createdAt: new Date().toLocaleString(),
    }

    this.tasks.push(newTask)
    this.saveTasks()
    this.renderTasks()
    taskInput.value = ""
  }

  editTask(taskId) {
    const task = this.tasks.find((t) => t.id === taskId)
    if (task) {
      document.getElementById("taskInput").value = task.text
      this.editingTaskId = taskId

      document.getElementById("addTaskBtn").style.display = "none"
      document.getElementById("updateTaskBtn").style.display = "inline-block"
      document.getElementById("cancelEditBtn").style.display = "inline-block"

      document.getElementById("taskInput").focus()
    }
  }

  updateTask() {
    const taskInput = document.getElementById("taskInput")
    const taskText = taskInput.value.trim()

    if (taskText === "" || this.editingTaskId === null) return

    const taskIndex = this.tasks.findIndex((t) => t.id === this.editingTaskId)
    if (taskIndex !== -1) {
      this.tasks[taskIndex].text = taskText
      this.saveTasks()
      this.renderTasks()
      this.cancelEdit()
    }
  }

  cancelEdit() {
    this.editingTaskId = null
    document.getElementById("taskInput").value = ""

    document.getElementById("addTaskBtn").style.display = "inline-block"
    document.getElementById("updateTaskBtn").style.display = "none"
    document.getElementById("cancelEditBtn").style.display = "none"
  }

  deleteTask(taskId) {
    if (confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
      this.tasks = this.tasks.filter((t) => t.id !== taskId)
      this.saveTasks()
      this.renderTasks()

      if (this.editingTaskId === taskId) {
        this.cancelEdit()
      }
    }
  }

  renderTasks() {
    const tasksContainer = document.getElementById("tasksContainer")

    if (this.tasks.length === 0) {
      tasksContainer.innerHTML = '<div class="no-tasks">No hay tareas pendientes</div>'
      return
    }

    const tasksHTML = this.tasks
      .map(
        (task) => `
            <div class="task-item">
                <div class="task-text">${task.text}</div>
                <div class="task-actions">
                    <button class="edit-btn" onclick="taskManager.editTask(${task.id})">Editar</button>
                    <button class="delete-btn" onclick="taskManager.deleteTask(${task.id})">Eliminar</button>
                </div>
            </div>
        `,
      )
      .join("")

    tasksContainer.innerHTML = tasksHTML
  }

  saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks))
  }
}

const taskManager = new TaskManager()