import { TextInput, TextInputProps, View } from "react-native";
import { ViewProps } from "react-native-svg/lib/typescript/fabric/utils";
import { Icon, IconProps } from "../icons";
import { twMerge } from "tailwind-merge";
import { StyledPressable, StyledPressableProps } from "./StyledPressable";
import { useState } from "react";

export type StyledTextInputProps = TextInputProps & {
  containerClassName?: ViewProps["className"];
  leftIconProps?: IconProps;
  submitProps?: StyledPressableProps & { onSubmit: (value: string) => void };
};

export const StyledTextInput = ({
  containerClassName,
  submitProps,
  leftIconProps,
  style,
  ...props
}: StyledTextInputProps) => {
  const [value, setValue] = useState<string>("");

  return (
    <View
      className={twMerge(
        `bg-white flex rounded-md p-3 flex-row`,
        containerClassName
      )}
    >
      {!!leftIconProps && <Icon {...leftIconProps} />}
      <TextInput
        value={value}
        onChangeText={(newValue) => setValue(newValue)}
        style={[
          {
            fontFamily: "Inter_400Regular",
            flex: 1,
            flexGrow: 1,
            //@ts-ignore
            outlineStyle: "none",
          },
          style,
        ]}
        {...props}
      />
      {!!submitProps && (
        <StyledPressable
          onPress={() => submitProps.onSubmit(value)}
          {...submitProps}
        />
      )}
    </View>
  );
};
