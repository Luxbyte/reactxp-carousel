import { Animated, Styles } from 'reactxp';

// Get scroll interpolator's input range from an array of slide indexes
// Indexes are relative to the current active slide (index 0)
// For example, using [3, 2, 1, 0, -1] will return:
// [
//     (index - 3) * sizeRef, // active + 3
//     (index - 2) * sizeRef, // active + 2
//     (index - 1) * sizeRef, // active + 1
//     index * sizeRef, // active
//     (index + 1) * sizeRef // active - 1
// ]
export function getInputRangeFromIndexes (range, index, carouselProps) {
    const sizeRef = carouselProps.vertical ? carouselProps.itemHeight : carouselProps.itemWidth;
    let inputRange = [];

    for (let i = 0; i < range.length; i++) {
        inputRange.push((index - range[i]) * sizeRef);
    }

    return inputRange;
}

// Default behavior
// Scale and/or opacity effect
// Based on props 'inactiveSlideOpacity' and 'inactiveSlideScale'
export function defaultScrollInterpolator (index, carouselProps) {
    const range = [1, 0, -1];
    const inputRange = getInputRangeFromIndexes(range, index, carouselProps);
    const outputRange = [0, 1, 0];

    return { inputRange, outputRange };
}
export function defaultAnimatedStyles (index, animatedValue, carouselProps) {
    let animatedOpacity = {};
    let animatedScale = {};

    if (carouselProps.inactiveSlideOpacity < 1) {
        animatedOpacity = {
            opacity: Animated.interpolate(animatedValue,
              [0, 1],
              [carouselProps.inactiveSlideOpacity, 1]
            )
        };
    }

    if (carouselProps.inactiveSlideScale < 1) {
        animatedScale = {
            transform: [{
                scale: Animated.interpolate(animatedValue,
                  [0, 1],
                  [carouselProps.inactiveSlideScale, 1]
                )
            }]
        };
    }

    return Styles.createAnimatedViewStyle({
        ...animatedOpacity,
        ...animatedScale
    });
}

// Shift animation
// Same as the default one, but the active slide is also shifted up or down
// Based on prop 'inactiveSlideShift'
export function shiftAnimatedStyles (index, animatedValue, carouselProps) {
    let animatedOpacity = {};
    let animatedScale = {};
    let animatedTranslate = {};

    if (carouselProps.inactiveSlideOpacity < 1) {
        animatedOpacity = {
            opacity: Animated.interpolate(animatedValue,
              [0, 1],
              [carouselProps.inactiveSlideOpacity, 1]
            )
        };
    }

    if (carouselProps.inactiveSlideScale < 1) {
        animatedScale = {
            scale: Animated.interpolate(animatedValue,
              [0, 1],
              [carouselProps.inactiveSlideScale, 1]
            )
        };
    }

    if (carouselProps.inactiveSlideShift !== 0) {
        const translateProp = carouselProps.vertical ? 'translateX' : 'translateY';
        animatedTranslate = {
            [translateProp]: Animated.interpolate(animatedValue,
              [0, 1],
              [carouselProps.inactiveSlideShift, 0]
            )
        };
    }

    return Styles.createAnimatedViewStyle({
        ...animatedOpacity,
        transform: [
            { ...animatedScale },
            { ...animatedTranslate }
        ]
    });
}

