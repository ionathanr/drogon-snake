import React from 'react';
import PureCanvas from './purecanvas'

export default class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.saveContext = this.saveContext.bind(this);
    this.moveLeft = this.moveLeft.bind(this);
    this.moveUp = this.moveUp.bind(this);
    this.moveDown = this.moveDown.bind(this);
    this.moveRight = this.moveRight.bind(this);
  }

  saveContext(ctx) {
    this.ctx = ctx;
    this.width = this.ctx.canvas.width;
    this.height = this.ctx.canvas.height;
  }

  createLine(xXAxis, yXAxis, xYAxis, yYAxis) {
    this.ctx.beginPath();
    this.ctx.lineWidth = "5";
    this.ctx.strokeStyle = "#4397AC"; // Green path
    this.ctx.moveTo(xXAxis, yXAxis);
    this.ctx.lineTo(xYAxis, yYAxis);
    this.ctx.stroke(); // Draw it
  }

  componentDidUpdate() {
    let { size, tails } = this.props;
    this.ctx.canvas.focus()
    const { xAxis, yAxis } = this.props;
    let idx = tails.length;

    this.ctx.save();
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.createLine(xAxis, yAxis, tails[tails.length - 1][0], tails[tails.length - 1][1]);

    for (let i = 1; i < tails.length; i++) {
      this.createLine(tails[tails.length - i][0], tails[tails.length - i][1], tails[tails.length - (i + 1)][0], tails[tails.length - (i + 1)][1]);
    }

    this.ctx.restore();
  }

  moveLeft() {
    this.props.moveLeft()
  }

  moveUp() {
    this.props.moveUp()
  }

  moveDown() {
    this.props.moveDown()
  }

  moveRight() {
    this.props.moveRight()
  }

  onFocus() {
    this.ctx.canvas.focus()
    console.log("=== element in focus ===");
  }

  onBlur() {
    console.log(">> element blurred >>");
  }

  render() {
    return <PureCanvas width={this.props.width} height={this.props.height} onFocus={this.onFocus} onBlur={this.onBlur} moveLeft={this.moveLeft} moveUp={this.moveUp} moveDown={this.moveDown} moveRight={this.moveRight} contextRef={this.saveContext} />;
  }
}


