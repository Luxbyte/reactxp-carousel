/*
 * This file demonstrates basic usage of the Carousel component
 */

let React, RX;
React = RX = require('reactxp');

let { Carousel, Pagination } = require('reactxp-carousel');

const _styles = {
  slide: RX.Styles.createViewStyle({
    backgroundColor: "white",
    height: 100,
    textAlign: "center",
    lineHeight: 100,
    borderRadius: 10,
    borderWidth: 1
  }),
  title: RX.Styles.createTextStyle({
    color: "black"
  }),
  exampleContainer: RX.Styles.createViewStyle({
    height: 300,
    paddingVertical: 30
  }),
  exampleContainerDark: RX.Styles.createViewStyle({
    backgroundColor: "#ddd"
  }),
  slider: RX.Styles.createViewStyle({
    marginTop: 15,
    overflow: 'visible' // for custom animations
  }),
  sliderContentContainer: RX.Styles.createViewStyle({
    paddingVertical: 10 // for custom animation
  })
};


const entries = [
  { title: "Item 1" },
  { title: "Item 2" },
  { title: "Item 3" },
  { title: "Item 4" },
  { title: "Item 5" },
  { title: "Item 6" },
  { title: "Item 1" },
  { title: "Item 2" },
  { title: "Item 3" },
  { title: "Item 4" },
  { title: "Item 5" },
  { title: "Item 6" }
]

class App extends RX.Component {

  state = {
    index: 0
  }
  carouselRef = null;

  _renderItem ({item, index}) {
    return (
      <RX.View style={_styles.slide}>
        <RX.Text style={_styles.title}>{ item.title }</RX.Text>
      </RX.View>
    );
  }

  render() {
    let { width, height } = RX.UserInterface.measureWindow();
    function wp (percentage) {
      const value = (percentage * width) / 100;
      return Math.round(value);
    }

    const slideHeight = height * 0.36;
    const slideWidth = 200;
    const itemHorizontalMargin = wp(2);

    const sliderWidth = width;
    const itemWidth = slideWidth + itemHorizontalMargin * 2;

    const type = 'default';

    return (
      <RX.View style={[_styles.exampleContainer, _styles.exampleContainerDark]}>
        <Carousel
          data={entries}
          ref={(ref) => {this.carouselRef = ref}}
          renderItem={this._renderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          containerCustomStyle={_styles.slider}
          contentContainerCustomStyle={_styles.sliderContentContainer}
          layout={type}
          inactiveSlideOpacity={0.1}
          inactiveSlideScale={0.5}
          vertical={false}
          onSnapToItem={(index) => this.setState({ activeSlide: index })}
          autoplay={false}
        />
        <Pagination
          dotsLength={entries.length}
          activeDotIndex={this.state.activeSlide || 0}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
          tappableDots={true}
          carouselRef={this.carouselRef}
        />
      </RX.View>
    );
  }
};

module.exports = App;
