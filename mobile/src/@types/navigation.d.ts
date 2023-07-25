export declare global {
  namespace ReactNavigation { // Type determining existing routes navigation
    interface RootParamList {
      home: undefined;
      new: undefined;
      habit: {
        date: string; // Parameters from one screen to another
      }
    }
  }
}
