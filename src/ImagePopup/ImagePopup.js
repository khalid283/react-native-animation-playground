import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TextInput } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import { TapGestureHandler, State, createNativeWrapper, PureNativeButton, PanGestureHandler } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');
const { Value, event, createAnimatedComponent, block, lessThan, cond, eq, set, Clock, startClock, clockRunning, stopClock, debug, timing } = Animated;

const constant = { 
    PADDING_OUTSIDE_CARD : 30,
    PADDING_INSIDE_CARD: 32,
    TOTAL_PADDING: 62,
    CARD_WIDTH: width-60,
    CARD_HEIGHT: height/2,
    CLOSE_ICON_SIZE: 48
 }

 const AnimatedRawButton = createNativeWrapper(
    createAnimatedComponent(PureNativeButton),
    {
      shouldCancelWhenOutside: false,
      shouldActivateOnStart: false,
    }
);

function runTiming(clock, value, dest) {
    const state = {
      finished: new Value(0),
      position: new Value(0),
      time: new Value(0),
      frameTime: new Value(0)
    };
  
    const config = {
      duration: 500,
      toValue: new Value(0),
      easing: Easing.inOut(Easing.ease)
    };
  
    return block([
      cond(clockRunning(clock), 0, [
        set(state.finished, 0),
        set(state.time, 0),
        set(state.position, value),
        set(state.frameTime, 0),
        set(config.toValue, dest),
        startClock(clock)
      ]),
      timing(clock, state, config),
      cond(state.finished, debug('stop clock', stopClock(clock))),
      state.position
    ]);
}

export default class ImagePopup extends React.Component{
    constructor() {
        super();
        this.cardStatus = new Value(1);
        this.cardStatusImage = new Value(1);
        this.cardStatusWidth = new Value(1);
        this.backOpacity = new Value(1);
        this.tapState = new Value(0);
        this.transformY = new Value(0);
        this.transformX = new Value(0);
        this.imageY = new Value(0);
        this.imageX = new Value(0);
        this.borderRadius = new Value(0);
        this.onImageTap = event([
            {
                nativeEvent: {state: this.tapState}
            }
        ], { useNativeDriver: true });
        this.onTapped();
        this.imageSetup();
        this.imageHeightSetup();
        this.setBorderRadius();
    }
    setBorderRadius() {
        const clock = new Clock();
        let { tapState, borderRadius, cardStatus } = this;
        this.backBorderRadius = cond(eq(tapState, State.END),
        [
            cond(eq(cardStatus, 0),[
                set(borderRadius, runTiming(clock, borderRadius, 0)),
            ],[
                set(borderRadius, runTiming(clock, borderRadius, 100)),
            ])
        ],[
            cond(eq(tapState, 0),[
                set(borderRadius, runTiming(clock, borderRadius, 0))
            ])
        ]);
    }

    imageHeightSetup() {
        const clock = new Clock();
        let { tapState, cardStatusImage, imageX } = this;
        this.imagePaddingTop = cond(eq(tapState, State.END),
        [
            cond(eq(cardStatusImage, 0),[
                set(imageX, runTiming(clock, imageX, height/2-48)),
                cond(eq(imageX, height/2-48),[set(cardStatusImage, 1)]),
                imageX
            ],[
                set(imageX, runTiming(clock, imageX, 0)),
                cond(eq(imageX, 0),[set(cardStatusImage, 0)]),
                imageX
            ])
        ],[
            cond(eq(tapState, 0),[
                set(imageX, runTiming(clock, imageX, height/2-48)),
                cond(eq(imageX, height/2-48),[set(cardStatusImage, 1)]),
                imageX
            ])
        ]);
    }
    imageSetup() {
        const clock = new Clock();
        let { tapState, imageY, cardStatusWidth } = this;
        this.imagePadding = cond(eq(tapState, State.END),
        [
            cond(
                eq(cardStatusWidth, 0),[
                    set(imageY, runTiming(clock, imageY, width/2-48)),
                    cond(eq(imageY, width/2-48),[set(cardStatusWidth, 1)]),
                    imageY
                ],[
                    set(imageY, runTiming(clock, imageY, 0)),
                    cond(eq(imageY, 0),[set(cardStatusWidth, 0)]),
                    imageY
                ]
            )
        ],[
            cond(eq(tapState, 0),[
                set(imageY, runTiming(clock, imageY, width/2-48)),
                cond(eq(imageY, width/2-48),[set(cardStatusWidth, 1)]),
            ])
        ]);
    }

    onTapped(){
        const clock = new Clock();
        let { tapState, transformY, cardStatus } = this;
        this.backHeight = cond(eq(tapState, State.END),
        [
            cond(
                eq(cardStatus, 0),[
                    set(transformY, runTiming(clock, transformY, height)),
                    cond(eq(transformY, height),[set(cardStatus, 1)]),
                    transformY
                ],[
                    set(transformY, runTiming(clock, transformY, 96)),
                    cond(eq(transformY, 96),[set(cardStatus, 0)]),
                    transformY
                ]
            )
        ],[
            cond(eq(tapState, 0),[
                set(transformY, runTiming(clock, transformY, height)),
                set(cardStatus, 1),
                transformY
            ])
        ]);
    }

    render() {
        
        return(
            <View style={styles.container} >
                <Animated.View style={{ 
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    width: this.backHeight, 
                    height: this.backHeight,
                    borderRadius: this.backBorderRadius
                }}>
                    <AnimatedRawButton onGestureEvent={this.onImageTap} onHandlerStateChange={this.onImageTap} >
                        <Animated.View style={{ 
                            paddingLeft: this.imagePadding, 
                            paddingTop: this.imagePaddingTop,
                        }}>
                            <Image style={{ width: 96, height: 96 }} source={require('../../assets/icon/sm_google.png')} />
                        </Animated.View>
                    </AnimatedRawButton>
                </Animated.View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'tomato',
        justifyContent: 'center'
    },
});