class BaseHttpService {
  constructor (baseUrl = 'todo-list.kriswithak.io/api/', scheme = 'http://', apiVersion = 'v1') {
    this.totalBaseUrl = scheme + baseUrl + apiVersion
    this.scheme = scheme
  }

  async _request (method, path = '/', body = null,
                    auth = null, options = {headers: {
                      'Content-Type': 'application/json'
                    }}) {
    let preparedRequest = new Request(
            this.totalBaseUrl + path, {
              method,
              body,
              ...options
            }
        )
    let fetchResponse = await fetch(preparedRequest)
    return fetchResponse
  }
}

class TodoHttpService extends BaseHttpService {
  async retrieveTodos () {
    return await this._request('GET', '/Todo')
  }
  async updateTodo (id, state) {
    return await this._request('PATCH', `/Todo/${id}`, JSON.stringify({
      completed: !state
    }))
  }
  async remove (id) {
    return await this._request('DELETE', `/Todo/${id}`)
  }
  async create (title) {
    return await this._request('POST', '/Todo/', JSON.stringify({
      title
    }))
  }
}

export default TodoHttpService
