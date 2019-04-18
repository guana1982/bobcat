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
      }),
      tap(data => {
        console.log("data", data);
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

  let languageList = [];

  React.useEffect(() => {
    mediumLevel.language.getLanguageList()
    .subscribe(
      data => languageList = data.languages
    );
  }, []);

  const [languageSelected, setLanguageSelected] = React.useState<any>(null);

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

  let countryList = [];

  React.useEffect(() => {
    mediumLevel.country.getCountryList()
    .subscribe(
      data => countryList = data.countries
    );
  }, []);

  const [countrySelected, setCountrySelected] = React.useState<any>(null);

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

  let paymentList = [];

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

  let languageList = [];

  React.useEffect(() => {
    mediumLevel.language.getLanguageList()
    .subscribe(
      data => languageList = data.languages
    );
  }, []);

  const [languageSelected, setLanguageSelected] = React.useState<any>(null);

  const finish = () => mediumLevel.language.setLanguage(languageSelected.language).subscribe();

  return (
    <MButtonGroup
      options={languageList}
      value={languageSelected}
      onChange={(value) => setLanguageSelected(value)}
    />
  );
};
