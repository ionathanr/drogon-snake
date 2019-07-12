import React from 'react';
import Canvas from './canvas';

export default class Animation extends React.Component {
  constructor(props) {
    super(props);

    this.size = 200;
    this.width = 800;
    this.height = 800;

    this.state = { 
      xAxis: this.size + 2, 
      yAxis: this.height/2,
      xCircle: 0,
      yCircle: 0,
      width: this.width, 
      height: this.height,
      goRight: true,
      goLeft: false,
      goDown: false,
      goUp: false,
      size: this.size,
      positions: [[0, 0]],
      directions: ['right'],
      tails: [[0, 0]],
      gameOver: false
    };
    this.updateAnimationState = this.updateAnimationState.bind(this);
    this.moveLeft = this.moveLeft.bind(this);
    this.moveUp = this.moveUp.bind(this);
    this.moveDown = this.moveDown.bind(this);
    this.moveRight = this.moveRight.bind(this);
    this.stop = this.stop.bind(this);
    this.start = this.start.bind(this);
    this.detectImpactWithFood = this.detectImpactWithFood.bind(this);
    this.restart = this.restart.bind(this);
  }

  componentDidMount() {
    this.generateNewFood();
    this.rAF = requestAnimationFrame(this.updateAnimationState);
  }

  updateAnimationState() {
    if ((this.state.xAxis < this.state.width - 1 && this.state.goRight)) {
      this.setState(prevState => ({ xAxis: prevState.xAxis + 2 }));
      this.calculateVectors();
    }
    if  ((this.state.xAxis > 1 && this.state.goLeft)) {
      this.setState(prevState => ({ xAxis: prevState.xAxis - 2 }));
      this.calculateVectors();
    }
    if  ((this.state.yAxis < this.state.height - 1 && this.state.goDown)) {
      this.setState(prevState => ({ yAxis: prevState.yAxis + 2 }));
      this.calculateVectors();
    }
    if  ((this.state.yAxis > 1 && this.state.goUp)) {
      this.setState(prevState => ({ yAxis: prevState.yAxis - 2 }));
      this.calculateVectors();
    }
    if ((this.state.yAxis === 0 || this.state.yAxis === this.height || this.state.xAxis === 0 || this.state.xAxis === this.width)) {
      this.setState({ gameOver: true });
    }
  }

  generateNewFood() {
    let x = Math.floor((Math.random() * this.state.width - 2) + 1);
    let y = Math.floor((Math.random() * this.state.height - 2) + 1);
    x = x > 2 ? x : 2;
    y = y > 2 ? y : 2;
    this.setState({ xCircle: x, yCircle: y });
  }

