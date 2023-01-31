const BASE_URL = 'https://jsonplaceholder.typicode.com/todos/'
const QUERY_URL = 'https://jsonplaceholder.typicode.com/todos?_limit=7'
const addForm = document.querySelector('#add-form')
const output = document.querySelector('#output')
const modal = document.querySelector('.modal')
const toDos =  []


// HÄMTAR DATA FRÅN DATABASEN
const getItems = async () => {
  const res = await fetch(QUERY_URL)
  const items = await res.json()


  items.forEach(item => {
    toDos.push(item)
  })

  listToDos()
}

// LISTAR UPP TODOS FRÅN DATABASEN

const listToDos = () => {

  output.innerHTML = ''

  toDos.forEach(toDo => {
    const todoItem = createItem(toDo)
    output.appendChild(todoItem)

  })
}


// SKAPAR CARDS AV OBJEKT PÅ DATABASEN
const createItem = (item) => {
  const card = document.createElement('div')
  card.classList.add('card')
  card.id = item.id

  const title = document.createElement('p')
  title.innerText = item.title

  const deleteBtn = document.createElement('button')
  deleteBtn.classList.add('delete-btn')
  deleteBtn.classList.add('disabled')
  deleteBtn.innerText = 'Delete'

  
  card.appendChild(title)
  card.appendChild(deleteBtn)
  
  if(item.completed === true) {
      title.classList.add('completed-task')
      deleteBtn.classList.remove('disabled')
    }
    
  
  return card
}

// VALIDERAR INPUT 

const validateForm = () => {
  const input = document.querySelector('#add-form_item')

  if(input.value.trim() === '') {
    document.querySelector('.error-message').classList.remove('display-none')
    return false
  }
  document.querySelector('.error-message').classList.add('display-none')

  return true
}


// LÄGGER TILL CARDS I LISTAN OCH VALIDERAR
const addTodos = e => {
  e.preventDefault()

  if(!validateForm()) {return}

  const newItem = {
    title: document.querySelector('#add-form_item').value,
    completed: false 
  }

  fetch(BASE_URL, {
    method: 'POST',
    body: JSON.stringify(newItem),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((res) => res.json())
    .then((data) => {

      toDos.push(data)

      const newTodo = createItem(data)
      output.appendChild(newTodo)
      addForm.reset()
    })

}


// RADERA CARD FRÅN TODO-LISTAN
const deleteTodo = (e) => {
  
  if(e.target.classList.contains('disabled') && e.target.innerText === 'Delete') {
    modal.classList.remove('display-none')
  }
  
  if(!e.target.classList.contains('disabled') && e.target.innerText === 'Delete') {

      fetch(BASE_URL + e.target.parentElement.id, {
        method: 'DELETE'
      })
        .then(res => {
          if(res.ok) {
            e.target.parentElement.remove()
            modal.classList.add('display-none')
      
            const index = toDos.findIndex(todo => todo.id == e.target.parentElement.id)
            toDos.splice(index, 1)
          }
        })
  }
}


// Klarmarkera todo
const completedTask = (e) => {

  if(e.target.classList.contains('card')) {
    e.target.querySelector('p').classList.toggle('completed-task')
    e.target.querySelector('.delete-btn').classList.toggle('disabled')
    e.target.completed = true
    
  }
  
  if(e.target.nodeName === 'P') {
    e.target.classList.toggle('completed-task')
    e.target.nextSibling.classList.toggle('disabled')
    e.target.completed = true
  }
}

// Hämtar in datan
getItems()

addForm.addEventListener('submit', addTodos)
output.addEventListener('click', completedTask)
output.addEventListener('click', deleteTodo)

