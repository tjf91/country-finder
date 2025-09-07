import React from "react";
import FlagIcon from "./flagIcon";
import { SelectItem } from "./select";
import type { Country } from "@/App";

interface DropDownOptionsProps {
  countries: Record<string, Country>;
}

const DropDownOptions: React.FC<DropDownOptionsProps> = ({ countries }) => {
  if (Object.keys(countries).length === 0) {
    return <>Loading...</>;
  }
  const countryElements = [];
  for (const countryCode in countries) {
    if (countries.hasOwnProperty(countryCode)) {
      const country = countries[countryCode];
      countryElements.push(
        <div className="flex flex-row mb-1.5" key={countryCode}>
          <FlagIcon src={countryCode.toLowerCase()} />
          <SelectItem value={countryCode}>{country.name}</SelectItem>
          <p>{country.calling_code}</p>
        </div>,
      );
    }
  }

  return <div className="mt-5">{countryElements}</div>;
};

export default DropDownOptions;
