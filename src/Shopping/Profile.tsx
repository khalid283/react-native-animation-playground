// @flow
import { ImageSourcePropType } from "react-native";

export type Profile = {
  id: string,
  name: string,
  age: number,
  profile: ImageSourcePropType,
};