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
import { useState } from "react";
import FlagIcon from "@/components/ui/flagIcon";
import data from "@/data/countryCodes.json";
type Country = { name: string; code: string };
function App() {
  const { token, isAuthenticated, login } = useAuth();
  const [countries, setCountries] = useState<Country[]>([]);
  console.log("data", data);
  const countryOptions = Object.entries(data).map(([name, code]) => {
    console.log("name, code", name, code);
    return (
      <div className="flex flex-row items-center gap-x-2 w-full" key={code}>
        <FlagIcon src={String(code).toLowerCase()} />
        <SelectItem key={name} value={code}>
          {name}
        </SelectItem>
        <p>{12663}</p>
      </div>
    );
  });

  return (
    <>
      <div className="flex flex-row gap-2 md:flex-row">
        <Select>
          <SelectTrigger className="w-[80px] text-grey">
            <SelectValue placeholder="X" />
          </SelectTrigger>
          <SelectContent>
            <Input placeholder="Search country..." className="mb-2" />
            {countryOptions}
          </SelectContent>
        </Select>
        <Input placeholder="000-000-0000" className="mb-2" />
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
          <Button
            onClick={() => {
              console.log("Clicked");
              if (!isAuthenticated) {
                login();
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
