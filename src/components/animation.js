import React from 'react';
import Canvas from './canvas';

export default class Animation extends React.Component {
  constructor(props) {
    super(props);

    this.size = 60;

    this.state = { 
      xAxis: this.size, 
      yAxis: 0, 
      width: 400, 
      height: 400,
      goRight: true,
      goLeft: false,
      goDown: false,
      goUp: false,
      size: this.size,
      positions: [[0, 0]],
      directions: ['right'],
      tails: [[0, 0]]
    };
    this.updateAnimationState = this.updateAnimationState.bind(this);
    this.moveLeft = this.moveLeft.bind(this);
    this.moveUp = this.moveUp.bind(this);
    this.moveDown = this.moveDown.bind(this);
    this.moveRight = this.moveRight.bind(this);
    this.stop = this.stop.bind(this);
    this.start = this.start.bind(this);
  }

  componentDidMount() {
    this.rAF = requestAnimationFrame(this.updateAnimationState);
  }

  updateAnimationState() {
    if ((this.state.xAxis < this.state.width && this.state.goRight)) {
      this.setState(prevState => ({ xAxis: prevState.xAxis + 1 }));
      this.calculateVectors();
    } 
    if  ((this.state.xAxis > 0 && this.state.goLeft)) {
      this.setState(prevState => ({ xAxis: prevState.xAxis - 1 }));
      this.calculateVectors();
    }
    if  ((this.state.yAxis < this.state.height && this.state.goDown)) {
      this.setState(prevState => ({ yAxis: prevState.yAxis + 1 }));
      this.calculateVectors();
    } 
    if  ((this.state.yAxis > 0 && this.state.goUp)) {
      this.setState(prevState => ({ yAxis: prevState.yAxis - 1 }));
      this.calculateVectors();
    } 
  }

  calculateVectors() {
    let head = [this.state.xAxis, this.state.yAxis];
    let tail = [];
    let index = 0;
    let currSize = this.state.size;

    while (currSize >= 0) {
      console.log("========== new iteration ==========", currSize, tail, head);
      if (head[0] === this.state.positions[index][0]) {
        let diff = head[1] - this.state.positions[index][1];
        if (diff >= currSize && this.state.directions == 'down') {
          tail.unshift([head[0], this.state.directions[0] == 'down' ? head[1] - currSize : head[1] + currSize]);
          console.log(">> tail 1111 >>>>", tail, currSize);
          currSize = -1;
        } else {
          console.log(">> tail 1111 else >>>>", tail, head, currSize, diff);
          let yCoord = head[1] + diff;
          tail.unshift([head[0], this.state.positions[index][1]]);
          currSize = currSize - Math.abs(diff);
          head = this.state.positions[index];
          index = index + 1;
          console.log(">> tail 1111 else >>>>", tail, head, currSize, diff);
        }
      } else {
        let diff = head[0] - this.state.positions[index][0];
        if (diff >= currSize && this.state.directions === 'right') {
          tail.unshift([this.state.directions[0] == 'right' ? head[0] - currSize : head[0] + currSize, head[1]]);
          console.log(">> tail 2222 >>>>", tail, currSize);
          currSize = -1;
        } else {
          console.log(">> tail 2222 else >>>>", tail, head, currSize, diff);
          let xCoord = head[0] + diff;
          tail.unshift([this.state.positions[index][0], head[1]]);
          head = this.state.positions[index];
          currSize = currSize - Math.abs(diff);
          index = index + 1;
          console.log(">> tail 2222 else >>>>", tail, head, currSize, diff);
        }
      }
    }

    let position = this.state.positions.slice()
    position.slice(0, 5);
    
    this.setState({ tails: tail, positions: position });

    this.rAF = requestAnimationFrame(this.updateAnimationState);
  }

