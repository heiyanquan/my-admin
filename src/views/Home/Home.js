import { useEffect } from "react";
import "./style.scss";
import useSelectData from "./use-select-data";
import useMapFindPark from "./use-map-find-park";

function HomePage(props) {
  const { cityNameCodeList, districtNameCodeList } = useSelectData();
  const { loadMap, getIndexCluster } = useMapFindPark();

  useEffect(() => {
    loadMap().then(() => {
      getIndexCluster().then((res) => {
        console.log(11, res);
      });
    })
  }, []);
  return <div className="home_box">
    <div className='map_box' id='mapContainer'></div>
  </div>;
}

export default HomePage;
