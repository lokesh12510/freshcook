import url from './url';

import { Login } from './Auth/login';
import { Dashboard } from './Dashboard/index';
import { Index as Employee } from './Employee/index';
import { Form as Employee_Form } from './Employee/form';
import { Index as Department } from './Department';
import { Index as Customer } from './Customer';
import { Index as Cook } from './Cook/index';
import { Form as Cook_Form } from './Cook/form';
import { Index as OrderList } from './OrderList';
import { Index as Food } from './Food/index';
import { Form as Food_Form } from './Food/form';


// routes
const routes = [
  {
    path: url.Login,
    element: Login,
    auth: false,
  },
  {
    path: url.Dashboard,
    element: Dashboard,
    auth: true,
    roles: ['ROLE_ADMIN', 'ROLE_CHEF'],
  },

  {
    path: url.Employee,
    element: Employee,
    breadcrumbName: "Employee List",
    auth: true,
    roles: ['ROLE_ADMIN', 'ROLE_CHEF'],
  },
  {
    path: url.EmployeeAdd,
    element: Employee_Form,
    breadcrumbName: "Add Employee",
    auth: true,
    roles: ['ROLE_ADMIN', 'ROLE_CHEF'],
  },  
  {
    path: url.EmployeeEdit + '/:id',
    element: Employee_Form,
    breadcrumbName: "Edit Employee",
    auth: true,
    roles: ['ROLE_ADMIN', 'ROLE_CHEF'],
  },  
  {
    path: url.Department,
    element: Department,
    breadcrumbName: "Department List",
    auth: true,
    roles: ['ROLE_ADMIN', 'ROLE_CHEF'],
  },
  {
    path: url.Customer,
    element: Customer,
    breadcrumbName: "Customer List",
    auth: true,
    roles: ['ROLE_ADMIN'],
  },

  {
    path: url.Cook,
    element: Cook,
    breadcrumbName: "Home Cook List",
    auth: true,
    roles: ['ROLE_ADMIN'],
  },
  {
    path: url.CookAdd,
    element: Cook_Form,
    breadcrumbName: "Add Home Cook",
    auth: true,
    roles: ['ROLE_ADMIN'],
  },
  {
    path: url.CookEdit + '/:id',
    element: Cook_Form,
    breadcrumbName: "Edit Home Cook",
    auth: true,
    roles: ['ROLE_ADMIN'],
  },
  
  {
    path: url.Order,
    element: OrderList,
    breadcrumbName: "Order List",
    auth: true,
    roles: ['ROLE_ADMIN','ROLE_CHEF'],
  },

  {
    path: url.Food,
    element: Food,
    breadcrumbName: "Food",
    auth: true,
    roles: ['ROLE_ADMIN','ROLE_CHEF'],
  },
  {
    path: url.FoodAdd,
    element: Food_Form,
    breadcrumbName: "Add Food",
    auth: true,
    roles: ['ROLE_CHEF'],
  },  
  {
    path: url.FoodEdit + '/:id',
    element: Food_Form,
    breadcrumbName: "Edit Food",
    auth: true,
    roles: ['ROLE_ADMIN', 'ROLE_CHEF'],
  },

];

export default routes;