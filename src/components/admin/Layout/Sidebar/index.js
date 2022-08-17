import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { IconContext } from "react-icons/lib";
import { useSelector } from 'react-redux';

import logo from '../../../../assets/img/logo.png';
import { SidebarData } from "./SidebarData";
import SubMenu from "./SubMenu";
import CheckAccess from "../../Auth/checkAccess";

const Nav = styled.div`
background: #15171c;
height: 80px;
display: flex;
justify-content: flex-start;
align-items: center;
`;

const NavIcon = styled(Link)`
margin-left: 2rem;
font-size: 2rem;
height: 80px;
display: flex;
justify-content: flex-start;
align-items: center;
`;

const SidebarNav = styled.nav`
background: #15171c;
width: 250px;
height: 100vh;
display: flex;
justify-content: center;
position: fixed;
top: 0;
left: ${({ sidebar }) => (sidebar ? "0" : "-100%")};
transition: 350ms;
z-index: 10;
`;

const SidebarWrap = styled.div`
width: 100%;
`;

const Sidebar = () => {
	const [sidebar, setSidebar] = useState(false);
	
	const showSidebar = () => setSidebar(!sidebar);
	
	const { isLoggedIn } = useSelector((state) => state.auth);
	
	return (
		<>
		<IconContext.Provider value={{ color: "#fff" }}>
			<Nav className="logosec">
				{/* <NavIcon to="#">
					<FaIcons.FaBars onClick={ showSidebar } />
				</NavIcon> */}
				<img src={ logo } width="110" />
			</Nav>
			<SidebarNav sidebar={sidebar} className="sidebar">
				<SidebarWrap>
					<NavIcon to="#" className="navclose">
						<FaIcons.FaTimes onClick={ showSidebar } />
					</NavIcon>
					{SidebarData.map((item, index) => {
						const { auth, roles } = item;
						const menuElement = (
							<SubMenu item={ item } />
						);
						return (
							<React.Fragment key={index}>
							{auth ? (
								isLoggedIn && (
									<CheckAccess request={roles}>
										{menuElement}
									</CheckAccess>
								)
							) : (
								!isLoggedIn && menuElement
							)}
							</React.Fragment>
						);
					})}
				</SidebarWrap>
			</SidebarNav>
		</IconContext.Provider>
		</>
	);
};

export default Sidebar;