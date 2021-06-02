import React, { Component, createRef } from "react";
import "./Canvas.css";

const width = window.innerWidth;
const height = window.innerHeight;
let ctx;

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.audio = new Audio(this.props.audio);
    this.canvas = createRef();
  }

  displayText(myCanvas) {
    // Draw label
    ctx = myCanvas.getContext("2d");
    ctx.font = "500 24px Red Hat Display";
    const avg =
      [...Array(255).keys()].reduce(
        (acc, curr) => acc + this.frequencyArray[curr],
        0
      ) / 255;
    ctx.fillStyle = "white";
    // ctx.fillStyle = "rgb(" + 200 + ", " + (200 - avg) + ", " + avg + ")";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("BPM", myCanvas.width / 2, myCanvas.height / 2 - 80);
    ctx.font = "500 84px Red Hat Display";
    ctx.fillText("90", myCanvas.width / 2, myCanvas.height / 2 - 45);
    ctx.font = "500 24px Red Hat Display";
    ctx.fillText("Moderato", myCanvas.width / 2, myCanvas.height / 2 + 48);
  }

  animationLooper(myCanvas) {
    ctx = myCanvas.getContext("2d");
    let radius = 120;
    let bars = 100;

    // Draw Background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);

    // Display Text
    this.displayText(myCanvas);

    // Draw circle
    ctx.beginPath();
    ctx.arc(myCanvas.width / 2, myCanvas.height / 2, radius, 0, 2 * Math.PI);
    ctx.stroke();
    this.analyser.getByteFrequencyData(this.frequencyArray);

    // Draw bars
    for (let i = 0; i < bars; i++) {
      let radians = (Math.PI * 2) / bars;
      let bar_height = this.frequencyArray[i] * 0.5;

      let x = myCanvas.width / 2 + Math.cos(radians * i) * radius;
      let y = myCanvas.height / 2 + Math.sin(radians * i) * radius;
      let x_end =
        myCanvas.width / 2 + Math.cos(radians * i) * (radius + bar_height);
      let y_end =
        myCanvas.height / 2 + Math.sin(radians * i) * (radius + bar_height);
      let color =
        "rgb(" +
        200 +
        ", " +
        (200 - this.frequencyArray[i]) +
        ", " +
        this.frequencyArray[i] +
        ")";
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x_end, y_end);
      ctx.stroke();
    }
  }

  componentDidMount() {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    this.source = this.context.createMediaElementSource(this.audio);

    this.analyser = this.context.createAnalyser();
    this.source.connect(this.analyser);
    this.analyser.connect(this.context.destination);
    this.bufferLength = this.analyser.frequencyBinCount;
    this.frequencyArray = new Uint8Array(this.bufferLength);

    this.canvas.current.width = width;
    this.canvas.current.height = height;

    this.rafId = requestAnimationFrame(this.tick);

    document.fonts
      .load('10pt "Red Hat Display"')
      .then(() => this.displayText(this.canvas.current));

    // let font = new FontFaceObserver("Red Hat Display", {
    //   weight: 500,
    // });
    // font.load().then(() => {
    //   this.displayText();
    // });
    // WebFont.load({
    //   google: {
    //     families: ['Open Sans', 'Open Sans:bold']
    //   },
    //   active: function() {
    //     this.displayText();
    //   }
    // });
  }

  togglePlay = () => {
    const { audio } = this;
    if (audio.paused) {
      audio.play();
      this.rafId = requestAnimationFrame(this.tick);
    } else {
      audio.pause();
      cancelAnimationFrame(this.rafId);
    }
  };

  tick = () => {
    this.animationLooper(this.canvas.current);
    this.analyser.getByteTimeDomainData(this.frequencyArray);
    this.rafId = requestAnimationFrame(this.tick);
  };

  componentWillUnmount() {
    cancelAnimationFrame(this.rafId);
    this.analyser.disconnect();
    this.source.disconnect();
  }

  render() {
    return (
      <>
        <button onClick={this.togglePlay}>Play/Pause</button>
        <canvas ref={this.canvas} onClick={this.togglePlay} />
      </>
    );
  }
}

export { Canvas };
