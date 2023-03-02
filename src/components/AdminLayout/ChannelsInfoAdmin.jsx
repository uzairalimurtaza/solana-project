import React, { useState, useEffect } from "react";
import ResponsiveDrawer from "../../pages/Admin/Admin";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { userRequest } from "../../api/Url";
import Axios from "../../api/Axios";
import ContentCreatorTable from "./ContentCreatorTable";
import styled from "styled-components";
import CircularProgress from '@mui/material/CircularProgress';

function TabPanel(props) {

  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ maxWidth: "100%" }}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const ChannelsInfoAdmin = () => {
  
  const [value, setValue] = useState(0);
  const [contentCreatorData, setcontentCreatorData] = useState([]);
  const [loader, setLoader] = useState(false)

  const handleChange = (event, newValue) => {
    setValue(newValue);
    getChannels(newValue + 1);
  };

  useEffect(() => {
    getChannels(1);
  }, []);

  const getChannels = async (status) => {
    // console.log(status,'sasdasdasdas')
    try {
      setLoader(true)
      const data = {
        user_status: status,
      };
      const headers = {
        headers: {
          Authorization: localStorage.getItem("uToken"),
        },
      };
      const response = await Axios.post(userRequest, data, headers);
      console.log(response.data, 'status')

      if (!response.data.status) {
        setLoader(false)
        setcontentCreatorData([])
      }
      else {
        setLoader(false)
        setcontentCreatorData(response.data.data);
      }
    } catch (e) {
      setLoader(false)
      console.log(e);
    }
  };

  return (
    <>
      <ResponsiveDrawer>
        <Styled>
          <Box className='content-wrapper'>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab className='tab-heading-pending' label="Pending" />
                <Tab className='tab-heading-approve' label="Approved" />
                <Tab className='tab-heading-reject' label="Rejected" />
              </Tabs>
            </Box>
            <TabPanel className='tab-panel' value={value} index={0}>
              {loader ? (
                <CircularProgress
                  style={{
                    marginTop: '30px',
                  }}
                />
              ) :
                <ContentCreatorTable
                  getData={getChannels}
                  contentCreatorData={contentCreatorData}
                  value={value + 1}
                />
              }
            </TabPanel>
            <TabPanel className='tab-panel' value={value} index={1}>
              {loader ? (
                <CircularProgress
                  style={{
                    marginTop: '30px',
                  }}
                />
              ) :
                <ContentCreatorTable
                  getData={getChannels}
                  contentCreatorData={contentCreatorData}
                  value={value + 1}
                />
              }
            </TabPanel>
            <TabPanel className='tab-panel' value={value} index={2}>
              {loader ? (
                <CircularProgress
                  style={{
                    marginTop: '30px',
                  }}
                />
              ) :
                <ContentCreatorTable
                  getData={getChannels}
                  contentCreatorData={contentCreatorData}
                  value={value + 1}
                />
              }
            </TabPanel>
          </Box>
        </Styled>
      </ResponsiveDrawer>`
    </>
  );
};

const Styled = styled.section`
  
  .content-wrapper {
    padding:10px;
    background-color:white;
    margin-top:45px;
    width:80%;
    overflow-x: auto;
  }
  .tab-heading {
    font-weight:bold
  }
  .tab-heading-pending.Mui-selected {
    font-weight:bold;
    background-color:yellow;
    color:grey !important;
  }
  .tab-heading-approve.Mui-selected {
    background-color:green;
    font-weight:bold;
    color:white !important;
  }
  .tab-heading-reject.Mui-selected {
    background-color:red;
    font-weight:bold;
    color:white !important;
  }
  @media (max-width: 767px) {
    .content-wrapper {
      width:auto
    }
  }
`;

export default ChannelsInfoAdmin;
