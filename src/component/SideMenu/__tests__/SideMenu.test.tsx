import SideMenu from "../SideMenu"
import {render} from "@testing-library/react";

test("render sidemenu",()=>{
    const {getByLabelText,getByText} = render(<SideMenu sendDataBack={()=>{}}/>);
    // eslint-disable-next-line testing-library/prefer-screen-queries
    expect(getByLabelText("Horizontális pontok száma")).toBeInTheDocument();
    // eslint-disable-next-line testing-library/prefer-screen-queries
    expect(getByLabelText("Vertikális pontok száma")).toBeInTheDocument();
    // eslint-disable-next-line testing-library/prefer-screen-queries
    expect(getByText("Felület rajzolása.")).toBeInTheDocument();
})
