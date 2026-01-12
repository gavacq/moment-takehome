import { Button } from "@/components/ui/button";
import { Database, Menu, X, Play, Square } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  onReseed: () => void;
  onToggleSimulation: () => void;
  isSimulating: boolean;
  loading: boolean;
}

export function Navbar({ onReseed, onToggleSimulation, isSimulating, loading }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and brand */}
          <div className="flex items-center gap-3">
            <img
              src="/moment-logo.png"
              alt="Moment Logo"
              className="h-8 w-auto"
            />
            <span className="text-xl font-bold tracking-tight text-foreground">
              Battery Monitor
            </span>
          </div>

          {/* Desktop actions */}
          <div className="hidden sm:flex sm:items-center sm:gap-2">
            <Button
              variant="outline"
              onClick={onReseed}
              disabled={loading}
              size="sm"
            >
              <Database className="mr-2 h-4 w-4" />
              Reseed DB
            </Button>
            <Button
              variant={isSimulating ? "destructive" : "default"}
              onClick={onToggleSimulation}
              disabled={loading}
              size="sm"
              className={isSimulating ? "" : "bg-[#4880e5] hover:bg-[#3a6bc7]"}
            >
              {isSimulating ? (
                <>
                  <Square className="mr-2 h-4 w-4" />
                  Stop Simulation
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Start Simulation
                </>
              )}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="space-y-2 px-4 pb-4 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                onReseed();
                setMobileMenuOpen(false);
              }}
              disabled={loading}
              className="w-full justify-center"
            >
              <Database className="mr-2 h-4 w-4" />
              Reseed DB
            </Button>
            <Button
              variant={isSimulating ? "destructive" : "default"}
              onClick={() => {
                onToggleSimulation();
                setMobileMenuOpen(false);
              }}
              disabled={loading}
              className={isSimulating ? "w-full justify-center" : "w-full justify-center bg-[#4880e5] hover:bg-[#3a6bc7]"}
            >
              {isSimulating ? (
                <>
                  <Square className="mr-2 h-4 w-4" />
                  Stop Simulation
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Start Simulation
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
