import {useState} from "react";
import {DrawData} from "../../utils/DrawData";
import {Box, Button, TextField} from "@mui/material";
import { Vector, Matrix } from 'ts-matrix';

type props = {
    sendDataBack: Function
}

export default function SideMenu({sendDataBack}: props) {

    const [drawData, setDrawData] = useState<DrawData>({xPoint: 5, yPoint: 4})
    return <Box sx={{display: "flex", flexDirection: "column"}}>
        <TextField type="number" id="outlined-basic" label="Horizontális pontok száma" variant="outlined"
                   value={drawData.xPoint} onChange={
            (data) => {
                let newXPoint: number = Number(data.target.value)
                setDrawData({...drawData, xPoint: newXPoint})
            }
        }/>
        <TextField type="number" id="outlined-basic" label="Vertikális pontok száma" variant="outlined"
                   value={drawData.yPoint} onChange={
            (data) => {
                let newYPoint: number = Number(data.target.value)
                setDrawData({...drawData, yPoint: newYPoint})
            }
        }/>
        <Button variant="outlined" onClick={()=>{sendDataBack(drawData)}}>Felület rajzolása.</Button>
    </Box>

}
