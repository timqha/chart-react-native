/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Dimensions
} from 'react-native';
import { LineChart as LNKit } from 'react-native-chart-kit';
import PureChart from 'react-native-pure-chart';
import LineChartDemo from "react-native-responsive-linechart";
import {
  LineChart,
  Grid,
  Path,
  YAxis
} from 'react-native-svg-charts';
import {
  Circle,
  G,
  Line,
  Text,
  Rect
} from 'react-native-svg';
/* eslint-disable-next-line */
import * as shape from 'd3-shape';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});


type Props = {};
export default class App extends Component<Props> {
  componentDidMount() {

  }

  render() {
    const data = [50, 70, 100, 138, 100, 70, 50];

    const Shadow = ({ line }) => (
      <Path
        key="shadow"
        y={2}
        d={line}
        fill="none"
        strokeWidth={16}
        stroke="rgba(134, 65, 244, 0.2)"
      />
    );


    const Tooltip = ({ x, y }) => {
      const position = 75;
      const itemIndex = 2;
      return (
        <G
          x={x(itemIndex) - (position / 2)}
          key="tooltip"
          onPress={() => console.log('tooltip clicked')}
        >
          <G y={50}>
            <Rect
              height={40}
              width={75}
              stroke="grey"
              fill="white"
              ry={10}
              rx={10}
            />
            <Text
              x={position / 2}
              dy={20}
              alignmentBaseline="middle"
              textAnchor="middle"
              stroke="rgb(134, 65, 244)"
            >
              { `${data[itemIndex]} KG` }
            </Text>
          </G>
          <G x={position / 2}>
            <Line
              y1={50 + 40}
              y2={y(data[itemIndex])}
              stroke="grey"
              strokeWidth={2}
            />
            <Circle
              cy={y(data[itemIndex])}
              r={6}
              stroke="rgb(134, 65, 244)"
              strokeWidth={2}
              fill="white"
            />
          </G>
        </G>
      );
    };
    return (
      <View style={styles.container}>
        <LNKit
          data={{
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [{
              data: [
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100
              ]
            }]
          }}
          width={Dimensions.get('window').width} // from react-native
          height={220}
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />

        <PureChart data={[30, 200, 170, 250, 10]} type="line" />

        <LineChartDemo
          style={{ flex: 1 }}
          config={{
            line: {
              strokeWidth: 1,
              strokeColor: "#216D99"
            },
            area: {
              gradientFrom: "#2e86de",
              gradientFromOpacity: 1,
              gradientTo: "#87D3FF",
              gradientToOpacity: 1
            },
            yAxis: {
              labelColor: "#c8d6e5"
            },
            grid: {
              strokeColor: "#c8d6e5",
              stepSize: 30
            },
            insetY: 10,
            insetX: 10,
            interpolation: "spline",
            backgroundColor: "#fff"
          }}
          data={[-10, -15, 40, 19, 32, 15, 52, 55, 20, 60, 78, 42, 56]}
        />

        <YAxis
          data={data}
          style={{ marginLeft: 10, marginBottom: -80, height: '45%' }}
          contentInset={{ top: 10, bottom: 10 }}
          svg={{ fontSize: 10, fill: 'grey' }}
        />
        <LineChart

          style={{ height: '55%', width: Dimensions.get('window').width }}
          data={data}
          svg={{ stroke: 'rgb(134, 65, 244)', strokeWidth: 3, strokeOpacity: 0.9 }}
          contentInset={{ top: 100, bottom: 10 }}
          yAccessor={({ item }) => item}
          xAccessor={({ index }) => index}
          animate
          showGrid
          ticks={2}
          curve={shape.curveNatural}
        >
          <Grid />
          <Shadow />
          <Tooltip />
        </LineChart>

      </View>
    );
  }
}
