let React = require('react');
import { View, Animated } from 'reactxp';
var PropTypes = require('prop-types');
import styles from './Pagination.style';

export default class PaginationDot extends React.PureComponent {

    static propTypes = {
        inactiveOpacity: PropTypes.number.isRequired,
        inactiveScale: PropTypes.number.isRequired,
        active: PropTypes.bool,
        activeOpacity: PropTypes.number,
        carouselRef: PropTypes.object,
        color: PropTypes.string,
        inactiveColor: PropTypes.string,
        index: PropTypes.number,
        tappable: PropTypes.bool
    };

    constructor (props) {
        super(props);
        this.state = {
            animColor: Animated.createValue(0),
            animOpacity: Animated.createValue(0),
            animTransform: Animated.createValue(0)
        };
    }

    componentDidMount () {
        if (this.props.active) {
            this._animate(1);
        }
    }

    componentDidUpdate (prevProps) {
        if (prevProps.active !== this.props.active) {
            this._animate(this.props.active ? 1 : 0);
        }
    }

    _animate (toValue = 0) {
        const { animColor, animOpacity, animTransform } = this.state;

        const commonProperties = {
            toValue,
            duration: 250,
            isInteraction: false,
            useNativeDriver: !this._shouldAnimateColor
        };

        let animations = [
            Animated.timing(animOpacity, {
                easing: Animated.Easing.linear,
                ...commonProperties
            }),
            Animated.timing(animTransform, {
                easing: Animated.Easing.linear,
                ...commonProperties
            })
        ];

        if (this._shouldAnimateColor) {
            animations.push(Animated.timing(animColor, {
                easing: Animated.Easing.linear,
                ...commonProperties
            }));
        }

        Animated.parallel(animations).start();
    }

    get _shouldAnimateColor () {
        const { color, inactiveColor } = this.props;
        return color && inactiveColor;
    }

    render () {
        const { animColor, animOpacity, animTransform } = this.state;
        const {
            active,
            activeOpacity,
            carouselRef,
            color,
            containerStyle,
            inactiveColor,
            inactiveStyle,
            inactiveOpacity,
            inactiveScale,
            index,
            style,
            tappable
        } = this.props;

        const animatedStyle = {
            opacity: animOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: [inactiveOpacity, 1]
            }),
            transform: [{
                scale: animTransform.interpolate({
                    inputRange: [0, 1],
                    outputRange: [inactiveScale, 1]
                })
            }]
        };
        const animatedColor = this._shouldAnimateColor ? {
            backgroundColor: animColor.interpolate({
                inputRange: [0, 1],
                outputRange: [inactiveColor, color]
            })
        } : {};

        const dotContainerStyle = [
            styles.sliderPaginationDotContainer,
            containerStyle || {}
        ];

        const dotStyle = [
            styles.sliderPaginationDot,
            style || {},
            (!active && inactiveStyle) || {},
            animatedStyle,
            animatedColor
        ];

        const onPress = tappable ? () => {
            carouselRef && carouselRef._snapToItem(carouselRef._getPositionIndex(index));
        } : undefined;

        return (
            <View
              accessible={false}
              style={dotContainerStyle}
              onPress={onPress}
            >
                <Animated.View style={dotStyle} />
            </View>
        );
    }
}