  moveLeft() {
    if (this.state.directions[0] === 'right' || this.state.directions[0] === 'left') {
      return;
    } else {
      console.log("left", this.state);
      let position = this.state.positions.slice(0, 7);
      let direction = this.state.directions.slice(0, 7);
      position.unshift([this.state.xAxis, this.state.yAxis]);
      direction.unshift('left');

      this.setState({ goRight: false, goLeft: true, goDown: false, goUp: false, positions: position, directions: direction });
      if (this.state.xAxis === this.state.width && !this.state.goLeft) {
        console.log("left", this.state);
        this.setState({ goRight: false, goLeft: true, goDown: false, goUp: false, positions: position, directions: direction });
        // this.rAF = requestAnimationFrame(this.updateAnimationState);
      }
    }
  }

  moveUp() {
    if (this.state.directions[0] === 'down'|| this.state.directions[0] === 'up') {
      return;
    } else {
      console.log("up", this.state);
      let position = this.state.positions.slice(0, 7);
      let direction = this.state.directions.slice(0, 7);
      position.unshift([this.state.xAxis, this.state.yAxis]);
      direction.unshift('up');

      this.setState(({ goRight: false, goLeft: false, goDown: false, goUp: true, positions: position, directions: direction }));
      if (this.state.yAxis === this.state.height && !this.state.goUp) {
        console.log("up", this.state);
        this.setState(({ goRight: false, goLeft: false, goDown: false, goUp: true, positions: position, directions: direction }));
        // this.rAF = requestAnimationFrame(this.updateAnimationState);
      }
    }
  }

  moveDown() {
    if (this.state.directions[0] === 'up' || this.state.directions[0] === 'down') {
      return;
    } else {
      console.log("down", this.state);
      let position = this.state.positions.slice(0, 7);
      let direction = this.state.directions.slice(0, 7);
      position.unshift([this.state.xAxis, this.state.yAxis]);
      direction.unshift('down');

      this.setState(({ goRight: false, goLeft: false, goDown: true, goUp: false, positions: position, directions: direction }));
      if (this.state.yAxis === 0 && !this.state.goDown) {
        console.log("down", this.state);
        this.setState(({ goRight: false, goLeft: false, goDown: true, goUp: false, positions: position, directions: direction }));
        // this.rAF = requestAnimationFrame(this.updateAnimationState);
      }
    }
  }

  moveRight() {
    if (this.state.directions[0] === 'left' || this.state.directions[0] === 'right') {
      return;
    } else {
      console.log("right", this.state);
      let position = this.state.positions.slice(0, 7);
      let direction = this.state.directions.slice(0, 7);
      position.unshift([this.state.xAxis, this.state.yAxis]);
      direction.unshift('right');

      this.setState(({ goRight: true, goLeft: false, goDown: false, goUp: false, positions: position, directions: direction }));
      if (this.state.xAxis === 0 && !this.state.goRight) {
        console.log("right", this.state);
        this.setState(({ goRight: true, goLeft: false, goDown: false, goUp: false, positions: position, directions: direction }));
        // this.rAF = requestAnimationFrame(this.updateAnimationState);
      }
    }
  }

  stop() {
    cancelAnimationFrame(this.rAF);
  }
  
  start() {
    this.rAF = requestAnimationFrame(this.updateAnimationState);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.rAF);
  }

  render() {
    return (
      <div>
        <Canvas width={this.state.width} 
          height={this.state.height} 
          moveLeft={this.moveLeft}
          moveUp={this.moveUp}
          moveDown={this.moveDown} 
          moveRight={this.moveRight} 
          xAxis={this.state.xAxis}
          yAxis={this.state.yAxis}
          goRight={this.state.goRight}
          goLeft={this.state.goLeft}
          goDown={this.state.goDown}
          goUp={this.state.goUp}
          size={this.state.size}
          tails={this.state.tails} />
          <div>
            <button className="stop" type='button' onClick={this.stop}>Stop !!!</button>
          </div>
          <div>
            <button className="start" type='button' onClick={this.start}>Start</button>
          </div>
      </div>
    )
  }
}