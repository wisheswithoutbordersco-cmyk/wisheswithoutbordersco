import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  RefreshCw,
  Play,
  LogOut,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Database,
  ArrowDown,
  ArrowUp,
  Globe,
  BarChart3,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface SyncStatus {
  isSyncing: boolean;
  lastSyncTime: string | null;
  lastSyncStatus: "success" | "error" | "pending" | "idle";
  rowsProcessed: number;
  rowsInserted: number;
  rowsUpdated: number;
  errors: string[];
  currentStep: string;
}

interface SyncLogEntry {
  timestamp: string;
  action: string;
  rows_affected: string;
  status: string;
  error_details: string;
}

interface AnalyticsRow {
  country: string;
  userType: string;
  users: number;
}

// ─── Dashboard Component ─────────────────────────────────────────────────────
export default function AdminCmsPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const [, navigate] = useLocation();
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [syncLogs, setSyncLogs] = useState<SyncLogEntry[]>([]);
  const [isTriggering, setIsTriggering] = useState(false);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const [logError, setLogError] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Analytics state ──
  const [analyticsData, setAnalyticsData] = useState<AnalyticsRow[]>([]);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);

  const isAdmin = user?.role === "admin";

  const utils = trpc.useUtils();

  // ── Fetch sync status ──
  const fetchSyncStatus = useCallback(async () => {
    if (!isAdmin) return null;
    try {
      const data = await utils.admin.getSyncStatus.fetch();
      setSyncStatus(data as SyncStatus);
      return data;
    } catch (err) {
      console.error("Failed to fetch sync status:", err);
    }
    return null;
  }, [isAdmin, utils]);

  // ── Fetch sync logs ──
  const fetchSyncLogs = useCallback(async () => {
    if (!isAdmin) return;
    setIsLoadingLogs(true);
    setLogError(null);
    try {
      const data = await utils.admin.getSyncLogs.fetch();
      setSyncLogs((data.logs as SyncLogEntry[]) || []);
    } catch (err) {
      setLogError("Failed to fetch sync logs");
    } finally {
      setIsLoadingLogs(false);
    }
  }, [isAdmin, utils]);

  // ── Fetch analytics data ──
  const fetchAnalytics = useCallback(async () => {
    if (!isAdmin) return;
    setIsLoadingAnalytics(true);
    try {
      const res = await utils.admin.getAnalyticsData.fetch();
      setAnalyticsData(res.data as AnalyticsRow[]);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    } finally {
      setIsLoadingAnalytics(false);
    }
  }, [isAdmin, utils]);

  // Initial data load
  useEffect(() => {
    if (isAdmin) {
      fetchSyncStatus();
      fetchSyncLogs();
      fetchAnalytics();
    }
  }, [isAdmin, fetchSyncStatus, fetchSyncLogs, fetchAnalytics]);

  // Polling during active sync
  useEffect(() => {
    if (syncStatus?.isSyncing) {
      pollingRef.current = setInterval(fetchSyncStatus, 2000);
    } else {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    }
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [syncStatus?.isSyncing, fetchSyncStatus]);

  // ── Trigger sync ──
  const triggerSyncMutation = trpc.admin.triggerSync.useMutation({
    onMutate: () => {
      setIsTriggering(true);
    },
    onSuccess: () => {
      // Start polling for status
      fetchSyncStatus();
      // Refresh logs after a delay
      setTimeout(fetchSyncLogs, 3000);
    },
    onError: (err) => {
      console.error("Sync trigger failed:", err);
    },
    onSettled: () => {
      setIsTriggering(false);
    },
  });

  const handleTriggerSync = () => {
    if (!isAdmin) return;
    triggerSyncMutation.mutate();
  };

  const handleSignOut = async () => {
    // Clean up any stale localStorage token from old flow
    localStorage.removeItem("admin-cms-token");
    await logout();
  };

  // ── Loading state ──
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  // ── Not authenticated or not admin ──
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto mt-24 text-center px-4">
          <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-200">
            <Globe className="w-10 h-10 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Only</h1>
            <p className="text-gray-500 text-sm mb-6">
              You need to sign in with an admin account to view the CMS dashboard.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/admin/cms/login"
                className="inline-block w-full rounded-lg bg-primary hover:opacity-90 text-white font-semibold py-2.5 transition-opacity"
              >
                Sign In
              </Link>
              <Link href="/" className="text-primary hover:underline text-sm font-semibold">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Globe className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold">CMS Dashboard</h1>
              <p className="text-xs text-muted-foreground">
                Google Sheet Sync Manager
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Sync Control Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Sync Control
                </CardTitle>
                <CardDescription>
                  Sync products from Google Sheet to the database
                </CardDescription>
              </div>
              <Button
                onClick={handleTriggerSync}
                disabled={isTriggering || syncStatus?.isSyncing}
                className="gap-2"
              >
                {isTriggering || syncStatus?.isSyncing ? (
                  <>
                    <Spinner className="h-4 w-4" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Run Sync
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Status Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <StatusIcon
                    status={syncStatus?.lastSyncStatus ?? "idle"}
                  />
                  <span className="text-xs font-medium text-muted-foreground">
                    Status
                  </span>
                </div>
                <StatusBadge
                  status={syncStatus?.lastSyncStatus ?? "idle"}
                />
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Rows Processed
                </p>
                <p className="text-2xl font-bold">
                  {syncStatus?.rowsProcessed ?? 0}
                </p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center justify-center gap-1">
                  <ArrowDown className="h-3 w-3 text-green-600" />
                  Inserted
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {syncStatus?.rowsInserted ?? 0}
                </p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center justify-center gap-1">
                  <ArrowUp className="h-3 w-3 text-blue-600" />
                  Updated
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {syncStatus?.rowsUpdated ?? 0}
                </p>
              </div>
            </div>

            {/* Current Step */}
            {syncStatus?.currentStep && syncStatus.isSyncing && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <span className="font-medium">Current step:</span>{" "}
                  {syncStatus.currentStep}
                </p>
              </div>
            )}

            {/* Last Sync Time */}
            {syncStatus?.lastSyncTime && (
              <p className="mt-3 text-xs text-muted-foreground">
                Last sync: {formatTimestamp(syncStatus.lastSyncTime)}
              </p>
            )}

            {/* Errors */}
            {syncStatus?.errors && syncStatus.errors.length > 0 && (
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Sync Errors</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside text-xs mt-1 space-y-0.5">
                    {syncStatus.errors.slice(0, 10).map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                    {syncStatus.errors.length > 10 && (
                      <li>
                        ...and {syncStatus.errors.length - 10} more errors
                      </li>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Sync Logs Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Sync Log</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchSyncLogs}
                disabled={isLoadingLogs}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isLoadingLogs ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {logError && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{logError}</AlertDescription>
              </Alert>
            )}
            {isLoadingLogs ? (
              <div className="flex items-center justify-center py-8">
                <Spinner className="h-8 w-8" />
              </div>
            ) : syncLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No sync logs found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3 font-medium">Timestamp</th>
                      <th className="text-left p-3 font-medium">Action</th>
                      <th className="text-right p-3 font-medium">
                        Rows Affected
                      </th>
                      <th className="text-left p-3 font-medium">Status</th>
                      <th className="text-left p-3 font-medium">
                        Error Details
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {syncLogs.map((log, index) => (
                      <tr
                        key={index}
                        className="border-b hover:bg-muted/30 transition-colors"
                      >
                        <td className="p-3 whitespace-nowrap">
                          {formatTimestamp(log.timestamp)}
                        </td>
                        <td className="p-3">
                          <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                            {log.action}
                          </code>
                        </td>
                        <td className="p-3 text-right font-mono">
                          {log.rows_affected}
                        </td>
                        <td className="p-3">
                          <LogStatusBadge status={log.status} />
                        </td>
                        <td className="p-3 max-w-xs truncate">
                          {log.error_details ? (
                            <span
                              className="text-destructive text-xs cursor-help"
                              title={log.error_details}
                            >
                              {log.error_details.length > 80
                                ? log.error_details.slice(0, 80) + "..."
                                : log.error_details}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Visitor Analytics Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Visitor Analytics (Last 30 Days)
                </CardTitle>
                <CardDescription>
                  User location and New vs. Returning visitors from Google Analytics
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchAnalytics}
                disabled={isLoadingAnalytics}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isLoadingAnalytics ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingAnalytics ? (
              <div className="flex items-center justify-center py-8">
                <Spinner className="h-8 w-8" />
              </div>
            ) : analyticsData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No analytics data available</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3 font-medium">Country / Region</th>
                      <th className="text-left p-3 font-medium">User Type</th>
                      <th className="text-right p-3 font-medium">Active Users</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.map((row, index) => (
                      <tr
                        key={index}
                        className="border-b hover:bg-muted/30 transition-colors"
                      >
                        <td className="p-3">{row.country}</td>
                        <td className="p-3">
                          <Badge
                            variant={row.userType === "new" ? "default" : "secondary"}
                            className={
                              row.userType === "new"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : ""
                            }
                          >
                            {row.userType === "new" ? "New" : row.userType === "returning" ? "Returning" : row.userType}
                          </Badge>
                        </td>
                        <td className="p-3 text-right font-mono">{row.users}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

// ─── Helper Components ───────────────────────────────────────────────────────
function StatusIcon({
  status,
}: {
  status: "success" | "error" | "pending" | "idle";
}) {
  switch (status) {
    case "success":
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    case "error":
      return <XCircle className="h-4 w-4 text-red-600" />;
    case "pending":
      return <Spinner className="h-4 w-4 text-yellow-600" />;
    case "idle":
    default:
      return <Clock className="h-4 w-4 text-gray-400" />;
  }
}

function StatusBadge({
  status,
}: {
  status: "success" | "error" | "pending" | "idle";
}) {
  switch (status) {
    case "success":
      return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Success</Badge>;
    case "error":
      return <Badge variant="destructive">Error</Badge>;
    case "pending":
      return <Badge variant="default" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Syncing</Badge>;
    case "idle":
    default:
      return <Badge variant="secondary">Idle</Badge>;
  }
}

function LogStatusBadge({ status }: { status: string }) {
  const normalized = status.toUpperCase();
  if (normalized === "SUCCESS") {
    return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">SUCCESS</Badge>;
  }
  if (normalized === "PARTIAL_SUCCESS") {
    return <Badge variant="default" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">PARTIAL</Badge>;
  }
  if (normalized === "ERROR") {
    return <Badge variant="destructive">ERROR</Badge>;
  }
  return <Badge variant="secondary">{status}</Badge>;
}

// ─── Utility Functions ───────────────────────────────────────────────────────
function formatTimestamp(iso: string): string {
  try {
    const date = new Date(iso);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  } catch {
    return iso;
  }
}
