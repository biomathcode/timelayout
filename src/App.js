import DropArea from "./ui/DropArea";
import VerticalGrid from "./ui/Grid";
import LanguageProvider, { useLanguage } from "./context/uselang";
import "./styles.css";
import "./command.css";
import Sidebar from "./ui/Sidebar";
import { I18nProvider } from "react-aria";
import { today, getLocalTimeZone } from "@internationalized/date";
import { WeekView } from "./ui/WeekView";
import { apiUrl } from "./data";
import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import CommandMenu from "./command";

export default function App() {
  const { language } = useLanguage();

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        setWeatherData(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <I18nProvider locale={language.lang}>
      <div className="App">
        <Toaster />

        <CommandMenu />
        <Sidebar />
        <div className="cal-container">
          <WeekView defaultValue={today(getLocalTimeZone())} />
          {/* <div className="flex cal-container ">
            <VerticalGrid />
            <DropArea />
          </div> */}
        </div>
      </div>
    </I18nProvider>
  );
}
