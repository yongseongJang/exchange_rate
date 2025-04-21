import { darkColors, lightColors } from "@/theme";
import { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, useColorScheme } from "react-native";

export default function DotLoading() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme === "light");

  useEffect(() => {
    const createAnimation = (animatedValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
    };

    createAnimation(dot1, 0).start();
    createAnimation(dot2, 400).start();
    createAnimation(dot3, 800).start();
  }, []);
  return (
    <View style={styles.container}>
      {[dot1, dot2, dot3].map((dot, index) => (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            {
              opacity: dot,
              transform: [
                {
                  scale: dot.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.5],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
}

const createStyles = (isLight: boolean) => {
  const colors = isLight ? lightColors : darkColors;
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.DotLoading.dotColor,
      marginHorizontal: 5,
    },
  });
};
