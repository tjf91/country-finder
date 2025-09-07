import "tailwindcss";
import "./App.css";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "./hooks/useAuth";
import { useEffect, useMemo, useRef, useState, type JSX } from "react";
import FlagIcon from "@/components/ui/flagIcon";
import mockCountries from "@/data/mockCountriesApi.json";
import PhoneNumberInput from "@/components/ui/numberFormat";
import DropDownOptions from "./components/ui/dropDownOptions";
import { fetchCountries } from "./services/countries";

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
  const [dropDownOpen, setDropDownOpen] = useState<boolean>(false);
  const phoneInputRef = useRef<HTMLInputElement | null>(null);
  const filterRef = useRef<HTMLInputElement | null>(null);
  function filterCountries(searchTerm: string) {
    const filtered: Record<string, Country> = {};
    for (const code in originalCountries) {
      if (
        originalCountries.hasOwnProperty(code) &&
        originalCountries[code].name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      ) {
        filtered[code] = originalCountries[code];
      }
    }
    return filtered;
  }
  useEffect(() => {
    async function run() {
      try {
        // setLoading(true);
        setError(null);
        if (!token) {
          await login();
        }

        if (token && !Object.keys(originalCountries).length) {
          const data = await fetchCountries(token);
          setOriginalCountries(data);
          setCountries(data);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message ?? "Something went wrong");
        }
      } finally {
        // setLoading(false);
      }
    }

    run();
  }, [token]);

  //Need this to focus the search input when dropdown remounts
  useEffect(() => {
    if (dropDownOpen) {
      setTimeout(() => {
        filterRef.current?.focus();
      }, 10);
    }
  }, [countries, dropDownOpen]);

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
            onOpenChange={(e) => {
              if (!e) {
                setCountries(originalCountries);
                setDropDownOpen(false);
              }
            }}
            onValueChange={(value) => {
              setSelectedCountry({ [value]: countries[value] });
              setDropDownOpen(false);
              setTimeout(() => {
                phoneInputRef.current?.focus();
              }, 100);
            }}
          >
            <SelectTrigger
              className="w-[120px] text-grey"
              onClick={() => {
                setDropDownOpen(true);

                setTimeout(() => {
                  filterRef.current?.focus();
                }, 200);
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
            <SelectContent
              onCloseAutoFocus={(e) => {
                e.preventDefault();
                setDropDownOpen(false);
                setCountries(originalCountries);
              }}
            >
              <div
                className="sticky top-0 bg-white z-10 pb-2"
                onKeyDown={(e) => e.stopPropagation()}
              >
                <Input
                  placeholder="Search country..."
                  className="mb-2"
                  ref={filterRef}
                  onChange={(e) => {
                    setCountries(filterCountries(e.target.value));
                  }}
                />
              </div>
              <DropDownOptions countries={countries} />
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
              if (
                value.length ===
                Number(Object.values(selectedCountry)[0].phone_length)
              ) {
                setIsValid(true);
              }
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
            onClick={async () => {
              if (!isValid) {
                setError("Invalid phone number");
                phoneInputRef.current?.focus();
                return;
              }
              if (!isAuthenticated) {
                login();
              }
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
