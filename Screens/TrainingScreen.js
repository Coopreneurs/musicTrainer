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
    Paragraph
} from '../Components';
  
import TRAININGS from '../Trainings';  

const REPITITION_OPTIONS = [5, 10, 20, 30, 50]; 


import { saveTraining, } from '../Store'; 



const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#333',
      height: 100
    }
  })


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
        <Headline style={styles.headline}>Willkommen zum {this.route.params.name} 🎉</Headline>
        <Paragraph style={styles.paragraph}>Wie viele Wiederholungen?</Paragraph>
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
        return <Training saveHistory={this.saveHistory} totalRepetitions={this.state.totalRepetitions} />
      } else {
        throw "Training unknown"
      }
    }
    saveHistory = async (result) => {
      //this.setState({savingTraining: true}); 
      await saveTraining(result); 
      //this.setState({savingTraining: false}); 
      this.navigation.navigate('Home'); 
    }
    
    render() {
      return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {this.state.totalRepetitions == null? 
                this.promptRepetitions()
                : this.initTraining()
                }
            </ScrollView>
        </SafeAreaView>
      )
    };
  };