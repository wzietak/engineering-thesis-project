import { globalStyles } from "@/styles/globalStyles";
import { theme } from "@/styles/theme";
import { View } from "react-native";


type Props={
    label: string;
    color?: keyof typeof theme.colors;
}

export default function Deck({label, color} : Props){
    return(
        <View style={globalStyles.deckContainer}></View>
    )
}