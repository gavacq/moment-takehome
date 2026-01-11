import { useEffect, useState } from "react";
import { fetchMeasurements, type Measurement } from "./lib/api";
import { VoltageChart } from "./components/VoltageChart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";

type TimeRange = "1m" | "15m" | "1hr" | "6hr" | "12hr";

function App() {
  const [data, setData] = useState<Measurement[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>("1hr");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewWindow, setViewWindow] = useState<{ start: number; end: number }>({
    start: Date.now() - 60 * 60 * 1000,
    end: Date.now(),
  });

  const getStartDate = (range: TimeRange, end: Date) => {
    switch (range) {
      case "1m":
        return new Date(end.getTime() - 1 * 60 * 1000);
      case "15m":
        return new Date(end.getTime() - 15 * 60 * 1000);
      case "1hr":
        return new Date(end.getTime() - 60 * 60 * 1000);
      case "6hr":
        return new Date(end.getTime() - 6 * 60 * 60 * 1000);
      case "12hr":
        return new Date(end.getTime() - 12 * 60 * 60 * 1000);
      default:
        return new Date(end.getTime() - 60 * 60 * 1000);
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const now = new Date();
      const startDate = getStartDate(timeRange, now);

      setViewWindow({
        start: startDate.getTime(),
        end: now.getTime(),
      });

      const measurements = await fetchMeasurements(startDate, now);
      setData(measurements);
    } catch (err) {
      setError("Failed to fetch data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

  return (
    <div className="min-h-screen bg-background p-8 font-sans antialiased">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Battery Monitor</h1>
          <p className="text-muted-foreground">
            Real-time voltage monitoring dashboard.
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Voltage Levels</CardTitle>
                <CardDescription>
                  Showing voltage measurements for the last {timeRange}.
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Select
                  value={timeRange}
                  onValueChange={(value) => setTimeRange(value as TimeRange)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1m">Last 1 Minute</SelectItem>
                    <SelectItem value="15m">Last 15 Minutes</SelectItem>
                    <SelectItem value="1hr">Last 1 Hour</SelectItem>
                    <SelectItem value="6hr">Last 6 Hours</SelectItem>
                    <SelectItem value="12hr">Last 12 Hours</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={loadData} disabled={loading}>
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="flex h-[400px] items-center justify-center text-red-500">
                {error}
              </div>
            ) : (
                <VoltageChart
                  data={data}
                  startTime={viewWindow.start}
                  endTime={viewWindow.end}
                />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
