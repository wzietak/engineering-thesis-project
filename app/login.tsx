import ConfirmationButton from "@/components/buttons/ConfirmationButton";
import { theme } from "@/styles/theme";
import { supabase } from "@/utils/supabase";
import { Link } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const clearErrors = () => {
    setEmailError("");
    setPasswordError("");
  };

  const onButtonPress = async () => {
    const emailCheckRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    let isFormValid = true;
    const emailEntered = email.trim();
    const passwordEntered = password.trim();

    if (!emailEntered) {
      isFormValid = false;
      setEmailError("Please enter your email address.");
    } else if (!emailCheckRegex.test(emailEntered)) {
      isFormValid = false;
      setEmailError("Invalid email format.");
    }
    if (!passwordEntered) {
      isFormValid = false;
      setPasswordError("Please enter your password.");
    } else if (isSignUp && passwordEntered.length < 7) {
      isFormValid = false;
      setPasswordError("Password must be at least 6 characters.");
    } else if (isSignUp && passwordEntered === email.trim()) {
      isFormValid = false;
      setPasswordError("Password cannot be the same as your email.");
    }

    if (!isFormValid) return;

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) isFormValid = false;
      setPasswordError("Invalid email or password.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{ flexGrow: 0.2 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.appTitleText}>BetterAnki</Text>
        <Text style={styles.formText}>Email</Text>
        <TextInput
          style={[styles.textInput]}
          value={email}
          onChangeText={(input) => {
            setEmail(input);
            if (emailError) setEmailError("");
          }}
        />
        {emailError ? (
          <Text style={[styles.errorText]}>{emailError}</Text>
        ) : null}
        <Text style={styles.formText}>Password</Text>
        <TextInput
          style={[styles.textInput]}
          secureTextEntry={true}
          value={password}
          onChangeText={(input) => {
            setPassword(input);
            if (passwordError) setPasswordError("");
          }}
        />
        {passwordError ? (
          <Text style={[styles.errorText]}>{passwordError}</Text>
        ) : null}
        {isSignUp ? null : (
          <Link href={"/+not-found"} style={styles.forgotPasswordText}>
            Forgot password?
          </Link>
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <ConfirmationButton
          buttonText={isSignUp ? "Sign up" : "Log in"}
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
    paddingTop: 70,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: theme.colors.background,
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
    paddingTop: 10,
    flexGrow: 0.2,
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
