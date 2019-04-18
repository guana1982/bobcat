import * as React from "react";
import { MButtonGroup } from "../common/ButtonGroup";
import mediumLevel from "@core/utils/lib/mediumLevel";
import { map, tap } from "rxjs/operators";

export const VideoSelection = () => {

  const [videoList, setVideoList] = React.useState<any[]>([]);
  const [videoSelected, setVideoSelected] = React.useState<any>(null);

  React.useEffect(() => {
    mediumLevel.video.getVideoList()
    .pipe(
      map((data: any) => {
        const { video } = data;
        let options = [];
        video.forEach((video, index) => {
          let option = {
            value: index,
            label: video.filename
          };
          options.push(option);
        });
        return options;
      })
    )
    .subscribe(
      data => setVideoList(data)
    );
  }, []);

  const finish = () => mediumLevel.video.setVideo(videoSelected.filename).subscribe();

  return (
    <MButtonGroup
      options={videoList}
      value={videoSelected}
      onChange={(value) => setVideoSelected(value)}
    />
  );
};

export const LanguageSelection = () => {

  const [languageList, setLanguageList] = React.useState<any[]>([]);
  const [languageSelected, setLanguageSelected] = React.useState<any>(null);

  React.useEffect(() => {
    mediumLevel.language.getLanguageList()
    .pipe(
      map((data: any) => {
        const { languages } = data;
        let options = [];
        languages.forEach((language, index) => {
          let option = {
            value: index,
            label: language.language
          };
          options.push(option);
        });
        return options;
      })
    )
    .subscribe(
      data => setLanguageList(data)
    );
  }, []);

  const finish = () => mediumLevel.language.setLanguage(languageSelected.language).subscribe();

  return (
    <MButtonGroup
      options={languageList}
      value={languageSelected}
      onChange={(value) => setLanguageSelected(value)}
    />
  );
};

export const CountrySelection = () => {

  const [countryList, setCountryList] = React.useState<any[]>([]);
  const [countrySelected, setCountrySelected] = React.useState<any>(null);

  React.useEffect(() => {
    mediumLevel.country.getCountryList()
    .pipe(
      map((data: any) => {
        const { countries } = data;
        let options = [];
        countries.forEach((country, index) => {
          let option = {
            value: index,
            label: country.country
          };
          options.push(option);
        });
        return options;
      })
    )
    .subscribe(
      data => setCountryList(data)
    );
  }, []);

  const finish = () => mediumLevel.country.setCountry(countrySelected.country).subscribe();

  return (
    <MButtonGroup
      options={countryList}
      value={countrySelected}
      onChange={(value) => setCountrySelected(value)}
    />
  );
};

export const PaymentSelection = () => {

  let paymentList = [{
    value: 0,
    label: "FREE"
  }, {
    value: 1,
    label: "PAID"
  }];

  React.useEffect(() => {
    // NEED => API GET PAYMENT MODE
  }, []);

  const [paymentSelected, setPaymentSelected] = React.useState<any>(null);

  const finish = () => mediumLevel.price.setPaymentType(paymentSelected.type).subscribe();

  return (
    <MButtonGroup
      options={paymentList}
      value={paymentSelected}
      onChange={(value) => setPaymentSelected(value)}
    />
  );
};

export const OperationSelection = () => {

  let operationList = [{
    value: 0,
    label: "PBC"
  }, {
    value: 1,
    label: "FOBO"
  }, {
    value: 2,
    label: "3PO"
  }];

  React.useEffect(() => {
    // NEED => API GET OPERATIONS
  }, []);

  const [operationSelected, setOperationSelected] = React.useState<any>(null);

  return (
    <MButtonGroup
      options={operationList}
      value={operationSelected}
      onChange={(value) => setOperationSelected(value)}
    />
  );
};
