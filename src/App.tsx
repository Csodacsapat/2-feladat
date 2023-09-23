import React, {useState} from 'react';
import SideMenu from "./component/SideMenu/SideMenu";
import {Box} from "@mui/material";
import {DrawData} from "./utils/DrawData";



function App() {

    const [drawData,setDrawData] = useState<DrawData>({xPoint:0,yPoint:0})

    const getDataBack = (data:DrawData) =>{
        setDrawData(data)
    }

  return (
    <div className="App">
        <Box sx={{display:"flex"}}>
            <SideMenu sendDataBack={getDataBack}/>
        </Box>
    </div>
  );
}

export default App;
