import { Alert, Pressable, View, ViewProps } from "react-native";
import { twMerge } from "tailwind-merge";
import { Card } from "./Card";
import { Avatar } from "./Avatar";
import {
  OverallBarsRating,
  OverallRateCard,
  OverallScore,
} from "./OverallRateCard";
import { StyledText } from "./StyledText";
import { Icon } from "../icons";
import { StyledPressable } from "./StyledPressable";
import { useEffect, useMemo, useState } from "react";
import { StyledModal } from "./StyledModal";
import { useFormik } from "formik";
import { User } from "../types";
import { useUserRatings } from "../hooks/useUserRatings";
import { StyledTextInput } from "./StyledTextInput";
import { HorizontalDivider } from "./HorizontalDivider";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { useUpdateProfilePicture } from "../hooks/useUpdateProfilePicture";
import * as ImagePicker from "expo-image-picker";
import { useScreenInfo } from "../hooks/useScreenInfo";
import { useConnection } from "../hooks/useConnection";
import { useSocialAccounts } from "../hooks/useSocialAccounts";
import { IconButton } from "./IconButton";
import * as Linking from "expo-linking";
import { SocialAccount } from "../types/SocialAccount";

export type ProfileCardProps = {
  user: User;
  className?: ViewProps["className"];

  userLocation?: string;
};
type EditModalProps = {
  visible: boolean;
  setVisibility: (visibility: boolean) => void;
  user: User;
};
const EditModal = ({ visible, setVisibility, user }: EditModalProps) => {
  const updateProfile = useUpdateProfile();
  const updatePicture = useUpdateProfilePicture();
  const { platform } = useScreenInfo();
  const [imageDirty, setImageDirty] = useState(false);

  const onModalClose = (v: boolean) => {
    setVisibility(v);
    setImageDirty(false);
    formik.resetForm();
  };

  useEffect(() => {
    formik.setFieldValue("name", user.name);
    formik.setFieldValue("location", user.location);
    formik.setFieldValue("profilePictureUrl", user.profilePictureUrl);
    formik.setFieldValue("headline", user.headline);
  }, [user]);

  const formik = useFormik({
    initialValues: {
      name: user.name,
      headline: user.headline,
      location: user.location,
      profilePictureUrl: user.profilePictureUrl,
    },
    onSubmit: async (values) => {
      if (imageDirty) {
        await updatePicture.mutateAsync(values.profilePictureUrl!);
      }

      await updateProfile.mutateAsync({
        name: values.name,
        headline: values.headline,
        location: values.location,
      });

      onModalClose(false);
    },
  });

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImageDirty(true);
      if (platform !== "web") {
        formik.setFieldValue(
          "profilePictureUrl",
          `data:${result.assets[0].mimeType};base64,${result.assets[0].base64}`
        );
      } else {
        formik.setFieldValue("profilePictureUrl", result.assets[0].uri);
      }
    }
  };

  return (
    <StyledModal
      isVisible={visible}
      setVisibility={onModalClose}
      containerClassName="w-full px-2 md:w-1/2"
    >
      <View className="md:px-10">
        <StyledText weight={600} xl2>
          Edit profile
        </StyledText>
        <Pressable onPress={pickImage} className="hover:opacity-50">
          <Avatar
            userImage={formik.values.profilePictureUrl}
            size={151}
            className="my-7 self-start"
          />
        </Pressable>
        <View className="space-y-4">
          <StyledTextInput
            value={formik.values.name}
            error={formik.errors.name}
            onChangeText={(value) => formik.setFieldValue("name", value)}
            label="Full name"
            containerClassName="bg-grayF2"
          />
          <StyledTextInput
            value={formik.values.headline}
            error={formik.errors.headline}
            onChangeText={(value) => formik.setFieldValue("headline", value)}
            label="Professional Headline"
            containerClassName="bg-grayF2"
          />
          <StyledTextInput
            value={formik.values.location}
            error={formik.errors.location}
            onChangeText={(value) => formik.setFieldValue("location", value)}
            label="Location"
            containerClassName="bg-grayF2"
          />
        </View>
        <HorizontalDivider className="border-primary/40 mb-6 mt-8" />
        <StyledPressable
          color="primary"
          isLoading={updatePicture.isPending || updateProfile.isPending}
          textVariant={{ color: "white" }}
          className="self-end w-40"
          onPress={() => formik.handleSubmit()}
        >
          Save
        </StyledPressable>
      </View>
    </StyledModal>
  );
};

