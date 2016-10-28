import * as React from 'react';
import { render } from 'react-dom';
import ColorMaterialTest from './feng3d/ColorMaterialTest';

import injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

import Main from './Main'; // Our custom react component

// React['addons'].injectTapEventPlugin();
// React['initializeTouchEvents'](true);

// Render the main app react component into the app div.
// For more details see: https://facebook.github.io/react/docs/top-level-api.html#react.render

render(<Main />, document.getElementById('app'));

new ColorMaterialTest();