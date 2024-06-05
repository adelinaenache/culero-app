import { Button, View } from "react-native";
import { StyledText } from "./StyledText";
import { StyledPressable } from "./StyledPressable";
import { HorizontalDivider } from "./HorizontalDivider";
import { ReactElement, ReactNode } from "react";
import { Icon } from "../icons";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import storage from "../utils/storage";
import { baseUrl } from "../utils/api";

WebBrowser.maybeCompleteAuthSession();

const SocialMediaConnection = ({
  description,
  onPressConnect,
  platformName,
  SocialMediaIcon,
}: {
  description: string;
  platformName: string;
  onPressConnect: () => void;
  SocialMediaIcon: ReactElement;
}) => {
  return (
    <View className="max-w-full items-center pb-4 md:flex-row">
      <View className="flex-row flex-auto">
        {SocialMediaIcon}
        <View className="flex-auto px-4">
          <StyledText color="gray35">{description}</StyledText>
        </View>
      </View>
      <View className="flex-none self-end w-52 mt-4 md:mt-0 md:self-center">
        <StyledPressable
          color="light"
          textVariant={{ weight: 600 }}
          textClassName="text-sm"
          onPress={onPressConnect}
        >
          Connect to {platformName}
        </StyledPressable>
      </View>
    </View>
  );
};

export const SocialMediaConnections = () => {
  // const userQuery = useUserQuery(true);

  const initializePopup = async (platformName: string) => {
    const cb = Linking.createURL("/");

    const result = await WebBrowser.openAuthSessionAsync(
      `${baseUrl}/auth/linkedin?app_url=${cb}`,
      cb
    );

    if (result.type === "success") {
      const token = result.url.split("?")[1].split("=")[1];
      await storage.setItem(storage.TOKEN_KEY, token);
      // userQuery.refetch();
    }
  };

  return (
    <View className="w-full py-4">
      <SocialMediaConnection
        SocialMediaIcon={<Icon name="linkedin-square" size={40} />}
        platformName="LinkedIn"
        onPressConnect={() => initializePopup("linkedin")}
        description={
          "Connect your LinkedIn account to showcase your professional background and network"
        }
      />
      <HorizontalDivider className="my-2" />

      <SocialMediaConnection
        SocialMediaIcon={<Icon name="instagram-square" size={40} />}
        onPressConnect={() => console.log("press")}
        platformName="Instagram"
        description={
          "Connect your Instagram account to share a glimpse of your creative side"
        }
      />
      <HorizontalDivider className="my-2" />

      <SocialMediaConnection
        SocialMediaIcon={<Icon name="github-square" size={40} />}
        onPressConnect={() => initializePopup("github")}
        platformName="GitHub"
        description={
          "Connect your GitHub account to showcase your coding projects and contributions"
        }
      />
    </View>
  );
};
