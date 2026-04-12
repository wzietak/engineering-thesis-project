import ConfirmationButton from "@/components/buttons/ConfirmationButton";
import { theme } from "@/styles/theme";
import { supabase } from "@/utils/supabase";
import Octicons from "@expo/vector-icons/Octicons";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState<String | undefined>("");

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordFieldEmpty, setIsPasswordFieldEmpty] = useState(true);

  const clearErrors = () => {
    setEmailError("");
    setPasswordError("");
  };

  const onButtonPress = async () => {
    const emailCheckRegex = /^(?![\.])[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    let isFormValid = true;
    const emailEntered = email.trim();
    const passwordEntered = password.trim();

    if (!emailEntered) {
      isFormValid = false;
      setEmailError("Please enter your email address");
    } else if (!emailCheckRegex.test(emailEntered)) {
      isFormValid = false;
      setEmailError("Invalid email format");
    }
    if (!passwordEntered) {
      isFormValid = false;
      setPasswordError("Please enter your password");
    } else if (isSignUp && passwordEntered.length < 8) {
      isFormValid = false;
      setPasswordError("Password must be at least 8 characters");
    } else if (isSignUp && passwordEntered === email.trim()) {
      isFormValid = false;
      setPasswordError("Password cannot be the same as your email");
    }

    if (!isFormValid) return;

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email: emailEntered,
        password: passwordEntered,
      });
      if (error) {
        isFormValid = false;
        setPasswordError(error.message);
      } else {
        if (Platform.OS === "android")
          ToastAndroid.show("Your account is ready!", ToastAndroid.SHORT);
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailEntered,
        password: passwordEntered,
      });

      if (error) {
        isFormValid = false;
        setPasswordError(error.message);
      } else {
        if (Platform.OS === "android")
          ToastAndroid.show("Welcome back!", ToastAndroid.SHORT);
      }
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="position">
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={require("@/assets/icons/splash-icon-light-android.png")}
            style={styles.appIcon}
          ></Image>
          <Text style={styles.appTitleText}>BetterAnki</Text>
          <Text style={styles.formText}>Email</Text>
          <TextInput
            style={[styles.textInput]}
            value={email}
            maxLength={254}
            onChangeText={(input) => {
              setEmail(input);
              if (emailError) setEmailError("");
            }}
          />
          {emailError ? (
            <Text style={[styles.errorText]}>{emailError}</Text>
          ) : null}
          <Text style={styles.formText}>Password</Text>
          <View
            style={[
              styles.textInput,
              { flexDirection: "row", alignItems: "center" },
            ]}
          >
            <TextInput
              style={{
                width: "92%",
                paddingRight: 10,
                textOverflow: "clip",
                color: theme.colors.primary,
              }}
              secureTextEntry={!isPasswordVisible}
              value={password}
              maxLength={64} //Maximum password length should be at least 64 characters as per OWASP
              onChangeText={(input) => {
                setPassword(input);
                if (passwordError) setPasswordError("");
                if (input) setIsPasswordFieldEmpty(false);
                else {
                  setIsPasswordFieldEmpty(true);
                  setIsPasswordVisible(false);
                }
              }}
            />
            <Pressable
              onPress={() => {
                if (isPasswordFieldEmpty) return null;
                return setIsPasswordVisible(!isPasswordVisible);
              }}
              hitSlop={25}
              style={{
                opacity: isPasswordFieldEmpty ? 0 : 1,
              }}
            >
              {isPasswordVisible ? (
                <Octicons name="eye-closed" size={24} color="black" />
              ) : (
                <Octicons name="eye" size={24} color="black" />
              )}
            </Pressable>
          </View>
          {passwordError ? (
            <Text style={[styles.errorText]}>{passwordError}</Text>
          ) : null}
          <Pressable
            onPress={() => (isSignUp ? null : router.push("/+not-found"))}
            style={{ alignSelf: "flex-start" }}
          >
            <Text style={styles.forgotPasswordText}>
              {isSignUp ? "" : "Forgot password?"}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.buttonContainer}>
        <ConfirmationButton
          buttonText={isSignUp ? "Sign up" : "Sign in"}
          onPress={onButtonPress}
        ></ConfirmationButton>
        <View
          style={{
            paddingTop: 10,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Text style={[styles.formText, { paddingRight: 5 }]}>
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
          </Text>
          <Link
            style={[styles.formText, { color: theme.colors.purple }]}
            href={"/login"}
            onPress={() => {
              setIsSignUp(!isSignUp);
              clearErrors();
            }}
          >
            {isSignUp ? "Log in" : "Sign up"}
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 25,
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: theme.colors.background,
  },
  appIcon: {
    width: 180,
    height: 180,
    alignSelf: "center",
  },
  appTitleText: {
    alignSelf: "center",
    fontFamily: theme.fontFamily.bold,
    fontSize: theme.fontSize.x_lg,
  },
  formText: {
    paddingTop: 10,
    fontFamily: theme.fontFamily.bold,
    fontSize: theme.fontSize.sm,
  },
  textInput: {
    width: "100%",
    paddingHorizontal: 10,
    minHeight: 45,
    borderWidth: 1,
    borderRadius: theme.borderRadius.sm,
    borderColor: theme.colors.primary,
    color: theme.colors.primary,
    fontFamily: theme.fontFamily.regular,
  },
  buttonContainer: {
    height: 100,
    width: "100%",
    marginTop: 60,
    justifyContent: "flex-end",
  },
  forgotPasswordText: {
    paddingTop: 10,
    fontFamily: theme.fontFamily.regular,
    fontSize: theme.fontSize.x_sm,
    color: theme.colors.purple,
  },
  errorText: {
    paddingTop: 5,
    fontFamily: theme.fontFamily.regular,
    fontSize: theme.fontSize.x_sm,
    color: "red",
  },
});
