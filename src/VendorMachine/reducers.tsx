export const reducers = {
  init: {
    NEXT: (data) => {
      const beverages = data.beverages.filter(b => {
        return (
          b.available === true
        );
      });
      return {
        ...data,
        beverages,
        beverage: null,
        availableBeverages: beverages,
      };
    },
  },
};
