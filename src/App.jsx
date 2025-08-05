import React, { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import UserManagement from "./components/UserManagement";
import Carousel from "./components/Carousel";

function App() {
  const [tab, setTab] = useState(0);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
 <Box sx={{ width: '100%' }}>
        <Tabs
          value={tab}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab label="User Management" />
          <Tab label="Image Carousel" />
        </Tabs>
      <Box p={2}>
        {tab == 0 && <UserManagement />}
        {tab == 1 && <Carousel />}
      </Box>
    </Box>
  );
}

export default App;
