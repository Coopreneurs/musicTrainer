import React, { Component } from 'react';
import { 
    ActivityIndicator, 
    View, 
    StyleSheet,
} from 'react-native';
import {
  Text, 
  Headline,
  Tile
} from '../Components'
import { TrainingData } from '../Store'; 
import { NOTES, INTERVALS } from '../MusicTheory'; 

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
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  option: {
    borderWidth: 1,
    margin: 10,

  },
})

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
        }
      }
    setup = () => (
      <>
        <Headline>
          Welches Interval möchtest Du trainieren? 🤔
        </Headline>
        {
          INTERVALS.map(
            (interval, key) => (
              <Tile onPress={() => (this.setState({interval}))} key={key}>
                <Text>
                  {interval.label}
                </Text>
              </Tile>
            )
          )
        }
      </>
    )
    checkResult = (item, choice) => {
      if (item == NOTES[(choice + this.state.interval.value) % 12]) {
        this.setState({
          score: this.state.score + 1,
          repetitions: this.state.repetitions + 1
        })
        // visual feedback 
      } else {
        this.setState({
          repetitions: this.state.repetitions + 1
        })
      }
    }
  
    executeTraining = () => {
      if (this.state.repetitions == this.state.totalRepetitions) {
        const type = 'interval', 
              { 
                startTime, 
                totalRepetitions,
                score
              } = this.state, 
              endTime = new Date, 
              duration = endTime - startTime; 
        this.props.saveHistory(
          new TrainingData(
            startTime, 
            type,
            totalRepetitions,
            score,
            duration
          )
        );
        return(
          <ActivityIndicator />
        ) 
      } else {
        let choice = Math.floor(Math.random() * 13);
        return (
          <>
            <Headline style={styles.headline}>
              Was ist die {this.state.interval.label} von {NOTES[choice]}?
            </Headline>
            <View style={styles.question}>
              <Text style={styles.question}>
                {NOTES[choice]} ({this.state.interval.value}) {'\u21E8 ?'}
              </Text>
            </View>
            <View style={styles.options}>
              {
                NOTES.map(
                  (note, key) => (
                    <Tile style={styles.option} onPress={() => (this.checkResult(note, choice))} key={key}>
                      <Text>
                        {note}
                      </Text>
                    </Tile>
                  )
                )
              }
            </View>
          </>
        ) 
      }
    };
    render () {
      return (
        this.state.interval == null?
          this.setup()
        :
          this.executeTraining()
      )
    }
  }