import React from "react";
import { GridGenerator, Hexagon, HexGrid, Layout, Text, HexUtils } from 'react-hexgrid';
import "./App.css";

class App extends React.PureComponent {
  constructor() {
    super();
    this.SVGwidth = 1100;
    // Find the height of the SVG when width is given
    this.SVGheight = this.SVGwidth / 2 * 1.732;
    this.gridSize = 10;
    this.getResetState = () => {
      const hexagons = GridGenerator.hexagon(this.gridSize);
      return { hexagons, currentIteration: 0, havannah: false };
    }
    this.state = JSON.parse(window.localStorage.getItem('state')) || this.getResetState();
  }

  checkWin = () => {
    return false;
  }

  findPossible = () => {
    let { hexagons } = this.state;
    const { currentIteration } = this.state;
    const selected = hexagons.filter(h => h.selected);
    // Remove the meta property 'neighbours' for each hex
    hexagons.filter(h => h.neighbours).forEach(h => delete h.neighbours);
    if (currentIteration === 0) {
      selected.forEach(selection => HexUtils.neighbours(selection).forEach(s => hexagons[this.indexOf(s)].possible = true));
    } else {
      selected.forEach(selection => HexUtils.neighbours(selection).forEach(s => {
        const index = this.indexOf(s);
        if (hexagons[index].hasOwnProperty('neighbours')) {
          hexagons[index].neighbours++;
        } else {
          hexagons[index].neighbours = 1;
        }
        hexagons[index].possible = hexagons[index].neighbours >= 2 ? true : false;
      }))
    }
    this.setState(hexagons);
  }

  indexOf = (p) => {
    return this.state.hexagons.findIndex(h => HexUtils.equals(h, p));
  }

  handleClick = (index) => () => {
    let { hexagons, currentIteration } = this.state;
    if (hexagons[index].selected) {
      alert("One does not simply break the galactic code by selecting what's already selected.")
    }
    else if (currentIteration > 0 && !hexagons[index].possible) {
      alert("You cant select that, mate.")
    }
    else if (this.checkWin()) {
      alert("We have a winner!")
    }
    else {
      hexagons[index].selected = this.state.currentIteration % 2 === 0 ? 'white' : 'black';
      // this.checkWin(index) && alert("Hey, we have a winner!");
      currentIteration++;
      const newState = { hexagons, currentIteration, previousIndex: index };
      this.findPossible();
      this.setState(newState, () => { window.localStorage.setItem('state', JSON.stringify(newState)); });
    }
  }

  handleUndo = () => {
    let { hexagons, currentIteration, previousIndex } = this.state;
    delete hexagons[previousIndex].selected;
    currentIteration--;
    this.setState({ hexagons, currentIteration, previousIndex });
  }

  handleReset = () => {
    this.setState(this.getResetState());
  }

  render() {
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
              {(this.state.currentIteration % 2 === 0 ? 'White' : 'Black') + ' to play'}
            </p>
            <p>
              Iteration {this.state.currentIteration}
            </p>
            <button onClick={this.handleUndo}>Undo</button>
            <button onClick={this.handleReset}>New game</button>
            <span>
              <input type="checkbox" name="havannah" onClick={(e) => this.setState({ [e.target.name]: e.target.checked })} />
              <label>Havannah</label>
            </span>

          </div>
          <div className="Game">
            <HexGrid width={this.SVGwidth} height={this.SVGheight}>
              <Layout size={{ x: 3, y: 3 }} flat={false}>
                {this.state.hexagons.map((hex, i) => (<Hexagon key={i}
                  q={hex.q}
                  r={hex.r}
                  s={hex.s}
                  className={hex.selected || (hex.possible ? 'possible' : null)}
                  onClick={this.handleClick(i)}
                  data={hex}>
                  {!this.state.havannah ? <Text>{HexUtils.getID(hex)}</Text> :
                    <Text>{`${String.fromCharCode(65 + hex.q + hex.r + this.gridSize)},${this.gridSize - hex.q - hex.s}`}</Text>}
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
