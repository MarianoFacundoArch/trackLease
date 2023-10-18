const createPriceRecordDataObject = (
  complexName,
  unit,
  numberOfBedrooms,
  numberOfBathrooms,
  squareFeet,
  price
) => {
  return {
    complexName,
    unit,
    numberOfBedrooms: parseInt(numberOfBedrooms),
    numberOfBathrooms: parseInt(numberOfBathrooms),
    squareFeet: parseInt(squareFeet),
    price: parseInt(price),
  };
};

export default createPriceRecordDataObject;
