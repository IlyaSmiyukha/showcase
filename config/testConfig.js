import '@testing-library/jest-dom/extend-expect';
import React from "react"
import 'jest-canvas-mock';
import _ from 'lodash';

React.useLayoutEffect = React.useEffect

global.APP_VERSION = '1'

global._ = _
