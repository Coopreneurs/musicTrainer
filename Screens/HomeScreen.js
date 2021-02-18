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
    Tile
} from '../Components';
import TRAININGS from '../Trainings'; 

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#333',
    }
  })
  

class TrainingTile extends Component {

    goToTraining = () => (
        this.props.navigation.navigate(
            'Training', 
            { 
                name: this.props.name, 
                type: this.props.type 
            }
        )
    );

    render () {
        return ( 
            <Tile onPress={this.goToTraining}>
                <Text>
                    {this.props.name}
                </Text>
            </Tile>
        ) 
    }
}

export default class HomeScreen extends Component {

    constructor (...args) {
        super(...args); 
        const [props] = args; 
        console.log(props)
        this.navigation = props.navigation; 
        this.goToHistory = () => this.navigation.navigate('History'); 
    }

    render () {
        return (
            <SafeAreaView >
                <ScrollView>
                    <Headline>Wähle eine Übung</Headline>
                    {
                        TRAININGS.map(
                            ({label, type}, key) => (<TrainingTile name={label} type={type} key={key} navigation={this.navigation} />)
                        )
                    }
                    <View
                        style={{
                        borderBottomColor: '#fff',
                        borderBottomWidth: 1,
                        margin: 20,
                        }}
                    />
                    <Button 
                        title="History anzeigen" 
                        accessibilityLabel="Zeigt die Übungshistorie" 
                        onPress={this.goToHistory} 
                    />
                </ScrollView>
            </SafeAreaView>
        );
    }
}