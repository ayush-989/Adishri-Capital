import { useState, useEffect } from "react";
import { subscribeToApplications } from "../lib/services/application.service";
import type { LoanApplication } from "../lib/models/application.model";

interface UseApplicationsResult {
  applications: LoanApplication[];
  loading: boolean;
  error: string | null;
}

export const useApplications = (): UseApplicationsResult => {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("[useApplications] Subscribing to applications...");
    const unsubscribe = subscribeToApplications(
      (apps) => {
        console.log(`[useApplications] Received ${apps.length} applications`);
        console.log("[useApplications] Data:", JSON.stringify(apps.map(a => ({ id: a.id, status: a.status, name: a.basicDetails?.fullName }))));
        setApplications(apps);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("[useApplications] Firestore error:", err);
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  return { applications, loading, error };
};
