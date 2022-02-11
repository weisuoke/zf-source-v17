// 1. 定义 JSX
// import React from "./react";

let style = { color: 'green', border: '1px solid red', margin: '5px' }
// let virtualDOM = (
//   <div>
//     <div key="A" style={style}>A
//       <div key="B1" style={style}>B1</div>
//       <div key="B2" style={style}>B2</div>
//     </div>
//   </div>
// )

let A = {
  type: 'div',
  key: 'A',
  props: {
    style,
    children: [
      // 'A',
      {type: 'div', key: 'B1', props: {style, children: []}},
      {type: 'div', key: 'B2', props: {style, children: []}}
    ]
  }
}

// 开始我们的工作循环

// 表示一个工作单元，表示正在处理中的 fiber
let workInProgress;
const Placement = 'Placement'
const TAG_ROOT = 'TAG_ROOT';  // 这个 Fiber 根节点
const TAG_HOST = 'TAG_HOST';  // 指的是原生DOM节点 div span p

let root = document.getElementById('root')
// Fiber 是一个普通的 JS 对象
let rootFiber = {
  tag: TAG_ROOT, // Fiber 的类型
  key: 'ROOT', // 唯一标签
  stateNode: root, // Fiber对应的真实DOM节点
  props: { children: [A] }
}

function workLoop() {
  while(workInProgress) {  // 如果有任务就执行
    workInProgress = performUnitOfWork(workInProgress) // 执行完成之后会返回下一个任务
  }
  console.log(rootFiber)
  commitRoot(rootFiber)
}

function commitRoot(rootFiber) {
  let currentEffect = rootFiber.firstEffect
  while (currentEffect) {
    let flags = currentEffect.flags
    switch (flags) {
      case Placement:
        commitPlacement(currentEffect)
    }
    currentEffect = currentEffect.nextEffect
  }
}

function commitPlacement(currentEffect) {
  let parent = currentEffect.return.stateNode
  parent.appendChild(currentEffect.stateNode)
}

function performUnitOfWork(workInProgress) {
  beginWork(workInProgress)
  if (workInProgress.child) { // 如果创建完子 fiber 链表后，如果有大儿子，有太子
    return workInProgress.child;  // 则返回处理太子，构建太子的儿子们
  }
  // 如果没有儿子，接着构建弟弟
  while(workInProgress) { // 看看有没有弟弟
    completeUnitOfWork(workInProgress);
    if (workInProgress.sibling) {
      return workInProgress.sibling;
    }
    // 如果没有弟弟，找叔叔，怎么找叔叔？就是爸爸的弟弟
    workInProgress = workInProgress.return;
    // 如果没有父亲，就全部结束了。
  }
}

// Fiber 在结束的时候要去创建真实的 DOM 元素。
function completeUnitOfWork(workInProgress) {
  console.log('completeUnitOfWork', workInProgress.key)
  let stateNode;  // 真实 DOM
  switch (workInProgress.tag) {
    case TAG_HOST:
      stateNode = createStateNode(workInProgress);
      break;
  }
  // debugger
  // 在完成工作的单元的时候要判断当前的 fiber 节点有没有对应的 DOM 操作
  makeEffectList(workInProgress)
}

function createStateNode(fiber) {
  if (fiber.tag === TAG_HOST) {
    // 根据类型创建真实 DOM 元素
    let stateNode = document.createElement(fiber.type)
    fiber.stateNode = stateNode;
  }
  return fiber.stateNode
}


function makeEffectList(completeWork) {
  let returnFiber = completeWork.return;
  if (returnFiber) {
    if (!returnFiber.firstEffect) {
      returnFiber.firstEffect = completeWork.firstEffect
    }
    if (completeWork.lastEffect) {
      if (returnFiber.lastEffect) {
        returnFiber.lastEffect.nextEffect = completeWork.firstEffect
      }
      returnFiber.lastEffect = completeWork.lastEffect
    }
    if (completeWork.flags) {
      if (returnFiber.lastEffect) {
        returnFiber.lastEffect.nextEffect = completeWork
      } else {
        returnFiber.firstEffect = completeWork
      }
      returnFiber.lastEffect = completeWork
    }
  }
}

/**
 * 根据当前的 Fiber 和虚拟DOM构建Fiber树
 * @param workInProgress
 * @return Function reconcileChildren 构建子 fiber 树
 */
function beginWork(workInProgress) {
  console.log('beginWork', workInProgress.key)
  let nextChildren = workInProgress.props.children
  return reconcileChildren(workInProgress, nextChildren);
}

/**
 * 根据父 Fiber 和 子虚拟DOM数组，构建当前 returnFiber 的子Fiber树。
 * @param returnFiber 父Fiber
 * @param nextChildren returnFiber 的 children
 * @return Fiber firstChildFiber 返回第一个儿子 Fiber
 */
function reconcileChildren(returnFiber, nextChildren) {
  let previousNewFiber; // 上一个 Fiber 儿子
  let firstChildFiber;  // 当前 returnFiber 的大儿子
  for (let newIndex = 0; newIndex < nextChildren.length; newIndex++) {
    let newFiber = createFiber(nextChildren[newIndex])
    newFiber.flags = Placement;
    newFiber.return = returnFiber;
    if (!firstChildFiber) { // 如果大儿子没有赋值，给赋上
      firstChildFiber = newFiber
    } else {
      previousNewFiber.sibling = newFiber
    }
    previousNewFiber = newFiber
  }
  returnFiber.child = firstChildFiber;
  return firstChildFiber;
}

function createFiber(element) {
  return {
    tag: TAG_HOST,  // 原生 DOM 节点
    type: element.type, // 具体 div p span
    key: element.key, // 唯一标识
    props: element.props  // 属性对象
  }
}

// 当前正在执行的工作单元
workInProgress = rootFiber
workLoop();

// 开始要根据虚拟DOM构建我们的Fiber树