  calculateVectors() {
    let head = [this.state.xAxis, this.state.yAxis];
    let tail = [];
    let index = 0;
    let currSize = this.state.size;
    let sizePlaceholder = 0

    while (currSize >= 0) {
      if (head[0] === this.state.positions[index][0]) {
        sizePlaceholder = 0;
        let diff = head[1] - this.state.positions[index][1];
        if (diff >= currSize && this.state.directions[0] === 'down') {
          tail.unshift([head[0], this.state.directions[0] === 'down' ? head[1] - currSize : head[1] + currSize]);
          sizePlaceholder = currSize;
          currSize = -1;
        } else if (Math.abs(diff) >= currSize && this.state.directions[0] === 'up') {
          tail.unshift([head[0], this.state.directions[0] === 'up' ? head[1] + currSize : head[1] - currSize]);
          sizePlaceholder = currSize;
          currSize = -1;
        } else {
          tail.unshift([head[0], this.state.positions[index][1]]);
          sizePlaceholder = currSize;
          currSize = currSize - Math.abs(diff);
          head = this.state.positions[index];
          index = index + 1;
        }
      } else {
        sizePlaceholder = 0;
        let diff = head[0] - this.state.positions[index][0];
        if (diff >= currSize && this.state.directions[0] === 'right') {
          tail.unshift([this.state.directions[0] === 'right' ? head[0] - currSize : head[0] + currSize, head[1]]);
          sizePlaceholder = currSize;
          currSize = -1;
        } else if (Math.abs(diff) >= currSize && this.state.directions[0] === 'left') {
          tail.unshift([this.state.directions[0] === 'left' ? head[0] + currSize : head[0] - currSize, head[1]]);
          sizePlaceholder = currSize;
          currSize = -1;
        } else {
          tail.unshift([this.state.positions[index][0], head[1]]);
          head = this.state.positions[index];
          sizePlaceholder = currSize;
          currSize = currSize - Math.abs(diff);
          index = index + 1;
        }
      }
    }

    if (tail[1]) {
      switch(this.state.directions[tail.length - 1]) {
        case 'right':
          tail[0][0] = tail[1][0] - sizePlaceholder;
          break
        case 'left':
          tail[0][0] = tail[1][0] + sizePlaceholder;
          break
        case 'down':
          tail[0][1] = tail[1][1] - sizePlaceholder;
          break
        case 'up':
          tail[0][1] = tail[1][1] + sizePlaceholder;
          break
        default:
          break
      }
    } 

    let position = this.state.positions.slice()
    position.slice(0, index + 1);
    
    this.setState({ tails: tail, positions: position });

    this.rAF = requestAnimationFrame(this.updateAnimationState);
  }

  moveLeft() {
    if (this.state.directions[0] === 'right' || this.state.directions[0] === 'left') {
      return;
    } else {
      let position = this.state.positions.slice(0, 15);
      let direction = this.state.directions.slice(0, 15);
      position.unshift([this.state.xAxis, this.state.yAxis]);
      direction.unshift('left');

      this.setState({ goRight: false, goLeft: true, goDown: false, goUp: false, positions: position, directions: direction });
      if (this.state.xAxis === this.state.width && !this.state.goLeft) {
        this.setState({ goRight: false, goLeft: true, goDown: false, goUp: false, positions: position, directions: direction });
      }
    }
  }

  moveUp() {
    if (this.state.directions[0] === 'down'|| this.state.directions[0] === 'up') {
      return;
    } else {
      let position = this.state.positions.slice(0, 15);
      let direction = this.state.directions.slice(0, 15);
      position.unshift([this.state.xAxis, this.state.yAxis]);
      direction.unshift('up');

      this.setState(({ goRight: false, goLeft: false, goDown: false, goUp: true, positions: position, directions: direction }));
      if (this.state.yAxis === this.state.height && !this.state.goUp) {
        this.setState(({ goRight: false, goLeft: false, goDown: false, goUp: true, positions: position, directions: direction }));
      }
    }
  }

  moveDown() {
    if (this.state.directions[0] === 'up' || this.state.directions[0] === 'down') {
      return;
    } else {
      let position = this.state.positions.slice(0, 15);
      let direction = this.state.directions.slice(0, 15);
      position.unshift([this.state.xAxis, this.state.yAxis]);
      direction.unshift('down');

      this.setState(({ goRight: false, goLeft: false, goDown: true, goUp: false, positions: position, directions: direction }));
      if (this.state.yAxis === 0 && !this.state.goDown) {
        this.setState(({ goRight: false, goLeft: false, goDown: true, goUp: false, positions: position, directions: direction }));
      }
    }
  }

  moveRight() {
    if (this.state.directions[0] === 'left' || this.state.directions[0] === 'right') {
      return;
    } else {
      let position = this.state.positions.slice(0, 15);
      let direction = this.state.directions.slice(0, 15);
      position.unshift([this.state.xAxis, this.state.yAxis]);
      direction.unshift('right');
      this.setState(({ goRight: true, goLeft: false, goDown: false, goUp: false, positions: position, directions: direction }));
      if (this.state.xAxis === 0 && !this.state.goRight) {
        this.setState(({ goRight: true, goLeft: false, goDown: false, goUp: false, positions: position, directions: direction }));
      }
    }
  }

