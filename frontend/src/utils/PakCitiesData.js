import nanoId from "./RandomIdGen";


const defaultList = () => {
  return;
};


const getAllCitiesDropList = (data) => {
  return data?.allCitiesList?.map((city) => {
    return <option key={nanoId()} value={city}>{city}</option>
  }
  )
}



const getProvinceDropList = (data) => {
  return data?.provinceList?.map((province) => {

    return <option key={nanoId()} value={province}>{province}</option>
  }
  )

};

const getPunjabCitiesDropList = (data) => {
  return data?.punjabCitiesList?.map((city) => {
    return <option key={nanoId()} value={city}>{city}</option>
  }
  )
};

const getSindhCitiesDropList = (data) => {
  return data?.sindhCitiesList?.map((city) => {
    return <option key={nanoId()} value={city}>{city}</option>
  }
  )
};

const getBalochistanCitiesDropList = (data) => {
  return data?.balochistanCitiesList?.map((city) => {
    return <option key={nanoId()} value={city}>{city}</option>
  }
  )
};

const getKPKCitiesDropList = (data) => {
  return data?.kpkCitiesList?.map((city) => {
    return <option key={nanoId()} value={city}>{city}</option>
  }
  )
};

const getAzadKashmirCitiesDropList = (data) => {
  return data?.azadKashmirCitiesList?.map((city) => {
    return <option key={nanoId()} value={city}>{city}</option>
  }
  )
};

const getNorthernAreasCitiesDropList = (data) => {
  return data?.northernAreasList?.map((city) => {
    return <option key={nanoId()} value={city}>{city}</option>
  }
  )
};

const getIslamabadSectorsDropList = (data) => {
  return data?.islamabadSectorsList?.map((sector) => {
    return <option key={nanoId()} value={sector}>{sector}</option>
  }
  )
};

export default defaultList;
export { getProvinceDropList, getIslamabadSectorsDropList, getNorthernAreasCitiesDropList, getAzadKashmirCitiesDropList, getPunjabCitiesDropList, getKPKCitiesDropList, getSindhCitiesDropList, getBalochistanCitiesDropList, getAllCitiesDropList };
