import React from 'react'
import ReactDOM from 'react-dom'

/**
 * 因为实例是同一个，状态对象也是同一个，如果是类组件的话，this.state永远是最新的值
 */
class ClassComponent extends React.Component {
  static = { number: 0 }
  handleClick = (event) => {
    setTimeout(() => {
      console.log(this.state.number)
    }, 3000)
    this.setState({number: this.state.number + 1})
  }
  render() {
    return (
      <div>
        <p>{this.state.number}</p>
        <button onClick={this.handleClick}>+</button>
      </div>
    )
  }
}

ReactDOM.render(<ClassComponent />)