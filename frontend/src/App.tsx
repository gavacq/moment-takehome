import { useEffect, useState, useCallback } from "react";
import { fetchMeasurements, reseedDatabase, type Measurement } from "./lib/api";
import { VoltageChart } from "./components/VoltageChart";
import { Navbar } from "./components/Navbar";
import { useVoltageSimulator } from "./hooks/useVoltageSimulator";
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
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [showReseedConfirm, setShowReseedConfirm] = useState(false);
  const [viewWindow, setViewWindow] = useState<{ start: number; end: number }>({
    start: Date.now() - 60 * 60 * 1000,
    end: Date.now(),
  });

  const lastVoltage = data.length > 0 ? data[data.length - 1].voltage : 5.0;
  const { isSimulating, startSimulation, stopSimulation } = useVoltageSimulator(lastVoltage);

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

  const loadData = useCallback(async () => {
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
  }, [timeRange]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

  // Auto-refresh data when enabled or simulation is running
  useEffect(() => {
    let interval: any;
    if (autoRefresh || isSimulating) {
      interval = setInterval(() => {
        loadData();
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, isSimulating, timeRange]);

  const handleReseed = async () => {
    setLoading(true);
    try {
      await reseedDatabase();
      await loadData();
    } catch (err) {
      setError("Failed to reseed database");
      console.error(err);
    } finally {
      setLoading(false);
      setShowReseedConfirm(false);
    }
  };

  const handleToggleSimulation = async () => {
    if (isSimulating) {
      stopSimulation();
    } else {
      startSimulation();
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Navbar
        onReseed={() => setShowReseedConfirm(true)}
        onToggleSimulation={handleToggleSimulation}
        isSimulating={isSimulating}
        loading={loading}
      />

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Page header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Voltage Dashboard
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Real-time voltage monitoring for your battery systems.
          </p>
        </div>

        {/* Chart card */}
        <Card>
          <CardHeader className="space-y-4">
            {/* Battery Voltage Display */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Battery Voltage:</span>
              <span className="font-medium text-foreground">
                {lastVoltage.toFixed(2)}V
              </span>
              <span className="text-muted-foreground/60">({((lastVoltage / 5.0) * 100).toFixed(1)}%)</span>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <CardTitle>Voltage Levels</CardTitle>
                <CardDescription>
                  Showing voltage measurements for the last {timeRange}.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={timeRange}
                  onValueChange={(value) => setTimeRange(value as TimeRange)}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
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
                <Button
                  variant={autoRefresh || isSimulating ? "secondary" : "outline"}
                  size="icon"
                  onClick={() => {
                    const next = !autoRefresh;
                    setAutoRefresh(next);
                    if (next) loadData();
                  }}
                  className={autoRefresh || isSimulating ? "bg-accent/20 text-accent-foreground border-accent/50" : ""}
                  title={autoRefresh || isSimulating ? "Disable Auto-refresh" : "Enable Auto-refresh"}
                  disabled={loading || isSimulating}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${loading ? "animate-spin" : (autoRefresh || isSimulating) ? "animate-spin-slow" : ""
                      }`}
                  />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="flex h-[300px] sm:h-[400px] items-center justify-center text-red-500">
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
      </main>

      {showReseedConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Confirm Database Reseed</CardTitle>
              <CardDescription>
                This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Are you sure you want to clear all existing data and reseed the database with mock measurements?</p>
            </CardContent>
            <div className="flex justify-end space-x-2 p-6 pt-0">
              <Button variant="ghost" onClick={() => setShowReseedConfirm(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleReseed} disabled={loading}>
                {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : null}
                Confirm Reseed
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default App;
