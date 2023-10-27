import React, {useState} from 'react';
import SideMenu from "./component/SideMenu/SideMenu";
import {Box} from "@mui/material";
import {DrawData} from "./utils/DrawData";
import { SurfaceContainer } from './component/SurfaceContainer';

function App() {

    const [drawData,setDrawData] = useState<DrawData>({xPoint:0,yPoint:0})

    const getDataBack = (data:DrawData) =>{
        setDrawData(data)
    }

  return (
    <div className="App">
        <Box sx={{display:"flex"}}>
            <SurfaceContainer drawData={drawData}></SurfaceContainer>
            <SideMenu sendDataBack={getDataBack}/>
        </Box>
    </div>
  );
}

export default App;
