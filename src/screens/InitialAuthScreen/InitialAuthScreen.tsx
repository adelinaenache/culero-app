import { View } from "react-native";
import {
  HorizontalDivider,
  PasswordStrength,
  StyledPressable,
  StyledText,
  StyledTextInput,
} from "../../components";
import colors from "../../../colors";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { signUp } from "../../utils/api";

export const InitialAuthScreen = () => {
  const navigation = useNavigation();
  const [seeFullOptions, setFullOptions] = useState(false);
  const [isEmailFlowStarted, setStartEmailFlow] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const formikEmailPasswordStep = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email("Must be a valid email!")
        .required("Email is required!"),
      password: Yup.string().matches(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{9,}$/,
        "weak"
      ),
    }),

    onSubmit: async (values) => {
      try {
        setError(undefined);
        await signUp(values.email, values.password);
      } catch (err) {
        if (err instanceof Error) {
          console.log(err.message);
          setError(err.message);
        }
      }
    },
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validateOnChange: false,
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email("Must be a valid email!")
        .required("Email is required!"),
    }),
    onSubmit: (values) => {
      formikEmailPasswordStep.setFieldValue("email", values.email);
      setStartEmailFlow(true);
    },
  });

  return (
    <View className="max-w-xl self-center">
      <StyledText weight={600} xl3 center>
        Create your account
      </StyledText>
      <StyledText color="gray35" className="mt-6" center>
        Embark on a Journey of Professional Growth and Collaboration!
      </StyledText>
      {!isEmailFlowStarted && (
        <>
          <StyledPressable
            fw
            color="white"
            className="mt-12 border h-16"
            onPress={() => {}}
            leftIconProps={{ name: "google" }}
          >
            Continue with Google
          </StyledPressable>
          {!seeFullOptions && (
            <StyledPressable
              fw
              color="white"
              className="mt-4 border h-16"
              onPress={() => setFullOptions(true)}
            >
              See other options
            </StyledPressable>
          )}
          {seeFullOptions && (
            <>
              <StyledPressable
                fw
                color="white"
                className="mt-4 border h-16"
                onPress={() => {}}
              >
                Continue with Apple
              </StyledPressable>
              <StyledPressable
                fw
                color="white"
                className="mt-4 border h-16"
                onPress={() => {}}
              >
                Continue with Linkedin
              </StyledPressable>{" "}
              <StyledPressable
                fw
                color="white"
                className="mt-4 border h-16"
                onPress={() => {}}
              >
                Continue with Facebook
              </StyledPressable>
            </>
          )}
          <View className="flex-row items-center mt-6">
            <HorizontalDivider className="flex-1" />
            <StyledText weight={600} color="nickel">
              {"  "}
              Or{"  "}
            </StyledText>
            <HorizontalDivider className="flex-1" />
          </View>
          <StyledTextInput
            containerClassName="mt-9 bg-grayF2 py-4"
            placeholder="Enter your email address"
            value={formik.values.email}
            error={formik.errors.email}
            onChangeText={(value) => formik.setFieldValue("email", value)}
            placeholderTextColor={colors.gray35}
          />
          <StyledPressable
            fw
            color="light"
            className="mt-6 mb-4"
            textClassName="p-1"
            disabled={!formik.isValid || Object.keys(formik.errors).length > 0}
            onPress={() => formik.handleSubmit()}
          >
            Get Started
          </StyledPressable>
        </>
      )}
      {isEmailFlowStarted && (
        <>
          <StyledTextInput
            containerClassName="mt-9 bg-grayF2 py-4 w-full"
            placeholder="Enter your email addres"
            value={formikEmailPasswordStep.values.email}
            error={formikEmailPasswordStep.errors.email}
            onChangeText={(value) =>
              formikEmailPasswordStep.setFieldValue("email", value)
            }
            placeholderTextColor={colors.gray35}
          />
          <StyledTextInput
            containerClassName="mt-2 bg-grayF2 py-4"
            placeholder="Create a password"
            value={formikEmailPasswordStep.values.password}
            onChangeText={(value) =>
              formikEmailPasswordStep.setFieldValue("password", value)
            }
            placeholderTextColor={colors.gray35}
            secureTextEntry={true}
          />
          <View className="h-8 mt-3 w-full">
            {formikEmailPasswordStep.values.password !== "" && (
              <PasswordStrength
                type={
                  formikEmailPasswordStep.errors.password ? "weak" : "strong"
                }
              />
            )}
          </View>
          {error && <StyledText color="deep-red">{error}</StyledText>}

          <StyledPressable
            fw
            color="light"
            className="mt-6 mb-4"
            disabled={formikEmailPasswordStep.isSubmitting}
            textClassName="p-1"
            onPress={() => formikEmailPasswordStep.handleSubmit()}
          >
            Create account
          </StyledPressable>
        </>
      )}
      <StyledText sm className="italic" color="gray35" center>
        By continuing, you agree to Culero
        <StyledText
          sm
          weight={600}
          onPress={() => console.log("Should go to T&C")}
        >
          Terms of Service
        </StyledText>{" "}
        and{" "}
        <StyledText
          sm
          weight={600}
          onPress={() => console.log("Should go to privacy poloicy")}
        >
          Privacy Policy
        </StyledText>
        .
      </StyledText>
      <StyledText className="mt-6" center>
        Have an account already?{" "}
        <StyledText
          weight={500}
          color="primary"
          onPress={() => {
            //navigation.navigate("Login")
          }}
        >
          Sign in
        </StyledText>{" "}
      </StyledText>
    </View>
  );
};