import { Pressable, View } from "react-native";
import { useScreenInfo } from "../../hooks/useScreenInfo";
import { StyledText } from "../StyledText";
import { Icon, IconProps } from "../../icons";
import { HorizontalDivider } from "../HorizontalDivider";
import { ReactElement, useEffect, useState } from "react";
import { SearchBar } from "../SearchBar";
import { Avatar } from "../Avatar";
import { ConnectionPreview } from "../../types";
import { getSearchUserResult } from "../../utils/api";
import { FlatList } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { IconButton } from "../IconButton";
import { useNavToConnection } from "../../hooks/useNavToConnection";

/** This can be used in the screen components. The reason that this is not
 * added in the navigation header is because on mobile the original header shall be kept.
 */

const UserSearchResult = ({ user }: { user: ConnectionPreview }) => {
  const connectionNav = useNavToConnection();
  return (
    <Pressable
      className="flex-row hover:bg-whiteFA items-center p-2"
      onPress={() => {
        connectionNav.navigate(user.id);
      }}
    >
      <View>
        <Avatar userImage={user.profilePictureUrl} />
      </View>
      <View>
        <StyledText weight={600}>{user.name}</StyledText>
        <StyledText>{user.headline}</StyledText>
      </View>
    </Pressable>
  );
};
const SearchUsersBar = () => {
  const [searchQuery, setSearchQuery] = useState<string>();
  const [results, setResults] = useState<ConnectionPreview[]>([]);
  const [dropdownShown, setDropdownShown] = useState(false);
  const [isFocused, setFocused] = useState(false);
  const { height } = useScreenInfo();

  useEffect(() => {
    if (searchQuery && searchQuery !== "") {
      getSearchUserResult(searchQuery).then((r) => setResults(r));
    } else {
      setResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (isFocused) {
      return setDropdownShown(true);
    } else {
      setTimeout(() => {
        setDropdownShown(false);
      }, 1000);
    }
  }, [isFocused]);

  return (
    <View className="flex-row w-10/12 z-[90]" style={{ minWidth: 300 }}>
      <SearchBar
        placeholder="Discover and review people"
        containerClassName="mt-2 h-12 w-full self-end z-0"
        onFocus={() => {
          setFocused(true);
        }}
        onBlur={() => {
          setFocused(false);
        }}
        value={searchQuery}
        onChangeText={(v: string) => {
          setSearchQuery(v);
        }}
        style={{ minWidth: 300 }}
      />
      <View
        className="absolute z-[90] w-full top-12 rounded-lg mt-2"
        style={{ display: dropdownShown ? "flex" : "none" }}
      >
        <View className="bg-white shadow-md  rounded-b-lg  mx-5">
          <FlatList
            style={{ maxHeight: height / 2 }}
            data={results}
            ItemSeparatorComponent={() => <HorizontalDivider />}
            renderItem={({ item }) => <UserSearchResult user={item} />}
          />
        </View>
      </View>
    </View>
  );
};

export type DrawerHeaderProps = {
  iconProps?: IconProps;
  title: string;
  leftIcon?: ReactElement;
};
export const DrawerHeader = ({
  iconProps,
  title,
  leftIcon,
}: DrawerHeaderProps) => {
  const { isPhone } = useScreenInfo();
  const navigation = useNavigation();

  return (
    <>
      <View className="mb-4 z-[90]">
        <View className="flex-row z-[90] justify-between">
          <View className="self-start md:py-4">{!!leftIcon && leftIcon}</View>
          <View className="flex-row self-end z-[90] w-1/2 items-center justify-between ">
            <SearchUsersBar />
            <IconButton
              onPress={() => {
                navigation.navigate("HomeScreen", {
                  screen: "Notifications",
                });
              }}
              iconProps={{ name: "notifications", size: 16 }}
              className="bg-white shadow-md rounded-full h-9 w-9 hover:bg-whiteFA"
            />
          </View>
        </View>
        <View className="flex-row z-0">
          <StyledText weight={600} xl4={!isPhone} lg={isPhone}>
            {title}
          </StyledText>
          {!!iconProps && (
            <Icon className="ml-4" size={isPhone ? 18 : 30} {...iconProps} />
          )}
        </View>
      </View>
      <HorizontalDivider className="md:hidden mb-6" />
    </>
  );
};
