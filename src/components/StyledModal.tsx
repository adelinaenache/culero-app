import { Modal, Pressable, View, ViewProps } from "react-native";
import { IconButton } from "./IconButton";
import { twMerge } from "tailwind-merge";

export type ModalProps = {
  isVisible: boolean;
  setVisibility: (isVisible: boolean) => void;
  whiteContainerClassName?: ViewProps["className"];
  containerClassName?: ViewProps["className"];
  children?: React.ReactNode;
};

export const StyledModal = ({
  isVisible,
  setVisibility,
  children,
  whiteContainerClassName,
  containerClassName,
}: ModalProps) => {
  return (
    <Modal
      animationType="fade"
      visible={isVisible}
      transparent={true}
      onRequestClose={() => setVisibility(false)}
    >
      <Pressable
        className="bg-gray38/80 h-full justify-center"
        onPress={() => setVisibility(false)}
      >
        <Pressable
          className={twMerge(
            "flex self-center cursor-default",
            containerClassName
          )}
        >
          <View
            className={twMerge(
              "bg-white rounded-lg p-6",
              whiteContainerClassName
            )}
          >
            <IconButton
              className="self-end"
              onPress={() => setVisibility(false)}
              iconProps={{ name: "close", size: 18 }}
            />
            {children}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
