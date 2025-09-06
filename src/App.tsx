import "tailwindcss";
import "./App.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "./hooks/useAuth";
import { useEffect, useState } from "react";
import FlagIcon from "@/components/ui/flagIcon";
import mockCountries from "@/data/mockCountriesApi.json";
import PhoneNumberInput from "@/components/ui/numberFormat";

type Country = {
  id: string;
  name: string;
  calling_code: string;
  phone_length: string;
};
function App() {
  const { token, isAuthenticated, login } = useAuth();
  const [countries, setCountries] = useState<Record<string, Country>>({});
  const [selectedCountry, setSelectedCountry] = useState<
    Record<string, Country>
  >({});
  const [phoneInput, setPhoneInput] = useState<string>("");
  console.log("selectedCountry", selectedCountry);
  useEffect(() => {
    setCountries(mockCountries);
  }, []);
  //****************************** */
  //TODO move to different file maybe
  let countryOptions = <div>Loading...</div>;
  if (Object.keys(countries).length !== 0) {
    countryOptions = (
      <>
        {Object.entries(countries).map(([countryCode, country]) => {
          // const { calling_code, phone_length, name } = country;

          return (
            <div className="flex flex-row mb-1.5" key={countryCode}>
              <FlagIcon src={String(countryCode).toLowerCase()} />
              <SelectItem
                key={countryCode}
                value={countryCode}
                onClick={() => {
                  setSelectedCountry({ [countryCode]: country });
                }}
              >
                {country.name}
              </SelectItem>
              <p>{country.calling_code}</p>
            </div>
          );
        })}
      </>
    );
  }
  //****************************** */
  return (
    <>
      <div className="mb-4 flex flex-row gap-x-2">
        <div>
          <Select
            value={
              Object.keys(selectedCountry).length > 0
                ? Object.keys(selectedCountry)[0]
                : undefined
            }
          >
            <SelectTrigger className="w-[120px] text-grey">
              <FlagIcon
                src={
                  typeof selectedCountry === "object" &&
                  Object.keys(selectedCountry).length > 0
                    ? Object.keys(selectedCountry)[0].toLowerCase()
                    : "us"
                }
              />
              <p className="text-black">
                {Object.keys(selectedCountry).length > 0
                  ? Object.values(selectedCountry)[0].calling_code
                  : "1"}
              </p>
            </SelectTrigger>
            <SelectContent>
              <Input placeholder="Search country..." className="mb-2" />
              {countryOptions}
            </SelectContent>
          </Select>
        </div>
        <div>
          <PhoneNumberInput
            value={phoneInput}
            phone_length={
              Object.keys(selectedCountry).length > 0
                ? Number(Object.values(selectedCountry)[0].phone_length)
                : 10
            }
            placeholder={`(000)-000-${
              Object.keys(selectedCountry).length > 0
                ? "0".repeat(
                    Number(Object.values(selectedCountry)[0].phone_length) - 6,
                  )
                : "0000"
            }`}
            onChange={(value: string) => setPhoneInput(value)}
          />
        </div>
      </div>
      <div>
        {phoneInput.length > 0 && !/^\d{3}-\d{3}-\d{4}$/.test(phoneInput)
          ? "Incorrect phone number"
          : ""}
      </div>

      <div>
        <div className="flex flex-wrap">
          <Button
            onClick={() => {
              console.log("Clicked");
              if (!isAuthenticated) {
                login();
              }
              console.log("token", token);
              const countryResponse = mockCountries; // Replace with actual API call
              setCountries(countryResponse);
              // get countries here
            }}
          >
            Submit
          </Button>
        </div>
      </div>
    </>
  );
}

export default App;