  detectImpactWithFood() {
    let x = this.state.xCircle;
    let y = this.state.yCircle
    if ((this.state.xAxis >= x - 16 && this.state.xAxis <= x + 16) && (this.state.yAxis >= y - 16 && this.state.yAxis <= y + 16)) {
      this.generateNewFood();
      this.setState({ size: this.state.size + 10 });
    }
  }

  restart() {
    let x = Math.floor((Math.random() * this.state.width - 2) + 1);
    let y = Math.floor((Math.random() * this.state.height - 2) + 1);
    x = x > 2 ? x : 2;
    y = y > 2 ? y : 2;
    this.setState({ 
      xAxis: this.size + 2, 
      yAxis: this.width/2,
      xCircle: x,
      yCircle: y,
      width: this.width, 
      height: this.height,
      goRight: true,
      goLeft: false,
      goDown: false,
      goUp: false,
      size: this.size,
      positions: [[0, 0]],
      directions: ['right'],
      tails: [[0, 0]],
      gameOver: false
    });
    this.rAF = requestAnimationFrame(this.updateAnimationState);
  }

  stop() {
    cancelAnimationFrame(this.rAF);
  }
  
  start() {
    this.rAF = requestAnimationFrame(this.updateAnimationState);
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row d-flex justify-content-center game">
          <div className="col-sm score">
            <a href="#" className="nes-badge is-splited">
              <span className="is-dark">Score</span>
              <span className="is-success">{this.state.size - this.size}</span>
            </a>
          </div>
          <div className="col-sm nes-container is-rounded canvas-outerborder">
            <Canvas  
              width={this.state.width} 
              height={this.state.height} 
              moveLeft={this.moveLeft}
              moveUp={this.moveUp}
              moveDown={this.moveDown} 
              moveRight={this.moveRight} 
              xAxis={this.state.xAxis}
              yAxis={this.state.yAxis}
              xCircle={this.state.xCircle}
              yCircle={this.state.yCircle}
              goRight={this.state.goRight}
              goLeft={this.state.goLeft}
              goDown={this.state.goDown}
              goUp={this.state.goUp}
              size={this.state.size}
              tails={this.state.tails}
              imageRight={this.refs.imageRight}
              imageLeft={this.refs.imageLeft}
              imageDown={this.refs.imageDown}
              imageUp={this.refs.imageUp}
              sheep={this.refs.sheep}
              detectImpactWithFood={this.detectImpactWithFood} />
          </div>
          <div className="col-sm button-container">
            <ul className="">
              <li className="nes-pointer">
                <a className="nes-btn nes-pointer" onClick={this.stop}>Stop !!!</a>
              </li>
              { this.state.gameOver && 
                <li className="nes-pointer">
                  <a className="nes-btn nes-pointer" onClick={this.restart}>Restart</a>  
                </li>
              }
              <li className="nes-pointer">
                <a className="nes-btn nes-pointer" onClick={this.start}>Start</a>
              </li>
            </ul>
          </div>
        </div>
        <img ref="imageRight" src={process.env.PUBLIC_URL + '/img/head_right.png'} alt="head_right" className="hidden" />
        <img ref="imageLeft" src={process.env.PUBLIC_URL + '/img/head_left.png'} alt="head_left" className="hidden" />
        <img ref="imageDown" src={process.env.PUBLIC_URL + '/img/head_down.png'} alt="head_down" className="hidden" />
        <img ref="imageUp" src={process.env.PUBLIC_URL + '/img/head_up.png'} alt="head_up" className="hidden" />
        <img ref="sheep" src={process.env.PUBLIC_URL + '/img/sheep.png'} alt="head_up" className="hidden" />
      </div>
    )
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.rAF);
  }
}