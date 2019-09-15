import React from "react";
import { GridGenerator, Hexagon, HexGrid, Layout, Text, HexUtils } from 'react-hexgrid';
import "./App.css";

class App extends React.Component {
  constructor() {
    super();
    this.SVGwidth = 1200;
    // Find the height of the SVG when width is given
    this.SVGheight = this.SVGwidth / 2 * 1.732;
    this.gridSize = 10;
    const hexagons = GridGenerator.hexagon(this.gridSize);
    this.state = { hexagons, currentIteration: 0 };
    this.r = React.createRef();
  }

  checkWin = (index) => {
    return false;
  }

  handleClick = (index) => () => {
    let { hexagons, currentIteration } = this.state;
    if (hexagons[index].selected) {
      alert("One does not simply break the galactic code by selecting what's already selected.")
    }
    else {
      hexagons[index].selected = this.state.currentIteration % 2 === 0 ? 'white' : 'black';
      this.checkWin(index) && alert("Hey, we have a winner!");
      currentIteration++;
      this.setState({ hexagons, currentIteration });
      console.log(this.state, hexagons[index])
    }
  }

  HexLayout = (props) => <Layout width={this.SVGwidth} height={this.SVGheight}>{props.children.map(e => e)}</Layout>

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
          </div>
          <div className="Game">
            <HexGrid width={this.SVGwidth} height={this.SVGheight}>
              <Layout size={{ x: 3, y: 3 }} flat={false}>
                {this.state.hexagons.map((hex, i) => (<Hexagon key={i}
                  q={hex.q}
                  r={hex.r}
                  s={hex.s}
                  className={hex.selected || null}
                  onClick={this.handleClick(i)}
                  data={hex}>
                  <Text>{HexUtils.getID(hex)} {i}</Text>
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
