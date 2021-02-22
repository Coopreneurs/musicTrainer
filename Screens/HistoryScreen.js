import React, { Component } from 'react';
import { 
    ActivityIndicator, 
    StyleSheet, 
    SafeAreaView, 
    ScrollView, 
    View,
    Button, 
} from 'react-native';
import {
    Text,
    Headline,
    Paragraph,
    Divider
} from '../Components';

import { clearTrainings } from '../Store';

import { loadTrainings } from '../Store'; 
const styles = StyleSheet.create({
  historyItem: {
    backgroundColor: 'white',
    alignItems: 'center',
    opacity: 0.7,
    marginVertical: 20,
    padding: 20,
    color: '#000',
    flexDirection: 'row',
  }
})
class HistoryScreenItem extends Component {
    render () {
      const {
              date, 
              type, 
              totalRepetitions,
              score,
              duration 
            } = this.props; 
      return (
        <View style={styles.historyItem}>
          <View style={{flex: 1, justifyContent:'center'}}>
            <Paragraph bold color={styles.historyItem.color}>{new Intl.DateTimeFormat('de-DE', {month: 'short', day: '2-digit', year: '2-digit'}).format(date)}</Paragraph>
            <Paragraph color={styles.historyItem.color}>{`${new Intl.DateTimeFormat('de-DE', {hour: '2-digit', minute: '2-digit'}).format(date)} Uhr`}</Paragraph>
          </View>
          <Divider vertical color="#000"/>
          <View style={{flex: 2}}>
            <Paragraph bold color={styles.historyItem.color}>{type == 'interval'? 'Interval Training':null}</Paragraph>
            <Paragraph color={styles.historyItem.color}>Score: {Math.round((score / totalRepetitions) * 100)} %</Paragraph>
            <Paragraph color={styles.historyItem.color}>ø Antwortzeit: {duration} s</Paragraph>
          </View>
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
        <SafeAreaView>
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
            <Button 
              title="History löschen" 
              accessibilityLabel="Löscht die Übungshistorie" 
              onPress={() => clearTrainings(() => this.setState({history:[]}))} 
            />
          </ScrollView>
        </SafeAreaView>
      );
    }
  }