import * as i18n from "i18next";

i18n
  .init({
    interpolation: {
      escapeValue: false,
    },
    lng: "en",
    resources: {
      en: {
        translation: {
          age: { label: "Age", },
          home: { label: "Home", },
          name: { label: "Name", },
        },
      },
      es: {
        translation: {
          age: { label: "Años", },
          home: { label: "Casa", },
          name: { label: "Nombre", },
        },
      },
    },
  });

export default i18n;