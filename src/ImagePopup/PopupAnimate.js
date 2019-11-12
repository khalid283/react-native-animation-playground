import React, { useState, useRef } from 'react';
import { View, Dimensions, Image } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import { State, createNativeWrapper, PureNativeButton } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');
const halfHeight = height/2;
const halfWidth = width/2;
const { Value, event, createAnimatedComponent, block, sub, cond, eq, set, Clock, startClock, clockRunning, stopClock, debug, timing } = Animated;

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

export default (props) => {
    const imageRef = useRef();
    const tapState = new Value(0);
    const cardStatus = new Value(1);
    const cardStatusImage = new Value(0);
    const cardStatusWidth = new Value(0);
    const cardStatusOverlayY = new Value(0);
    const cardStatusOverlayX = new Value(0);
    const transformY = new Value(0);
    const imageX = new Value(0);
    const imageY = new Value(0);
    const originY = new Value(0);
    const originX = new Value(0);
    const originW = new Value(0);
    const originH = new Value(0);

    const overlayY = new Value(0);
    const overlayX = new Value(0);

    const translateX = new Value(0);
    const translateY = new Value(0);
    const borderRadius = new Value(0);
    const onImageTap = event([
        {
            nativeEvent: {state: tapState}
        }
    ], { useNativeDriver: true });
    function getLayout() {
        setTimeout(() => {
            imageRef.current.measure( (fx, fy, width, height, px, py) => {
                originY.setValue(py);
                originX.setValue(px);
                translateX.setValue(-px);
                translateY.setValue(-272.7272644042969);
                originH.setValue(height/2);
                originW.setValue(width/2)
                console.log(py, px);
            })
        }, 2000);
    }
    getLayout();

    const clock_backHeight = new Clock();
    const backHeight = cond(eq(tapState, State.END),[
        debug('imageRef', originX),
        cond(
            eq(cardStatus, 0),[
                set(transformY, runTiming(clock_backHeight, transformY, height)),
                cond(eq(transformY, height),[set(cardStatus, 1)]),
                transformY
            ],[
                set(transformY, runTiming(clock_backHeight, transformY, 96)),
                cond(eq(transformY, 96),[set(cardStatus, 0)]),
                transformY
            ]
        )
    ],[
        cond(eq(tapState, 0),[
            set(transformY, runTiming(clock_backHeight, transformY, height)),
            set(cardStatus, 1),
            transformY
        ],[
            transformY
        ])
    ]);

    const clock_imagePaddingTop= new Clock();
    const imagePaddingTop = cond(eq(tapState, State.END),
    [
        cond(eq(cardStatusImage, 0),[
            set(imageX, runTiming(clock_imagePaddingTop, imageX, sub(halfHeight, originH))),
            cond(eq(imageX, sub(halfHeight, originH)),[set(cardStatusImage, 1)]),
            imageX
        ],[
            set(imageX, runTiming(clock_imagePaddingTop, imageX, 0)),
            cond(eq(imageX, 0),[set(cardStatusImage, 0)]),
            imageX
        ])
    ],[
        cond(eq(tapState, 0),[
            set(imageX, runTiming(clock_imagePaddingTop, imageX, sub(halfHeight, originH))),
            cond(eq(imageX, sub(halfHeight, originH)),[set(cardStatusImage, 1)]),
            imageX
        ],[
            imageX
        ])
    ]);

    const clock_imagePaddingLeft= new Clock();
    const imagePaddingLeft = cond(eq(tapState, State.END),
        [
            cond(
                eq(cardStatusWidth, 0),[
                    set(imageY, runTiming(clock_imagePaddingLeft, imageY, sub(halfWidth, originW))),
                    cond(eq(imageY, sub(halfWidth, originW)),[set(cardStatusWidth, 1)]),
                    imageY
                ],[
                    set(imageY, runTiming(clock_imagePaddingLeft, imageY, 0)),
                    cond(eq(imageY, 0),[set(cardStatusWidth, 0)]),
                    imageY
                ]
            )
        ],[
            cond(eq(tapState, 0),[
                set(imageY, runTiming(clock_imagePaddingLeft, imageY, sub(halfWidth, originW))),
                cond(eq(imageY, sub(halfWidth, originW)),[set(cardStatusWidth, 1)]),
            ],[
                imageY
            ])
        ]);


    // padding for background
    const clock_backgroundPadding= new Clock();
    const backgroundPadding = cond(eq(tapState, State.END),
        [
            cond(eq(cardStatusOverlayY, 0),[
                set(overlayY, runTiming(clock_backgroundPadding, overlayY, 0)),
                cond(eq(overlayY, 0),[set(cardStatusOverlayY, 1)]),
                overlayY
            ],[
                set(overlayY, runTiming(clock_backgroundPadding, overlayY, originY)),
                cond(eq(overlayY, originY),[set(cardStatusOverlayY, 0)]),
                overlayY
            ])
        ],[
            cond(eq(tapState, 0),[
                set(overlayY, runTiming(clock_backgroundPadding, overlayY, 0)),
                cond(eq(overlayY, 0),[set(cardStatusOverlayY, 1)]),
                overlayY
            ],[
                overlayY
            ])
        ]);


    const clock_backgroundPaddingLeft = new Clock();
    const backgroundPaddingLeft = cond(eq(tapState, State.END),
    [
        cond(eq(cardStatusOverlayX, 0),[
            set(overlayX, runTiming(clock_backgroundPaddingLeft, overlayX, 0)),
            cond(eq(overlayX, 0),[set(cardStatusOverlayX, 1)]),
            overlayX
        ],[
            set(overlayX, runTiming(clock_backgroundPaddingLeft, overlayX, originX)),
            cond(eq(overlayX, originY),[set(cardStatusOverlayX, 0)]),
            overlayX
        ])
    ],[
        cond(eq(tapState, 0),[
            set(overlayX, runTiming(clock_backgroundPaddingLeft, overlayX, 0)),
            cond(eq(overlayX, 0),[set(cardStatusOverlayX, 1)]),
            overlayX
        ],[
            overlayX
        ])
    ]);


    //overlay border radius
    const clock_overlayBorderRadius = new Clock();
    const overlayBorderRadius = cond(eq(tapState, State.END),
        [
            cond(eq(cardStatus, 0),[
                set(borderRadius, runTiming(clock_overlayBorderRadius, borderRadius, 0)),
            ],[
                set(borderRadius, runTiming(clock_overlayBorderRadius, borderRadius, 100)),
            ])
        ],[
            cond(eq(tapState, 0),[
                set(borderRadius, runTiming(clock_overlayBorderRadius, borderRadius, 0))
            ],[
                borderRadius
            ])
        ]);

    return(
        <>
        <Animated.View style={{ }}>
            <AnimatedRawButton onGestureEvent={onImageTap} onHandlerStateChange={onImageTap} >
                <Animated.View style={{ }}>
                    <View onLayout={event => { 
                        const layout = event.nativeEvent.layout;
                        // console.log(layout)
                    }}>
                        <Image ref={imageRef} style={props.style} source={props.source} />
                    </View>
                </Animated.View>
            </AnimatedRawButton>
        </Animated.View>
        <Animated.View style={{ 
            backgroundColor: 'rgba(0,0,0,0.3)',
            width: backHeight, 
            height: backHeight,
            borderRadius: overlayBorderRadius,
            position: 'absolute',
            flex: 1,
            top: backgroundPadding,
            left: backgroundPaddingLeft,
            // transform: [ { translateX }, { translateY } ]
        }}>
            <Animated.View style={{ flex: 1 }}>
                <AnimatedRawButton onGestureEvent={onImageTap} onHandlerStateChange={onImageTap} >
                    <Animated.View style={{ 
                        left: imagePaddingLeft,
                        top: imagePaddingTop,
                        height: height
                    }}>
                        <View onLayout={event => { 
                            const layout = event.nativeEvent.layout
                         }}>
                            <Image style={props.style} source={props.source} />
                        </View>
                    </Animated.View>
                </AnimatedRawButton>
            </Animated.View>
        </Animated.View>
       
    </>
    )
}