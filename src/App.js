import React from "react";
import { Hexagon, HexGrid, HexUtils, Layout, Text } from 'react-hexgrid';
import "./App.css";

class App extends React.PureComponent {

  constructor() {
    super();
    this.SVGwidth = 1100;
    // Find the height of the SVG when width is given
    this.SVGheight = this.SVGwidth / 2 * 1.732;
    // Set grid size
    this.gridSize = 10;

    this.players = { white: 8, black: 7 }
    this.state = { currentIteration: 0 }
  }

  componentDidMount() {
    fetch('get').then(r => r.json()).then(r => this.setState({ hexagons: r }))
  }

  getPlayerNameFromNumber = (number) => {
    const x = Object.entries(this.players).filter(v => v[1] == number)
    return x && x[0][0]
  }

  handleClick = (hex) => () => {
    if (!this.checkPossible(hex)) {
      alert("Mate, that move is illegal.")
    } else {
      hex.value = this.state.hexagons.player
      fetch('move', { method: 'PUT', body: JSON.stringify(hex) })
        .then(r => {
          r.headers.get("win") && alert(this.getPlayerNameFromNumber(r.headers.get("win")) + " won!")
          return r.json()
        }).then(r => this.setState({ hexagons: r }))
    }
  }

  handleUndo = () => { }

  handleReset = () => {
    fetch('reset').then(r => r.json()).then(r => this.setState({ hexagons: r }))
  }

  checkPossible = (hex) => {
    return this.state.hexagons.currentIteration <= 0 || (this.state.hexagons.currentIteration === 1 && hex.value > 0) || (hex.value > 1 && hex.value < 7)
  }

  render() {
    console.log(this.state)
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Le poorly coded game of Andantino by Buga
            <sup>
              &copy;
            </sup>
          </p>
        </header>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div className="Sidebar">
            <p title="I dont get paid for this, so I keep it simple by naming black and white. Not to be confused with racism." style={{ cursor: 'pointer' }}>
              {(this.state.hexagons && this.getPlayerNameFromNumber(this.state.hexagons.player)) + ' to play'}
            </p>
            <p>
              Iteration {this.state.hexagons && this.state.hexagons.currentIteration}
            </p>
            <button onClick={this.handleUndo}>Undo</button>
            <button onClick={this.handleReset}>New game</button>
            <span>
              <input type="checkbox" name="havannah" onClick={(e) => this.setState({ [e.target.name]: e.target.checked })} />
              <label>Havannah</label>
            </span>
            <span>
              <input type="checkbox" name="debugFreedom" onClick={(e) => this.setState({ [e.target.name]: e.target.checked })} />
              <label>Debug freedom</label>
            </span>
          </div>
          <div className="Game">
            <HexGrid width={this.SVGwidth} height={this.SVGheight}>
              <Layout size={{ x: 3, y: 3 }} flat={false}>
                {this.state.hexagons && this.state.hexagons.cubic.map((hex, i) => (<Hexagon key={i}
                  q={hex.q}
                  r={hex.r}
                  s={hex.s}
                  className={(hex.value === this.players['white'] && 'white') || (hex.value === this.players['black'] && 'black') || (this.checkPossible(hex) ? 'possible' : null)}
                  onClick={this.handleClick(hex)}
                  data={hex} >
                  {!this.state.havannah ? <Text>{HexUtils.getID(hex)} {this.state.debugFreedom && hex.value}</Text> :
                    <Text>{`${String.fromCharCode(65 + hex.q + hex.r + this.gridSize)},${this.gridSize - hex.q - hex.s}`} {this.state.debugFreedom && hex.value}</Text>}
                  {/* // <Text>{`${hex.q + hex.r + this.gridSize},${this.gridSize - hex.q - hex.s}`} {this.state.debugFreedom && hex.value}</Text>} */}
                </Hexagon>))}
              </Layout>
            </HexGrid>
          </div>
        </div>
      </div >
    );
  }
}

export default App;
