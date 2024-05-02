import { Userpic } from "react-native-userpic";
import colors from "../../colors";
import { View } from "react-native";
import { Icon } from "../icons";
const ANONYMOUS_IMAGE = require("../../assets/anonymous.png");
const USER_DEFAULT_IMAGE = require("../../assets/default-user-image.png");

export type AvatarProps = {
  userImage?: string;
  isAnonymous?: boolean;
  size?: number;
  hasBadge?: boolean;
  isVerified?: boolean;
  badgeSize?: number;
  hideBorder?: boolean;
  borderColor?: keyof typeof colors;
};
export const Avatar = ({
  userImage,
  isAnonymous,
  size = 40,
  badgeSize = 20,
  hasBadge,
  isVerified,
  hideBorder = false,
  borderColor = "black",
}: AvatarProps) => {
  return (
    <View className="pb-2 pr-2">
      <Userpic
        source={
          userImage
            ? !isAnonymous
              ? { uri: userImage }
              : ANONYMOUS_IMAGE
            : USER_DEFAULT_IMAGE
        }
        defaultSource={USER_DEFAULT_IMAGE}
        radius={2000}
        size={size}
        style={{
          borderWidth: hideBorder ? 0 : 1,
          borderColor: colors[borderColor],
        }}
      />
      {hasBadge && (
        <View className="absolute bottom-0 right-0">
          <Icon
            name="verified"
            size={badgeSize}
            color={isVerified ? "light-green" : "grayAB"}
          />
        </View>
      )}
    </View>
  );
};
