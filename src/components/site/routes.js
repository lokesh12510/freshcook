import url from './url';

import { Home } from './Home';
import { Confirm } from './OrderConfirm/confirm';
import {CustResetPwd} from './Auth/custResetPwd';

// routes
const routes = [
  {
    path: url.Home,
    element: Home,
    auth: false,
  },
  {
    path: url.OrderConfirm,
    element: Confirm,
    auth: true,
    roles: ['ROLE_CUSTOMER'],
  },
  {
    path: url.CustResetPwd,
    element: CustResetPwd,
    auth: false,
  },
];

export default routes;