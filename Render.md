```jsx
// 定义 JSX
let virtualDOM = (
  <div key="A1" style={style}>
    A1
    <div key="B1" style={style}>
      B1
      <div key="C1" style={style}>C1</div>
      <div key="C2" style={style}>C2</div>
    </div>
    <div key="B2" style={style}>B2</div>
  </div>
)
  
// 完全 自己实现这个 render 的全过程，包括调度、调和和提交三个阶段
ReactDOM.render(virtualDOM, document.getElementById('root'))
```