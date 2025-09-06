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
import { useEffect, useRef, useState, type JSX } from "react";
import FlagIcon from "@/components/ui/flagIcon";
import mockCountries from "@/data/mockCountriesApi.json";
import PhoneNumberInput from "@/components/ui/numberFormat";

export type Country = {
  id: string;
  name: string;
  calling_code: string;
  phone_length: string;
};
function App() {
  const { token, isAuthenticated, login } = useAuth();
  const [originalCountries, setOriginalCountries] = useState<
    Record<string, Country>
  >({});
  const [countries, setCountries] = useState<Record<string, Country>>({});
  const [selectedCountry, setSelectedCountry] = useState<
    Record<string, Country>
  >({});
  const [phoneInput, setPhoneInput] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);
  const [error, setError] = useState<string | null>("");

  console.log("selectedCountry", selectedCountry);
  const phoneInputRef = useRef<HTMLInputElement | null>(null);
  const filterRef = useRef<HTMLInputElement | null>(null);
  function filterCountries(searchTerm: string) {
    const filtered = Object.fromEntries(
      Object.entries(originalCountries).filter(([code, country]) =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
    return filtered;
  }
  useEffect(() => {
    setOriginalCountries(mockCountries);
    setCountries(mockCountries);
  }, []);
  //****************************** */
  //TODO move to different file maybe
  let countryOptions: JSX.Element | JSX.Element[];
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
  } else {
    countryOptions = <div>Loading...</div>;
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
            <SelectTrigger
              className="w-[120px] text-grey"
              onClick={() => {
                setTimeout(() => {
                  filterRef.current?.focus();
                }, 100);
              }}
            >
              <SelectValue placeholder="Select country" />
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
                  : "+1"}
              </p>
            </SelectTrigger>
            <SelectContent>
              <div onKeyDown={(e) => e.stopPropagation()}>
                <Input
                  placeholder="Search country..."
                  className="mb-2"
                  ref={filterRef}
                  onChange={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setCountries(filterCountries(e.target.value));

                    // if(e.target.value.length<)
                  }}
                />
              </div>
              {countryOptions}
            </SelectContent>
          </Select>
        </div>
        <div>
          <PhoneNumberInput
            phoneInputRef={phoneInputRef}
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
            onChange={(value: string) => {
              setPhoneInput(value);
              setError("");
            }}
          />
        </div>
      </div>
      <div
        className={`h-5 flex items-center px-2 py-1 mb-2 bg-red-100 text-red-600 text-sm transition-opacity duration-200 ${
          error ? "opacity-100" : "opacity-0"
        }`}
      >
        {error}
      </div>

      <div>
        <div className="flex flex-wrap">
          <Button
            onClick={() => {
              console.log("Clicked");
              if (!isValid) {
                console.log("Invalid input");
                setError("Invalid phone number");
                phoneInputRef.current?.focus();
                return;
              }
              console.log("token", token);

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
