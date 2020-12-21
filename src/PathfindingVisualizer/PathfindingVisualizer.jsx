import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from './algorithms/dijkstra.js';

import './PathfindingVisualizer.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 25;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
    };
  }

  componentDidMount() {
    var grid = getInitialGrid();
    this.setState({grid});
  }
  resetGrid(){
    var {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    var visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    this.animateReset(visitedNodesInOrder);
    var newGrid = this.state.grid;
    this.setState({grid: newGrid});

  }

  handleMouseDown(row, col) {
    var newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid, mouseIsPressed: true});
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    var newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }

  handleMouseUp() {
    console.log("grid updated")
    this.setState({mouseIsPressed: false});
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 1; i <= visitedNodesInOrder.length-1; i++) {
      if (i === visitedNodesInOrder.length-1) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 7 * i);
        return;
      }
      setTimeout(() => {
        var node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 7 * i);
    }
  }

  animateReset(visitedNodesInOrder) {
    var {grid} = this.state;
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    for (let i = 1; i <= visitedNodesInOrder.length-1; i++) {
      setTimeout(() => {
        var node = visitedNodesInOrder[i];
        
        if (node===finishNode) return;
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-reset';
        
      }, 3 * i);
    }
  }
  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 1; i < nodesInShortestPathOrder.length-1; i++) {
      setTimeout(() => {
        var node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    var {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    var visitedNodesInOrder = [];
    visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    var nodesInShortestPathOrder = [];
    nodesInShortestPathOrder =getNodesInShortestPathOrder(finishNode);
    if(nodesInShortestPathOrder.length==1){
      alert("Path does not exist");
    }else{
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }
  }

  render() {
    var {grid, mouseIsPressed} = this.state;

    return (
      <>
        <div className="buttons">
        <button className="buttonclass" onClick={() => this.visualizeDijkstra()}>Visualize Dijkstra's Algorithm</button>
        <button className="buttonclass"   onClick={() => this.resetGrid()}>Reset</button>
        </div>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}
var getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};
var createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};




var getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};