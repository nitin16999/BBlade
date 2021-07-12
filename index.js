/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import Test from './test'
import { name as appName } from './app.json';
import "react-native-gesture-handler"

AppRegistry.registerComponent(appName, () => App);

//AppRegistry.registerComponent(appName, () => Test);