// Stack animation
// Imitate a deck/stack of cards (see #195)
// WARNING: The effect had to be visually inverted on Android because this OS doesn't honor the `zIndex`property
// This means that the item with the higher zIndex (and therefore the tap receiver) remains the one AFTER the currently active item
// The `elevation` property compensates for that only visually, which is not good enough
export function stackScrollInterpolator (index, carouselProps) {
    const range = [3, 2, 1, 0, -1];
    const inputRange = getInputRangeFromIndexes(range, index, carouselProps);
    const outputRange = range;

    return { inputRange, outputRange };
}
export function stackAnimatedStyles (index, animatedValue, carouselProps, cardOffset) {
    const sizeRef = carouselProps.vertical ? carouselProps.itemHeight : carouselProps.itemWidth;
    const translateProp = carouselProps.vertical ? 'translateY' : 'translateX';

    const card1Scale = 0.9;
    const card2Scale = 0.8;

    cardOffset = !cardOffset && cardOffset !== 0 ? 18 : cardOffset;

    const getTranslateFromScale = (cardIndex, scale) => {
        const centerFactor = 1 / scale * cardIndex;
        const centeredPosition = -Math.round(sizeRef * centerFactor);
        const edgeAlignment = Math.round((sizeRef - (sizeRef * scale)) / 2);
        const offset = Math.round(cardOffset * Math.abs(cardIndex) / scale);

        return centeredPosition + edgeAlignment + offset;
    };

    const opacityOutputRange = carouselProps.inactiveSlideOpacity === 1 ? [1, 1, 1, 0] : [1, 0.75, 0.5, 0];

    return Styles.createAnimatedViewStyle({
        zIndex: carouselProps.data.length - index,
        opacity: Animated.interpolate(animatedValue,
          [0, 1, 2, 3],
          opacityOutputRange
        ),
        transform: [{
            scale: Animated.interpolate(animatedValue,
              [-1, 0, 1, 2],
              [card1Scale, 1, card1Scale, card2Scale]
            )
        }, {
            [translateProp]: Animated.interpolate(animatedValue,
              [-1, 0, 1, 2, 3],
              [
                -sizeRef * 0.5,
                0,
                getTranslateFromScale(1, card1Scale),
                getTranslateFromScale(2, card2Scale),
                getTranslateFromScale(3, card2Scale)
              ]
            )
        }]
    });
}

// Tinder animation
// Imitate the popular Tinder layout
// WARNING: The effect had to be visually inverted on Android because this OS doesn't honor the `zIndex`property
// This means that the item with the higher zIndex (and therefore the tap receiver) remains the one AFTER the currently active item
// The `elevation` property compensates for that only visually, which is not good enough
export function tinderScrollInterpolator (index, carouselProps) {
    const range = [3, 2, 1, 0, -1];
    const inputRange = getInputRangeFromIndexes(range, index, carouselProps);
    const outputRange = range;

    return { inputRange, outputRange };
}
export function tinderAnimatedStyles (index, animatedValue, carouselProps, cardOffset) {
    const sizeRef = carouselProps.vertical ? carouselProps.itemHeight : carouselProps.itemWidth;
    const mainTranslateProp = carouselProps.vertical ? 'translateY' : 'translateX';
    const secondaryTranslateProp = carouselProps.vertical ? 'translateX' : 'translateY';

    const card1Scale = 0.96;
    const card2Scale = 0.92;
    const card3Scale = 0.88;

    const peekingCardsOpacity = 1;

    cardOffset = !cardOffset && cardOffset !== 0 ? 9 : cardOffset;

    const getMainTranslateFromScale = (cardIndex, scale) => {
        const centerFactor = 1 / scale * cardIndex;
        return -Math.round(sizeRef * centerFactor);
    };

    const getSecondaryTranslateFromScale = (cardIndex, scale) => {
        return Math.round(cardOffset * Math.abs(cardIndex) / scale);
    };

    return Styles.createAnimatedViewStyle({
        zIndex: carouselProps.data.length - index,
        opacity: Animated.interpolate(animatedValue,
          [-1, 0, 1, 2, 3],
          [0, 1, peekingCardsOpacity, peekingCardsOpacity, 0]
        ),
        transform: [{
            scale: Animated.interpolate(animatedValue,
              [0, 1, 2, 3],
              [1, card1Scale, card2Scale, card3Scale]
            )
        }, {
            rotate: Animated.interpolate(animatedValue,
              [-1, 0],
              ['-22deg', '0deg']
            )
        }, {
            [mainTranslateProp]: Animated.interpolate(animatedValue,
              [-1, 0, 1, 2, 3],
              [
                -sizeRef * 1.1,
                0,
                getMainTranslateFromScale(1, card1Scale),
                getMainTranslateFromScale(2, card2Scale),
                getMainTranslateFromScale(3, card3Scale)
              ]
            )
        }, {
            [secondaryTranslateProp]: Animated.interpolate(animatedValue,
              [0, 1, 2, 3],
              [
                0,
                getSecondaryTranslateFromScale(1, card1Scale),
                getSecondaryTranslateFromScale(2, card2Scale),
                getSecondaryTranslateFromScale(3, card3Scale)
              ]
            )
        }]
    });
}
