import React, { Component } from 'react'
import TodoHttpService from '../Services/HttpService'
import './Todo.scss'

let $TodoService = new TodoHttpService()

class Todo extends Component {
  constructor (props) {
    super(props)
    this.toggleComplete = this.toggleComplete.bind(this)
    this.remove = this.remove.bind(this)
    this.refreshTodos = props.refresh
    this.state = {
      completed: props.instance.completed || false
    }
  }

  async remove () {
    let resp = await $TodoService.remove(this.props.instance._id)
    let json = resp.json()
    console.log(json)
    this.refreshTodos()
  }

  toggleComplete () {
    $TodoService.updateTodo(this.props.instance._id, this.state.completed)
    .then((resp) => resp.json())
    .then((json) => {
      console.log(json)
    })
    this.setState({
      completed: !this.state.completed
    })
    console.log(this.state.completed)
  }

  render () {
    return (
      <div className='todo-div' >
        <button className='fancy-button' onClick={this.remove}>
            x
        </button>
        <h2>{ (this.state.completed)
            ? (<s>{this.props.instance.title }</s>)
            : this.props.instance.title}
        </h2>
        <button className='fancy-button' onClick={this.toggleComplete}>
          Toggle
        </button>
      </div>
    )
  }
}

class TodoList extends Component {
  constructor (props) {
    super(props)
    this.fetchTodos = this.fetchTodos.bind(this)
    this.newTodo = this.newTodo.bind(this)
    this.updateTodoTitle = this.updateTodoTitle.bind(this)
    this.state = {
      todos: [],
      todoTitle: ''
    }
  }

  async fetchTodos () {
    let fetchResponse = await $TodoService.retrieveTodos()
    let todos = await fetchResponse.json()
    this.setState({
      todos,
    })
  }

  async newTodo (event) {
    event.preventDefault()
    await $TodoService.create(this.state.todoTitle)
    let response = await this.fetchTodos()
    console.log(response)
  }

  updateTodoTitle (event) {
    this.setState({ todoTitle: event.target.value })
  }

  componentDidMount () {
    this.fetchTodos()
  }

  render () {
    return (
      <div className='todo-wrapper flex-column' spacing="space-between" flexDirection="column">
        <h2>Add a motherfucking todo</h2>
        <form onSubmit={this.newTodo} spacing="space-between">
          <input type='text' value={this.state.todoTitle} onChange={this.updateTodoTitle}
            className='fancy-input' />
          <button type='submit' className='fancy-button'>
            Add
          </button>
        </form>
        {
          this.state.todos.map(todo => {
            return (<Todo className="flex-row" refresh={this.fetchTodos} instance={todo} key={todo._id} />)
          })
        }
      </div>
    )
  }
}

export default TodoList
