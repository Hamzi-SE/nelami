import nanoId from "./RandomIdGen";


const defaultList = () => {
    return;
};


const getBikeMake = (data) => {
    return data?.bikeMakeList?.map((bike) => {
        return <option key={nanoId()} value={bike}>{bike}</option>
    }
    )
}



export default defaultList;
export { getBikeMake };
