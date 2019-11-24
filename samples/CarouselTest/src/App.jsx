/*
 * This file demonstrates basic usage of the Carousel component
 */

let React, RX;
React = RX = require('reactxp');

import { Carousel } from 'reactxp-carousel';

const _styles = {
  container: RX.Styles.createViewStyle({
    marginTop: 100,
    backgroundColor: "#eee",
    justifyContent: "center",
    height: 300,
    flex: 1,
    flexDirection: "row"
  }),
  slide: RX.Styles.createViewStyle({
    backgroundColor: "red",
    height: 300
  }),
  title: RX.Styles.createTextStyle({
    color: "black"
  })
};


const entries = [
  { title: "Item 1" },
  { title: "Item 2" },
  { title: "Item 3" },
  { title: "Item 4" },
  { title: "Item 5" },
  { title: "Item 6" }
]

class App extends RX.Component {

  _renderItem ({item, index}) {
    return (
      <RX.View style={_styles.slide}>
        <RX.Text style={_styles.title}>{ item.title }</RX.Text>
      </RX.View>
    );
  }

  render() {
    let { width, height } = RX.UserInterface.measureWindow();

    return (
      <RX.ScrollView >
        <RX.View style={_styles.container}>
        <Carousel
            ref={(c) => { this._carousel = c }}
            data={entries}
            renderItem={this._renderItem}
            sliderWidth={width}
            itemWidth={200}
          />
        </RX.View>
      </RX.ScrollView>
    );
  }
};

module.exports = App;
