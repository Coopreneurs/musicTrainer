import React, { Component } from 'react';
import { 
    StyleSheet,
} from 'react-native';
import {
    Text
} from '.';

const styles = StyleSheet.create({
  headline: {
    alignSelf: 'center',
    color: '#fff',
    fontSize: 24,
    lineHeight: 28,
    fontWeight: 'bold',
    marginTop: '15%',
    marginBottom: 20,
  }
})

export default class Headline extends Component {
    render () {
        return(
            <Text style={styles.headline}>
                {this.props.children}
            </Text>
        )
    }
}