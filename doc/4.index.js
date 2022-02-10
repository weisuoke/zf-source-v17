import React from './react';
let virtualDOM = (
  <div id="A1" key="A1">
    <div id="B1" key="B1">B1</div>
    <div id="B2" key="B2">B2</div>
  </div>
)

function FunctionComponent(props) {
  return virtualDOM
}

class ClassComponent extends React.Component {
  render() {
    return virtualDOM;
  }
}

let functionVirtualDOM = <FunctionComponent />
let classVirtualDOM = <ClassComponent />

console.log(functionVirtualDOM);
console.log(classVirtualDOM)