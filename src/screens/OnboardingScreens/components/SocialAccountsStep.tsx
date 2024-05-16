import { View } from "react-native";
import { SocialMediaConnections, StyledText } from "../../../components";

export const SocialAccountsStep = () => {
  return (
    <View>
      <StyledText weight={600} xl>
        Connect your social accounts
      </StyledText>
      <StyledText color="gray35" className="mt-6 mb-4 text-[14px]">
        Culero will only access basic information. We respect your privacy and
        will not post on your behalf.
      </StyledText>
      <SocialMediaConnections />
    </View>
  );
};
