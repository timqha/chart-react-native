/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  PanResponder,
  ART,
  Animated
} from 'react-native';
import Svg, { Path, Circle, G, Line, Rect, Text } from 'react-native-svg';

import * as shape from 'd3-shape';
import * as scale from 'd3-scale';


const COLORS = {
  BG: '#595cab',
  BASE_LINE: '#cf46a0',
  SHADOW: '#7151a7',
  DARK_LINE: '#534895',
  WHITE: '#eeecf4',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: COLORS.WHITE,
  },
});
const { width, height } = Dimensions.get('window');

type Props = {};
export default class App extends Component<Props> {

  state = {
    itemIndex: 1
  }

  linspace = 0;

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      
      onPanResponderMove: (evt, gs) => {
        this.setState(() => ({
          itemIndex: Math.ceil(gs.moveX / this.linspace)
        }));
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming
        // the JS responder. Returns true by default. Is currently only supported on
        // android.
        return true;
      }
    })
  }
  
  createPaths = ({ data, x, y }) => {
    const line = shape.line()
      .x(d => x(d.x))
      .y(d => y(d.y))
      .defined(item => typeof item.y === 'number')
      // for linear curveLinear
      .curve(shape.curveNatural)(data);
    return {
      path: line,
      line,
    };
  }

  xAccessor = ({ index }) => index;

  yAccessor = ({ item }) => item;


  render() {

    const data = [50, 60, 70, 80, 90, 110, 50, 40];
    this.linspace = width / data.length;
    const offset = 5;
    const maxOfDataY = 110 + offset + 100;
    const maxOfDataX = data.length-1;

    const {
      gridMax,
      gridMin,
      clampX,
      clampY,
      svg,
    } = this.props;


    const mappedData = data.map((item, index) => ({
      y: this.yAccessor({ item, index }),
      x: this.xAccessor({ item, index }),
    }));


    // invert range to support svg coordinate system
    const y = scale.scaleLinear()
      .domain([0, maxOfDataY])
      .range([height / 2, offset])
      .clamp(clampY);

    const x = scale.scaleLinear()
      .domain([0, maxOfDataX])
      .range([offset, width - 0])
      .clamp(false);

    const paths = this.createPaths({
      data: mappedData,
      x,
      y,
    });

    const extraProps = {
      x,
      y,
      data,

      width,
      height,
      ...paths,
  }


    const Tooltip = ({ x, y }) => {
      console.log(x(0))
      console.log(y(data[0]))
      const {itemIndex} = this.state;
      console.log('itemIndex', itemIndex);
      if (itemIndex && itemIndex < data.length - 1) {
        return (
        <G
            x={ x(itemIndex) - (75 / 2) }
            key={ 'tooltip' }
            onPress={ () => console.log('tooltip clicked') }
        >
            <G y={ 50 }>
                <Rect
                    height={ 40 }
                    width={ 75 }
                    stroke={ 'grey' }
                    fill={ 'white' }
                    ry={ 10 }
                    rx={ 10 }
                />
                <Text
                    x={ 75 / 2 }
                    dy={ 20 }
                    alignmentBaseline={ 'middle' }
                    textAnchor={ 'middle' }
                    stroke={ 'rgb(134, 65, 244)' }
                >
                    { `${data[itemIndex]} KG` }
                </Text>
            </G>
            <G x={ 75 / 2 }>
                <Line
                    y1={ 50 + 40 }
                    y2={ y(data[ itemIndex ]) }
                    stroke={ 'grey' }
                    strokeWidth={ 2 }
                />
                <Circle
                    cy={ y(data[ itemIndex ]) }
                    r={ 6 }
                    stroke={ 'rgb(134, 65, 244)' }
                    strokeWidth={ 2 }
                    fill={ 'white' }
                />
            </G>
        </G>
    )
      } else {
        return null
      }
}

    return (
      <View style={styles.container}>
        <Svg
          width={width}
          height={height/ 2}
          style={{backgroundColor: COLORS.BG}}
          {...this._panResponder.panHandlers}
        >
          <Path
            d={paths.path}
            stroke={COLORS.BASE_LINE}
            fill={'transparent'}
            strokeWidth={5}
            strokeCap="square" // or round(default)/square
            strokeJoin="round" // or miter/round(default)
          />
          <Tooltip {...extraProps} />
        </Svg>
      </View>
    );
  }
}
