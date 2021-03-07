import React, { Component } from 'react';
import { 
    View, 
    StyleSheet,
    Animated
} from 'react-native';
import {
  Text, 
  Headline,
  Tile
} from '../Components'
import { TrainingData } from '../Store'; 
import { NOTES, INTERVALS } from '../MusicTheory'; 
import { showToast, Toaster } from '../Toaster';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
  question: {
    alignSelf: 'center',
    color: '#fff',
    fontSize: 32,
    lineHeight: 36,
    fontWeight: 'bold',
    margin: 20,
  },
  options: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  option: {
    borderWidth: 1,
    margin: 10,
    flexBasis: '25%'
  },
})

class IntervallPrompt extends Component {
  constructor (...args) {
    super(...args); 
    const [props] = args; 
    this.state = {
      x: new Animated.Value(0),
      opacity: new Animated.Value(1),
    }
    this.fadeOut = props.fadeOut.bind(this);
  }
  render () {
    return (
      <Animated.View style={{
          opacity: this.state.opacity, 
          transform: [{translateX: this.state.x}]
        }}>
        <Headline>
          Welches Interval möchtest Du trainieren? 🤔
        </Headline>
        {
          INTERVALS.map(
            (interval, key) => (
              <Tile onPress={() => {
                this.fadeOut(() => this.props.updateInterval(interval));
                }} key={key}>
                <Text>
                  {interval.label}
                </Text>
              </Tile>
            )
          )
        }
        
      </Animated.View>
    )
  }
}

class IntervalTrainingRound extends Component {
  constructor (...args) {
    super(...args); 
    const [props] = args; 
    this.state = {
      x: new Animated.Value(0),
      successOpacity: 0,
      failureOpacity: 0
    }
    this.fadeOut = props.fadeOut.bind(this);
    this.fadeIn = props.fadeIn.bind(this);
  }

  checkResult = (item, choice) => {
    if (item == NOTES[(choice + this.props.interval.value) % 12]) {
      showToast({
        text: null, 
        type: Toaster.SUCCESS,
        duration: 50,
        callback: () => this.props.updateState(1)
      });
    } else {
      showToast({
        text: `Correct answer: ${NOTES[(choice + this.props.interval.value) % 12]}`, 
        type: Toaster.FAILURE,
        duration: 50,
        callback: () => this.props.updateState(0)
      });
    }
  }
  render() {
    return(
      <Animated.View>
        <Animated.View style={{opacity: this.state.opacity}}>
          <Headline style={styles.headline}>
            Was ist die {this.props.interval.label} von {NOTES[this.props.choice]}?
          </Headline>
        </Animated.View>
        <Animated.View style={[styles.question, {opacity: this.state.opacity, transform: [{translateX: this.state.x}]}]}>
          <Text style={styles.question}>
            {NOTES[this.props.choice]} ({this.props.interval.value}) {'\u21E8 ?'}
          </Text>
          <Text style={{opacity: this.state.successOpacity}}>
            Yeah.
          </Text>
        </Animated.View>
        <View style={styles.options}>
          {
            NOTES.map(
              (note, key) => (
                <Tile style={styles.option} onPress={() => (this.checkResult(note, this.props.choice))} key={key}>
                  <Text>
                    {note}
                  </Text>
                </Tile>
              )
            )
          }
        </View>
      </Animated.View>
    )
  }
}


export default class IntervalTraining extends Component {

  static label = 'Interval Training'; 
  static type = 'interval'; 

    constructor (...args) {
      super(...args); 
      const [props] = args; 
      this.state = {
        startTime: new Date,
        endTime: null,
        totalRepetitions: props.totalRepetitions,
        interval: null, 
        score: 0,
        repetitions: 0,
        choice: Math.floor(Math.random() * 11.9),
        x: new Animated.Value(-100),
        opacity: new Animated.Value(0),
      }
      this.updateInterval = this.updateInterval.bind(this);
      this.updateState = this.updateState.bind(this);
    }
    fadeIn() {
      Animated.timing(this.state.opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }).start();
      Animated.spring(this.state.x, {
        toValue: 0,
        useNativeDriver: true
      }).start();
    };
  
    fadeOut(callback) {
      Animated.timing(this.state.opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true
      }).start(callback);
    };

    updateInterval(interval) {
      this.setState({interval});
    }

    updateState(result) {
      this.setState({
        score: this.state.score + result,
        repetitions: this.state.repetitions + 1,
        choice: Math.floor(Math.random() * 11.9)
      })
    }
    render () {
      if (this.state.repetitions == this.state.totalRepetitions) {
        // Training complete. Saving...
        const type = this.constructor, 
              { 
                startTime, 
                totalRepetitions,
                score
              } = this.state, 
              endTime = new Date, 
              duration = (endTime.getTime() - startTime.getTime())/1000;
        this.props.saveHistory(
          new TrainingData(
            startTime, 
            type,
            totalRepetitions,
            score,
            duration
          )
        );
        return null;
      } else {
        return (
          this.state.interval == null?
            <IntervallPrompt 
              fadeOut={this.fadeOut} 
              updateInterval={this.updateInterval}
            />
          : 
            <IntervalTrainingRound 
              interval={this.state.interval} 
              fadeOut={this.fadeOut} 
              fadeIn={this.fadeIn} 
              choice={this.state.choice} 
              updateState={this.updateState}
            />
        )
      }
    }
  }