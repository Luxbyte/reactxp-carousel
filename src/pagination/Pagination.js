let React = require('react');
import { International, View } from 'reactxp';
var PropTypes = require('prop-types');
import PaginationDot from './PaginationDot';
import styles from './Pagination.style';

const IS_RTL = International.isRTL();

export class Pagination extends React.PureComponent {

    static propTypes = {
        activeDotIndex: PropTypes.number.isRequired,
        dotsLength: PropTypes.number.isRequired,
        activeOpacity: PropTypes.number,
        carouselRef: PropTypes.object,
        dotColor: PropTypes.string,
        dotElement: PropTypes.element,
        inactiveDotColor: PropTypes.string,
        inactiveDotElement: PropTypes.element,
        inactiveDotOpacity: PropTypes.number,
        inactiveDotScale: PropTypes.number,
        renderDots: PropTypes.func,
        tappableDots: PropTypes.bool,
        vertical: PropTypes.bool,
        accessibilityLabel: PropTypes.string
    };

    static defaultProps = {
        inactiveDotOpacity: 0.5,
        inactiveDotScale: 0.5,
        tappableDots: false,
        vertical: false
    }

    constructor (props) {
        super(props);

        // Warnings
        if ((props.dotColor && !props.inactiveDotColor) || (!props.dotColor && props.inactiveDotColor)) {
            console.warn(
                'react-native-snap-carousel | Pagination: ' +
                'You need to specify both `dotColor` and `inactiveDotColor`'
            );
        }
        if ((props.dotElement && !props.inactiveDotElement) || (!props.dotElement && props.inactiveDotElement)) {
            console.warn(
                'react-native-snap-carousel | Pagination: ' +
                'You need to specify both `dotElement` and `inactiveDotElement`'
            );
        }
    }

    _needsRTLAdaptations () {
        const { vertical } = this.props;
        return IS_RTL && !vertical;
    }

    get _activeDotIndex () {
        const { activeDotIndex, dotsLength } = this.props;
        return this._needsRTLAdaptations() ? dotsLength - activeDotIndex - 1 : activeDotIndex;
    }

    get dots () {
        const {
            activeOpacity,
            carouselRef,
            dotsLength,
            dotColor,
            dotContainerStyle,
            dotElement,
            dotStyle,
            inactiveDotColor,
            inactiveDotElement,
            inactiveDotOpacity,
            inactiveDotScale,
            inactiveDotStyle,
            renderDots,
            tappableDots
        } = this.props;

        if (renderDots) {
            return renderDots(this._activeDotIndex, dotsLength, this);
        }

        const DefaultDot = <PaginationDot
          carouselRef={carouselRef}
          tappable={tappableDots && typeof carouselRef !== 'undefined'}
          activeOpacity={activeOpacity}
          color={dotColor}
          containerStyle={dotContainerStyle}
          style={dotStyle}
          inactiveColor={inactiveDotColor}
          inactiveOpacity={inactiveDotOpacity}
          inactiveScale={inactiveDotScale}
          inactiveStyle={inactiveDotStyle}
        />;

        let dots = [];

        for (let i = 0; i < dotsLength; i++) {
            const isActive = i === this._activeDotIndex;
            dots.push(React.cloneElement(
                (isActive ? dotElement : inactiveDotElement) || DefaultDot,
                {
                    key: `pagination-dot-${i}`,
                    active: i === this._activeDotIndex,
                    index: i
                }
            ));
        }

        return dots;
    }

    render () {
        const { dotsLength, containerStyle, vertical, accessibilityLabel } = this.props;

        if (!dotsLength || dotsLength < 2) {
            return false;
        }

        const style = [
            styles.sliderPagination,
            { flexDirection: vertical ?
                'column' :
                (this._needsRTLAdaptations() ? 'row-reverse' : 'row')
            },
            containerStyle || {}
        ];

        return (
            <View
              pointerEvents={'box-none'}
              style={style}
              accessible={!!accessibilityLabel}
              accessibilityLabel={accessibilityLabel}
            >
                { this.dots }
            </View>
        );
    }
}