export const ProfileCard = ({ user, className }: ProfileCardProps) => {
  const [isModalOpen, openModal] = useState(false);
  const avgs = useUserRatings(user.id);
  const connectionData = useConnection(user.id);
  const { isPhone } = useScreenInfo();
  const socialAccounts = useSocialAccounts();

  const githubAccount: SocialAccount | undefined = useMemo(
    () => socialAccounts.data?.find((s) => s.platform === "GITHUB"),
    [socialAccounts.data]
  );
  const facebookAccount = useMemo(
    () => socialAccounts.data?.find((s) => s.platform === "FACEBOOK"),
    [socialAccounts.data]
  );
  const linkedinAccount: SocialAccount | undefined = useMemo(
    () => socialAccounts.data?.find((s) => s.platform === "LINKEDIN"),
    [socialAccounts.data]
  );
  const hasSocialAccount =
    !!githubAccount || !!facebookAccount || !!linkedinAccount;

  return (
    <>
      <EditModal visible={isModalOpen} setVisibility={openModal} user={user} />
      <Card
        className={twMerge("bg-transparent md:p-4 p-0 px-2", className)}
        bodyComponent={
          <View>
            <View className="flex-row items-center">
              <Avatar
                userImage={user.profilePictureUrl}
                hasBadge={false}
                size={151}
              />
              {avgs.isFetched &&
                avgs.data &&
                (!isPhone ? (
                  <>
                    <OverallRateCard
                      className="w-1/2 bg-transparent hidden md:flex"
                      barsContainerClassName="ml-8"
                      professionalismRating={avgs.data.professionalism}
                      reliabilityRating={avgs.data.reliability}
                      communicationRating={avgs.data.communication}
                    />
                  </>
                ) : (
                  <OverallScore
                    className="ml-2"
                    professionalismRating={avgs.data.professionalism}
                    reliabilityRating={avgs.data.reliability}
                    communicationRating={avgs.data.communication}
                    big={true}
                  />
                ))}
            </View>
            {avgs.isFetched && avgs.data && (
              <OverallBarsRating
                className="mb-4 md:hidden"
                professionalismRating={avgs.data.professionalism}
                reliabilityRating={avgs.data.reliability}
                communicationRating={avgs.data.communication}
              />
            )}
            <View className="md:flex-row justify-between">
              <View className="space-y-2">
                {user.name && (
                  <StyledText weight={600} xl4 color="gray38">
                    {user.name}
                    <Icon
                      name="verified"
                      size={30}
                      color={user.isEmailVerified ? "light-green" : "gray"}
                      className="ml-2"
                    />
                  </StyledText>
                )}
                {user.headline && (
                  <StyledText xl2 color="gray38" weight={400}>
                    {user.headline}
                  </StyledText>
                )}
                {user.location && (
                  <StyledText color="gray38">
                    {`${user.location} . `}
                    <StyledText color="primary" weight={600}>
                      Contact info
                    </StyledText>
                  </StyledText>
                )}
                {hasSocialAccount && (
                  <View className="flex-row">
                    {linkedinAccount && (
                      <IconButton
                        iconProps={{ name: "linkedin-color", size: 32 }}
                        onPress={() =>
                          linkedinAccount.profileUrl &&
                          Linking.openURL(linkedinAccount.profileUrl)
                        }
                      />
                    )}
                    {facebookAccount && (
                      <IconButton
                        iconProps={{ name: "facebook-color", size: 32 }}
                        onPress={() =>
                          facebookAccount.profileUrl &&
                          Linking.openURL(facebookAccount.profileUrl)
                        }
                      />
                    )}
                    {githubAccount && (
                      <IconButton
                        iconProps={{ name: "github-color", size: 32 }}
                        onPress={() =>
                          githubAccount.profileUrl &&
                          Linking.openURL(githubAccount.profileUrl)
                        }
                      />
                    )}
                  </View>
                )}
                {connectionData.isFetched && connectionData.data && (
                  <StyledText color="gray38">
                    {`${connectionData.data.connectionsCount} Connections . `}
                    <StyledText
                      color="primary"
                      weight={600}
                    >{`${connectionData.data.reviewsCount} Reviews`}</StyledText>
                  </StyledText>
                )}

                <StyledText weight={600} color="primary">
                  My Profile <Icon name="eye" color="primary" size={16} />
                </StyledText>
              </View>
              <View>
                <StyledPressable
                  color="white"
                  className="mt-2"
                  onPress={() => {
                    openModal(true);
                  }}
                  rightIconProps={{ name: "edit" }}
                >
                  Edit Profile
                </StyledPressable>
              </View>
            </View>
          </View>
        }
      />
    </>
  );
};
