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
    Divider
} from '../Components';
import TRAININGS from '../Trainings'; 
  

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
                    <Divider/>
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