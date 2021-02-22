import React, { Component } from 'react';
import { 
    ActivityIndicator, 
    Button, 
    StyleSheet, 
    SafeAreaView, 
    Pressable, 
    ScrollView, 
    View, 
    Alert 
} from 'react-native';
import {
    Text,
    Headline, 
    Tile,
    Paragraph,
    Divider
} from '../Components';
  
import TRAININGS from '../Trainings';  

const REPITITION_OPTIONS = [5, 10, 20, 30, 50]; 


import { saveTraining, } from '../Store'; 

const styles = StyleSheet.create({
  resultsContainer: {
    alignItems: 'center'
  },
  resultsItem: {
    margin: 10,
    alignItems: 'center',
  }
})

const Row = (props) => (
  <View style={{flexDirection: 'row'}}>
    {props.children}
  </View>
)

const TrainingResults = (props) => (
  <View style={styles.resultsContainer}>
    <Headline>
      Übung abgeschlossen
    </Headline>
    <View style={styles.resultsItem}>
      <Text bold>Wiederholungen: </Text>
      <Text>{props.totalRepetitions}</Text>
    </View>
    <View style={styles.resultsItem}>
      <Text bold>Score: </Text>
      <Text>{props.score}</Text>
    </View>
    <View style={styles.resultsItem}>
      <Text bold>Dauer: </Text>
      <Text>{props.duration} s</Text>
    </View>
    <Divider/>
    <Button 
        title="Schließen" 
        accessibilityLabel="Schließt den Screen" 
        onPress={() => props.navigation.navigate('Home')} 
    />
  </View>
)


export default class TrainingScreen extends Component {
    constructor (...args) {
        super(...args); 
        const [props] = args; 
        this.navigation = props.navigation; 
        this.route = props.route; 
        this.state = {
            totalRepetitions: null, 
            trainingType: props.route.params.type
        }
    }
  
    promptRepetitions = () => (
      <>
        <Headline>Willkommen zum {this.route.params.name} 🎉</Headline>
        <Paragraph>Wie viele Wiederholungen?</Paragraph>
        {
          REPITITION_OPTIONS.map(
            (totalRepetitions, key)=> (
                <Tile onPress={() => (this.setState({totalRepetitions}))} key={key}>
                    <Text>
                        {totalRepetitions}
                    </Text>
                </Tile>
            )
          )
        }
      </>
    )
    initTraining = () => {
      if (this.route.params.type) {
        const Training = TRAININGS.find(
          training => training.type === this.route.params.type
        )
        return <Training 
                  saveHistory={this.saveHistory.bind(this)} 
                  totalRepetitions={this.state.totalRepetitions} />
      } else {
        throw new Error("Training unknown")
      }
    }
    saveHistory = async (result) => { 
      await saveTraining(result); 
      this.setState({
        showResults: true,
        score: result.score,
        totalRepetitions: result.totalRepetitions,
        duration: result.duration
      });
    }
    
    render() {
      return (
        <SafeAreaView>
            <ScrollView>
                {this.state.totalRepetitions == null? 
                  this.promptRepetitions()
                : !this.state.showResults?
                  this.initTraining() 
                  :
                  <TrainingResults 
                    navigation={this.navigation} 
                    totalRepetitions={this.state.totalRepetitions} 
                    score={this.state.score} 
                    duration={this.state.duration}/>
                }
            </ScrollView>
        </SafeAreaView>
      )
    };
  };