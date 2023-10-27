import {Points} from "../../../types/Points";
import {getNearestPoint} from "../getNearestPoint";
import {createControlPoints} from "../controlPoint";

test("Clicked on canvas x=-0.5 and y = -0.5 coords",()=>{
    let points:Points[][] = createControlPoints({xPoint:5,yPoint:4})

    const clickedX = -0.5;
    const clickedY = -0.5;
    const [point,indexes] = getNearestPoint(clickedX,clickedY,points);
    expect(point).toEqual(null);
    expect(indexes).toEqual({i:-1,j:-1});
})

test("Clicked on canvas x=0.015 and y = -0.266 coords",()=>{
    let points:Points[][] = createControlPoints({xPoint:5,yPoint:4})
    const clickedX = 0.014999999999999902;
    const clickedY = -0.2633333333333334;
    const [point,indexes] = getNearestPoint(clickedX,clickedY,points);
    expect(point).toEqual({x:0,y:-0.2666666666666667,z:0});
    expect(indexes).toEqual({i:2,j:1});
})
