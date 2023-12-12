import React, {useState} from 'react';
import SideMenu from "./component/SideMenu/SideMenu";
import {Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {DrawData} from "./types/DrawData";
import {SurfaceContainer} from './component/SurfaceContainer';

function App() {

    const [drawData, setDrawData] = useState<DrawData>({xPoint: 0, yPoint: 0})

    const [surfaceType, setSurfaceType] = React.useState('Bezier');

    const handleChange = (event: SelectChangeEvent) => {
        setSurfaceType(event.target.value);
    };
    
    const getDataBack = (data: DrawData) => {
        setDrawData(data)
    }

    return (
            <div className="App">
                <Box sx={{display: "flex"}}>
                    <div>
                        <FormControl sx={{ m: 1, minWidth: 80 }}>
                            <InputLabel id="demo-simple-select-autowidth-label">Surface</InputLabel>
                            <Select
                                labelId="demo-simple-select-autowidth-label"
                                id="demo-simple-select-autowidth"
                                value={surfaceType}
                                onChange={handleChange}
                                autoWidth
                                label="Surface Type"
                            >
                                <MenuItem value={"Bezier"}>Bezier</MenuItem>
                                <MenuItem value={"B-spline"}>B-spline</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    {(drawData.xPoint != 0 || drawData.yPoint != 0) &&
                        <SurfaceContainer drawData={drawData} surfaceType={surfaceType}></SurfaceContainer>}
                    <SideMenu sendDataBack={getDataBack}/>
                </Box>
            </div>
    );
}

export default App;
