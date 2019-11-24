'use strict';

var { Carousel } = require('./dist/carousel/Carousel');
var { Pagination } = require('./dist/pagination/Pagination');
//var ParallaxImage = require('./dist/parallaximage/ParallaxImage');
var { getInputRangeFromIndexes } = require('./dist/utils/animations');

module.exports = {
  Carousel,
  Pagination,
  getInputRangeFromIndexes
};
