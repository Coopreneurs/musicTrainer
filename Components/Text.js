import React, {
    Component
} from 'react';
import {
    Text as RNText,
} from 'react-native';

export default class Text extends Component {

    render() {
        const themedStyle = {
            color: 
                this.props.style?.color || 
                    '#fff', 
            lineHeight: 
				this.props.style?.lineHeight || 
                    20,
            fontSize: 
				this.props.style?.fontSize || 
					16,
			fontWeight:
				this.props.bold? 'bold': 'normal',
        }
        return ( 
		<RNText {...this.props} style={[themedStyle, this.props.style]}> 
			{this.props.children} 
		</RNText>
        )
    }
}