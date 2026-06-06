import { Card } from "@/models/card";
import mitt from "mitt";

type AppEvents = {
  onCardEdited: Card;
  onCardRemovedFromSession : string;
};

export const eventProvider = mitt<AppEvents>();
