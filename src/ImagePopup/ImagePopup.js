import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import PopupAnimate from './PopupAnimate';


export default class ImagePopup extends React.Component{

    render() {
        return(
            <View style={styles.container} >
                
                <View>
                    <Text>
                        heell
                    </Text>
                    <Image style={{ width: 96, height: 96 }} source={require('../../assets/icon/sm_facebook.png')} />
                    <Image style={{ width: 96, height: 96 }} source={require('../../assets/icon/sm_facebook.png')} />
                </View>
                    <PopupAnimate style={{ width: 96, height: 96 }} source={require('../../assets/icon/sm_google.png')} />
                    
                    <PopupAnimate style={{ width: 96, height: 96 }} source={require('../../assets/icon/sm_twitter.png')} />
                <View>
                    <Text>
                        SomeText
                    </Text>
                    <Image style={{ width: 96, height: 96 }} source={require('../../assets/icon/sm_facebook.png')} />
                    <Image style={{ width: 96, height: 96 }} source={require('../../assets/icon/sm_facebook.png')} />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'tomato',
    },
});