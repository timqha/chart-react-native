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
} from 'react-native';
import Svg, {
  Path, Circle, G, Line, Rect, Text, LinearGradient, Defs, Stop
} from 'react-native-svg';

import * as shape from 'd3-shape';
import * as scale from 'd3-scale';


const COLORS = {
  BG: '#595cab',
  BASE_LINE: '#cf46a0',
  SHADOW: '#6f4ea4',
  DARK_LINE: '#534895',
  WHITE: '#eeecf4',
  PINK: '#ece8f3',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: COLORS.PINK,
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
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderMove: (evt, gs) => {
        this.setState(() => ({
          itemIndex: Math.ceil(gs.moveX / this.linspace)
        }));
      },
      onPanResponderTerminationRequest: () => true,
      onShouldBlockNativeResponder: () => true
    });
  }

  createPaths = ({ data, x, y }) => {
    const line = shape.line()
      .x(d => x(d.x))
      .y(d => y(d.y))
      .defined(item => typeof item.y === 'number')
      // for linear curveLinear
      .curve(shape.curveMonotoneX)(data);
    return {
      path: line,
      line,
    };
  }

  xAccessor = ({ index }) => index;

  yAccessor = ({ item }) => item;

  render() {
    const minY = 80;
    const step = 10;
    const data = [minY, 100, 120, 130, 120, minY];

    this.linspace = width / data.length;
    const offset = 5;

    const maxOfDataY = Math.max.apply(null, data) + offset + 20;
    const maxOfDataX = data.length - 1;

    const mappedData = data.map((item, index) => ({
      y: this.yAccessor({ item, index }),
      x: this.xAccessor({ item, index }),
    }));


    // invert range to support svg coordinate system
    const y = scale.scaleLinear()
      .domain([minY, maxOfDataY])
      .range([height / 2, 0])
      .clamp(false);

    const x = scale.scaleLinear()
      .domain([0, maxOfDataX])
      .range([20, width - 20])
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
      heigth: height / 2,
      ...paths,
    };


    const Tooltip = (tooltipData) => {
      const { itemIndex } = this.state;

      if (itemIndex && itemIndex < data.length - 1) {
        return (
          <G
            x={tooltipData.x(itemIndex) - (75 / 2)}
            key="tooltip"
            onPress={() => console.log('tooltip clicked')}
          >
            <G y={70}>
              <Rect
                height={40}
                width={75}
                stroke="grey"
                fill="white"
                ry={10}
                rx={10}
              />
              <Text
                x={75 / 2}
                dy={20}
                alignmentBaseline="middle"
                textAnchor="middle"
                stroke="rgb(134, 65, 244)"
              >
                { `${data[itemIndex]} KG` }
              </Text>
            </G>
            <G x={75 / 2}>
              <Line
                y1={70 + 40}
                y2={tooltipData.y(data[itemIndex])}
                stroke="grey"
                strokeWidth={2}
              />
              <Circle
                cy={tooltipData.y(data[itemIndex])}
                r={6}
                stroke="rgb(134, 65, 244)"
                strokeWidth={2}
                fill="white"
              />
            </G>
          </G>
        );
      }
      return null;

    };

    const XAxisGrid = () => {

      const blockWidth = (width) / 20;
      return (
        [...Array(20)].map((item, i) => (
          <G y={0} x={i * blockWidth} key={`${i * blockWidth}`}>
            <Line
              y1={height / 2}
              stroke="#ccc"
              strokeOpacity={0.1}
              strokeWidth={1}
            />
          </G>
        )));
    };
    const YAxisGrid = () => {

      const blockWidth = (height) / 20;
      return (
        [...Array(20)].map((item, i) => (
          <G y={i * blockWidth} x={0} key={`${i * blockWidth}`}>
            <Line
              x1={0}
              x2={width}
              stroke="#ccc"
              strokeOpacity={0.1}
              strokeWidth={1}
            />
          </G>

        )));
    };

    const Xaxis = (xData) => {

      if (xData && xData.weeks && xData.weeks.length && xData.weeks.length === xData.data.length) {
        return (
          xData.data.map((item, i) => (
            <G
              x={xData.x(i)}
              y={height / 2.5}
              key={`tooltip-xaxis${i * 2}`}
              onPress={() => console.log('tooltip clicked')}
            >
              <G y={10}>
                <Text
                  x={5}
                  dy={10}
                  alignmentBaseline="middle"
                  textAnchor="middle"
                  stroke={COLORS.WHITE}
                >
                  { `${xData.weeks[i].toUpperCase()}` }
                </Text>
              </G>
            </G>
          )));
      }
      return null;

    };

    const Yaxis = (yData) => {
      const min = minY;
      const max = Math.max.apply(null, yData.data);
      const yaxisLegend = [];
      for (let i = min + step; i <= max; i += step) {
        yaxisLegend.push(i + step);
      }
      if (yData && yData.data && yData.data.length) {
        return (
          yaxisLegend.map((item, i) => (
            <G
              x={30}
              y={yData.y(item)}
              key={`yaxis${i * 2}`}
            >
              <G y={0}>
                <Text
                  x={0}
                  dy={0}
                  alignmentBaseline="middle"
                  textAnchor="middle"
                  stroke={COLORS.WHITE}
                >
                  { `${item} KG` }
                </Text>
              </G>
            </G>
          )));
      }
      return null;

    };

    const BackgroundGradient = () => (
      <G>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="170" y2="170">
            <Stop offset="0" stopColor="#585eab" stopOpacity="0" />
            <Stop offset="1" stopColor="#6246a4" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect
          width={width}
          height={height / 2}
          fill="url(#grad)"
        />
      </G>
    );
    const basePath = {
      d: paths.path,
      fill: 'transparent',
      strokeCap: 'square',
      strokeJoin: 'round'
    };

    const lines = {
      shadow: {
        key: 'shadow-1',
        stroke: COLORS.SHADOW,
        strokeOpacity: 0.45,
        strokeWidth: 20,
        ...basePath
      },
      dark: {
        key: "lineDark",
        stroke: COLORS.DARK_LINE,
        transform: { scaleY: 0.7, translateY: 110 },
        strokeWidth: 14,
        strokeOpacity: 0.5,
        ...basePath
      },
      base: {
        key: 'baseLine',
        stroke: COLORS.BASE_LINE,
        strokeWidth: 4,
        ...basePath
      },
    };

    return (
      <View style={styles.container}>
        <Svg
          width={width}
          height={height / 2.2}
          style={{ backgroundColor: COLORS.BG }}
          {...this._panResponder.panHandlers}
        >

          <BackgroundGradient />
          <XAxisGrid />
          <YAxisGrid />

          {
            Object.keys(lines).map(item => <Path {...lines[item]} />)
          }
          <Yaxis {...extraProps} />
          <Xaxis {...{ weeks: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], ...extraProps }} />

          <Tooltip {...extraProps} />
        </Svg>
      </View>
    );
  }
}
