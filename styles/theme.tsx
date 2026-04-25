type Colors = {
  background: string;
  primary: string;
  blue: string;
  green: string;
  pink: string;
  lightblue: string;
  grey: string;
  grey_light: string;
  primary_light: string;
  purple: string;
  purple_alpha: string;
  lightpurple: string;
  red: string;
  background_alpha: string;
  error: string;
};

type BorderRadius = {
  sm: number;
  md: number;
  lg: number;
};

type BoxShadow = {
  buttons: string;
  small_buttons: string;
  bottomContainer: string;
};

type FontSize = {
  x_sm: number;
  sm: number;
  md: number;
  lg: number;
  x_lg: number;
};

type FontFamily = {
  regular: string;
  bold: string;
  italic: string;
};

export const lightTheme: Colors = {
  background: "#fff",
  primary: "#000",
  blue: "#B8CBFA",
  green: "#D7F5CA",
  pink: "#F5CAF4",
  lightblue: "#CAF5F3",
  grey: "#CFD7DA",
  grey_light: "#dee5e8",
  primary_light: "#393939",
  purple: "#a580e6",
  purple_alpha: "#a580e65f",
  lightpurple: "#e1d0ff",
  red: "#ffa0a0",
  background_alpha: "rgba(255, 255, 255, 0.2)",
  error: "red",
};

export const darkTheme: Colors = {
  background: "rgb(20, 25, 41)",
  primary: "rgb(112, 121, 168)",
  blue: "#5f719b",
  green: "#78936c",
  pink: "#8d718d",
  lightblue: "#6c8f8c",
  grey: "#CFD7DA",
  grey_light: "#dee5e8",
  primary_light: "rgb(76, 83, 114)",
  purple: "#7961a4",
  purple_alpha: "#7861a43a",
  lightpurple: "#706683",
  red: "#ffa0a0",
  background_alpha: "rgba(20, 25, 41, 0.2)",
  error: "#8d0707",
};

// export const colors = {
//   background: "#fff",
//   primary: "#000",
//   blue: "#B8CBFA",
//   green: "#D7F5CA",
//   pink: "#F5CAF4",
//   lightblue: "#CAF5F3",
//   grey: "#CFD7DA",
//   grey_light: "#dee5e8",
//   primary_light: "#393939",
//   purple: "#a580e6",
//   purple_alpha: "#a580e65f",
//   lightpurple: "#e1d0ff",
//   red: "#ffa0a0",
// };

export const borderRadius: BorderRadius = {
  sm: 12,
  md: 18,
  lg: 32,
};

export const boxShadowDark: BoxShadow = {
  buttons: "0px 0px 18px rgba(0, 0, 0, 0.25)",
  small_buttons: "0px 0px 8px rgba(0, 0, 0, 0.16)",
  bottomContainer: "0px -5px 18px rgb(20, 25, 41)",
};

export const boxShadowLight: BoxShadow = {
  buttons: "0px 0px 18px rgba(0, 0, 0, 0.25)",
  small_buttons: "0px 0px 8px rgba(0, 0, 0, 0.16)",
  bottomContainer: "0px -5px 18px rgb(255, 255, 255)",
};

export const fontSize: FontSize = {
  x_sm: 14,
  sm: 18,
  md: 20,
  lg: 23,
  x_lg: 26,
};

export const fontFamily: FontFamily = {
  regular: "Rubik_400Regular",
  bold: "Rubik_600SemiBold",
  italic: "Rubik_400Light_Italic",
};

export interface AppTheme {
  colors: Colors;
  borderRadius: BorderRadius;
  boxShadow: BoxShadow;
  fontSize: FontSize;
  fontFamily: FontFamily;
}

export const theme = {
  colors: {
    background: "#fff",
    primary: "#000",
    blue: "#B8CBFA",
    green: "#D7F5CA",
    pink: "#F5CAF4",
    lightblue: "#CAF5F3",
    grey: "#CFD7DA",
    grey_light: "#dee5e8",
    primary_light: "#393939",
    purple: "#a580e6",
    purple_alpha: "#a580e65f",
    lightpurple: "#e1d0ff",
    red: "#ffa0a0",
  },
  deckColors: ["#B8CBFA", "#D7F5CA", "#F5CAF4", "#CAF5F3"],
  borderRadius: {
    sm: 12,
    md: 18,
    lg: 32,
  },
  boxShadow: {
    buttons: "0px 0px 18px rgba(0, 0, 0, 0.25)",
    small_buttons: "0px 0px 8px rgba(0, 0, 0, 0.16)",
    bottomContainer: "0px -5px 18px rgb(255, 255, 255)",
  },
  fontSize: {
    x_sm: 14,
    sm: 18,
    md: 20,
    lg: 23,
    x_lg: 26,
  },
  fontFamily: {
    regular: "Rubik_400Regular",
    bold: "Rubik_600SemiBold",
    italic: "Rubik_400Light_Italic",
  },
};
