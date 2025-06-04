interface Props {
  openApp?: any;
}
const SplashFunctions: Props = {};

SplashFunctions.openApp = (navigation: any) => {
  navigation.replace('Onboarding');
};

export default SplashFunctions;
