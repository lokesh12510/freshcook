import React, { useEffect, useState } from "react";
import {
  AppBar,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Box } from "@mui/system";
import { useTheme } from "@mui/material/styles";
import { Search as SearchIcon } from "@mui/icons-material";
import styled from "styled-components";
import SwipeableViews from "react-swipeable-views";
import PropTypes from "prop-types";
import { FilterAltOff as FilterAltOffIcon } from "@mui/icons-material";

import { TabIcons } from "../../../../utils/constants/Icons";
import { Theme } from "../../../../utils/constants/Theme";
import Item from "./Item";
import * as homeService from "../../services/homeService";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const a11yProps = (index) => {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
};

export default (props) => {
  const theme = useTheme();
  const fullWidth = useMediaQuery(theme.breakpoints.down("md"));

  const [tabIndex, setTabIndex] = useState(0);
  const [foodTypeList, setFoodTypeList] = useState([]);
  const [searchValues, setSearchValues] = useState({
    food_name: "",
  });

  useEffect(() => {
    const newTabIndex = foodTypeList.findIndex((x) => x.id === props.foodType);
    if (newTabIndex !== -1) {
      setTabIndex(newTabIndex);
    }
  }, [props]);
  useEffect(() => {
    getFoodTypeList();
  }, []);
  const getFoodTypeList = () => {
    homeService
      .foodTypeList()
      .then((response) => {
        setFoodTypeList(response.data);
        if(response.data && response.data?.length > 0)
        {
          props.onSelectFoodType(response.data[0].id);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleChangeSearch = (e) => {
    const { name, value } = e.target;
    setSearchValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      {foodTypeList && foodTypeList.length > 0 ? (
        <FoodListContainer>
          <FoodTabs position="static" elevation={0}>
            <Tabs
              value={props.foodType}
              onChange={(event, newValue) => {
                props.onSelectFoodType(newValue);
              }}
              textColor="inherit"
              variant={fullWidth ? "scrollable" : "fullWidth"}
              scrollButtons="auto"
              aria-label="scrollable force tabs example"
            >
              {foodTypeList.map((item, index) => {
                return (
                  <Tab
                    key={index}
                    value={item.id}
                    className="tab_btn"
                    label={item.type}
                    {...a11yProps(item.id)}
                    icon={<TabIcons type={item.type} />}
                    iconPosition="start"
                  />
                );
              })}
            </Tabs>
          </FoodTabs>
          <TabsContentSection>
            <SearchTextField
              name="food_name"
              value={searchValues.food_name}
              onChange={handleChangeSearch}
              variant="outlined"
              placeholder="Search Food Item"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon style={{ color: "#000" }} />
                  </InputAdornment>
                ),
              }}
            />

            {props.cookData && props.cookData?.id && (
              <Stack
                alignItems={"center"}
                justifyContent="space-between"
                direction="row"
                spacing={2}
                marginBottom={"25px"}
              >
                <Typography variant="p" component="div">
                  Showing{" "}
                  <Typography variant="span" fontWeight={"bold"}>
                    "{props.cookData?.kitchen_name}"
                  </Typography>{" "}
                  Menu List
                </Typography>

                <Button
                  className="d-xs-none"
                  variant="text"
                  style={{ whiteSpace: "nowrap" }}
                  startIcon={<FilterAltOffIcon />}
                  onClick={() => {
                    props.onSelectCook("");
                    props.onSelectCookData({});
                  }}
                >
                  Clear Shop
                </Button>
                <IconButton className="d-large-none" color="primary">
                  <FilterAltOffIcon />
                </IconButton>
              </Stack>
            )}

            <SwipeableViews
              axis={theme.direction === "rtl" ? "x-reverse" : "x"}
              index={tabIndex}
              onChangeIndex={(index) => {
                if (
                  foodTypeList &&
                  foodTypeList.length > 0 &&
                  foodTypeList[index].id
                ) {
                  props.onSelectFoodType(foodTypeList[index].id);
                }
              }}
            >
              {foodTypeList.map((item, index) => {
                return (
                  <TabPanel key={index} value={props.foodType} index={item.id}>
                    <Item {...props} search={searchValues} />
                  </TabPanel>
                );
              })}
            </SwipeableViews>
          </TabsContentSection>
        </FoodListContainer>
      ) : (
        <div className="text-center">
          <p className="p-5">No results found</p>
        </div>
      )}
    </>
  );
};

const FoodListContainer = styled(Box)`
  padding: 0;
  background-color: #fff;
  border: 1px solid #cbcbcb;
  padding-bottom: 35px;
  border-radius: 5px;
  overflow: hidden;
  & .MuiBox-root {
    padding: 0;
  }
`;

const FoodTabs = styled(AppBar)`
  background-color: #ebedf3;
  color: #000;

  & .MuiTab-root {
    padding-inline: 30px;
    text-align: center;
    min-width: 130px;
    border: 1px solid #cbcbcb;
    color: #000;
    font-weight: bold;
    gap: 5px;
    &.Mui-selected {
      & svg {
        & path {
          fill: ${Theme.palette.secondary.dark};
        }
      }
    }
  }

  @media (max-width: 600px) {
    & .MuiTab-root {
      padding-inline: 10px;
      text-align: center;
      min-width: 130px;
      min-height: 60px;
    }
  }

  & .Mui-selected {
    background-color: #fff;
    text-align: center;
    color: ${Theme.secondary.dark};
    border: none;
    & .MuiTab-iconWrapper {
      path {
        fill: ${Theme.secondary.dark};
      }
    }
  }
  & .MuiTabs-indicator {
    display: none;
  }
`;

const SearchTextField = styled(TextField)`
  padding-block: 20px;
  width: 100%;
  color: #000;
  & .MuiOutlinedInput-root {
    width: 100%;
  }

  & .MuiOutlinedInput-input {
    color: #000;
    padding: 11.5px 14px;
    z-index: 1;
  }

  & .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
    border-color: white;
    color: white;
    border-radius: 50px;
    background-color: #f6f6f6;
    top: 0;
  }
  & :hover.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
    border-color: ${Theme.secondary.main};
  }
  & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: ${Theme.secondary.main};
  }
  & .MuiInputAdornment-root {
    z-index: 1;
  }
  & fieldset {
    & legend {
      display: none;
    }
  }
`;

const TabsContentSection = styled.div`
  padding: 20px;
  @media (max-width: 370px) {
    padding: 10px;
  }
`;
