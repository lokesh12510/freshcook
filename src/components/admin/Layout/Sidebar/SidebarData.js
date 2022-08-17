import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as RiIcons from "react-icons/ri";

import url from '../../url';

export const SidebarData = [
	{
		title: "Login",
		path: url.Login,
		icon: <FaIcons.FaLock />,
		auth: false,
	},
	// {
	// 	title: "Register",
	// 	path: url.Signup,
	// 	icon: <FaIcons.FaUserPlus />,
	// 	auth: false,
	// },
	{
		title: "Dashboard",
		path: url.Dashboard,
		icon: <FaIcons.FaHome />,
		auth: true,
		roles: ['ROLE_ADMIN', 'ROLE_CHEF'],
	},
	// {
	// 	title: "Department",
	// 	path: url.Department,
	// 	icon: <FaIcons.FaRegBuilding />,
	// 	auth: true,
	// 	roles: ['ROLE_ADMIN', 'ROLE_CHEF'],
	// },
	// {
	// 	title: "Employee",
	// 	path: url.Employee,
	// 	icon: <FaIcons.FaUsers />,
	// 	auth: true,
	// 	roles: ['ROLE_ADMIN', 'ROLE_CHEF'],
	// 	iconClosed: <RiIcons.RiArrowDownSFill />,
	// 	iconOpened: <RiIcons.RiArrowUpSFill />,
	// 	subNav: [
	// 		{
	// 			title: "Manage",
	// 			path: url.Employee,
	// 			icon: <FaIcons.FaList />,
	// 			roles: ['ROLE_ADMIN', 'ROLE_CHEF'],
	// 		},
	// 		{
	// 			title: "Add",
	// 			path: url.EmployeeAdd,
	// 			icon: <FaIcons.FaPlusSquare />,
	// 			roles: ['ROLE_ADMIN', 'ROLE_CHEF'],
	// 		},
	// 	],
	// },
	{
		title: "Customer",
		path: url.Customer,
		icon: <FaIcons.FaUsers />,
		auth: true,
		roles: ['ROLE_ADMIN'],
	},
	{
		title: "Home Cook",
		path: url.Cook,
		icon: <FaIcons.FaUsers />,
		auth: true,
		roles: ['ROLE_ADMIN'],
	},
	{
		title: "Food",
		path: url.Food,
		icon: <FaIcons.FaUsers />,
		auth: true,
		roles: ['ROLE_ADMIN','ROLE_CHEF'],
	},
	{
		title: "Orders",
		path: url.Order,
		icon: <FaIcons.FaUsers />,
		auth: true,
		roles: ['ROLE_ADMIN','ROLE_CHEF'],
	},
	
];