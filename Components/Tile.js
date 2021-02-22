import React, { Component } from 'react';
import { 
    StyleSheet, 
    Pressable 
} from 'react-native';

const styles = StyleSheet.create({
  tile: {
    justifyContent: 'center',
    backgroundColor: '#4e5481', //eedd77
    // borderWidth: 3,
    // borderColor: '#fff',
    fontSize: 20,
    margin: 20,
    alignItems: 'center',
    padding: 20,
    borderRadius: 4,
    shadowOffset: {
        width: 2,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowColor: '#b0003c'
  }
})

export default class Tile extends Component {
    render () {
        return (
            <Pressable
            style={[styles.tile, this.props.style]}
            onPress={this.props.onPress}>
                {this.props.children}
            </Pressable>
        )
    }
}