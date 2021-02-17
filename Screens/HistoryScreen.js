import React, { Component } from 'react';
import { 
    ActivityIndicator, 
    StyleSheet, 
    SafeAreaView, 
    ScrollView, 
    View, 
} from 'react-native';
import {
    Text,
    Headline,
    Paragraph
} from '../Components';

import { loadTrainings } from '../Store'; 

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#333',
    },
  })

class HistoryScreenItem extends Component {
    render () {
      const {
              date, 
              type, 
              totalRepetitions,
              score,
              timeNeeded 
            } = this.props; 
      return (
        <View>
          <Paragraph>{date}</Paragraph>
          <Paragraph>{type}</Paragraph>
          <Paragraph>{totalRepetitions}</Paragraph>
          <Paragraph>{score}</Paragraph>
          <Paragraph>{timeNeeded}</Paragraph>
        </View>
      ); 
    }
  
  }

export default class HistoryScreen extends Component {

    state = {
      history: null 
    }
  
    constructor (...args) {
          super(...args); 
      const [props] = args; 
      this.navigation = props.navigation;
      const history = loadTrainings();
      history.then(
        (history) => this.setState({history}) 
      ); 
    }
    
    render () {
      return (
        <SafeAreaView style={styles.container}>
          <ScrollView>
            <Headline>Deine History</Headline>
            {
              this.state.history == null ? 
                <ActivityIndicator /> : 
                this.state.history.map(
                  (item, key) => (
                    <HistoryScreenItem {...item.toObject()} key={key}/>
                  )
                )
            }
          </ScrollView>
        </SafeAreaView>
      );
    }
  }