import React from 'react'
import ReactDOM from 'react-dom'

/**
 * 因为实例是同一个，状态对象也是同一个，如果是类组件的话，this.state永远是最新的值
 */
class App extends React.Component {
  state = { list: new Array(100000).fill(0) }
  render() {
    return (
      <ul>
        <input />
        <button>add</button>
        {
          this.state.list.map((item, index) => <li key={index}>{item}</li>)
        }
      </ul>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))