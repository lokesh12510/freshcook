import React, { useEffect, useState } from "react";
import { Box, Tab, Tabs, tabsClasses } from "@mui/material";

import { HScrollContainer, HSliderHeader, SectionBox } from "../../../../utils/constants/Styles";
import Item from "./Item";
import * as homeService from "../../services/homeService";

const Index = (props) => {
  const [cookList, setCookList] = useState([]);
  
  useEffect(() => {
    getCookList();
  }, [props.latitude, props.longitude]);
  const getCookList = () => {
    const data = {
      page: 1,
      perPage: 100,
      latitude: props.latitude,
      longitude: props.longitude,
    };
    homeService.cookList(data)
    .then((response) => {
      setCookList(response.data.list);
    }).catch((e) => {
      console.log(e);
    });

  };
  
  return (
    <SectionBox>
      <HSliderHeader marginBottom={"10px"}>
        Top Popular Kitchen
      </HSliderHeader>
      {cookList && cookList.length > 0 ? (
        <Box
          sx={{
            flexGrow: 1,
            bgcolor: "background.paper",
          }}
        >
          <HScrollContainer
            value={props.cook || ''}
            onChange={(event, newValue) => {
              props.onSelectCook(newValue);
              const newCookData = cookList.find(x => x.id === newValue);
              if(newCookData)
              {
                props.onSelectCookData(newCookData);
              }
            }}
            variant="scrollable"
            scrollButtons
            aria-label="visible arrows tabs example"
            sx={{
              [`& .${tabsClasses.scrollButtons}`]: {
                "&.Mui-disabled": { opacity: 0.3 },
              },
            }}
          >
            {cookList.map((item, index) => (
            <Tab 
              key={index}
              value={item.id}
              label={
                <Item {...props} item={item} />
              }
            />
            ))}
          </HScrollContainer>
        </Box>
      ) : (
        <div className="text-center">
          <p className="p-5">No results found</p>
        </div>
      )}
    </SectionBox>
  );
};

export default Index;