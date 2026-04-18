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
    const unsubscribe = subscribeToApplications(
      (apps) => {
        setApplications(apps);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  return { applications, loading, error };
};
