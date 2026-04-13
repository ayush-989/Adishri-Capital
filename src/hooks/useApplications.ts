import { useState, useEffect } from "react";
import { subscribeToApplications } from "../lib/services/application.service";
import type { LoanApplication } from "../lib/models/application.model";

export const useApplications = () => {
  const [applications, setApplications] = useState<LoanApplication[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToApplications(setApplications);
    return () => unsubscribe();
  }, []);

  return applications;
};
