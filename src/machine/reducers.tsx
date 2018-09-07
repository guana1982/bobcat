export const reducers = {
  // init: {
  //   NEXT: (data) => {
  //     const beverages = data.beverages.filter(b => {
  //       return (
  //         b.available === true &&
  //         b.line_id !== -1 &&
  //         b.beverage_type !== 'top' &&
  //         b.status_id === 'ok'
  //       )
  //     })
  //     return {
  //       ...data,
  //       beverages: beverages.slice(0, data.installed_valves_number),
  //       beverage: beverages[0],
  //     }
  //   },
  // },
  prepayQr: {
    scanned: {
      NEXT: (newData, data) => {
        const beverages = newData.beverages.filter(b => {
          return (
            b.available === true &&
            b.country.indexOf(data.vendorConfig.country) > -1
          );
        });
        return {
          availableBeverages: beverages,
          beverage: beverages[0]
        };
      }
    }
  },
  postpayQr: {}
};
