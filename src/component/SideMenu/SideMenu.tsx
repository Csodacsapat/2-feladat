import {useState} from "react";
import {DrawData} from "../../types/DrawData";
import {Box, Button, TextField} from "@mui/material";

type props = {
    sendDataBack: Function
}

export default function SideMenu({sendDataBack}: props) {

    const [drawData, setDrawData] = useState<DrawData>({xPoint: 5, yPoint: 4})
    return <Box sx={{display: "flex", flexDirection: "column", float:"right"}} className={"menuContainer"}>
        <TextField InputProps={{inputProps:{min:1}}} type="number" id="outlined-basic" label="Horizontális pontok száma" variant="outlined"
                   value={drawData.xPoint} onChange={
            (data) => {
                let newXPoint: number = Number(data.target.value)
                setDrawData({...drawData, xPoint: newXPoint})
            }
        }/>
        <TextField InputProps={{inputProps:{min:1}}} type="number" id="outlined-basic" label="Vertikális pontok száma" variant="outlined"
                   value={drawData.yPoint} onChange={
            (data) => {
                let newYPoint: number = Number(data.target.value)
                setDrawData({...drawData, yPoint: newYPoint})
            }
        }/>
        <Button variant="outlined" onClick={()=>{sendDataBack(drawData)}}>Felület rajzolása.</Button>
    </Box>

}
