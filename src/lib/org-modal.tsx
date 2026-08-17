import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useAuth, type SavedCompany } from "@/lib/auth";
import { OrgModal } from "@/components/b2b/OrgModal";

type ContinueFn = (company: SavedCompany) => void;

type OrgModalContextValue = {
  openOrgModal: (opts?: { onContinue?: ContinueFn; forceAdd?: boolean }) => void;
  closeOrgModal: () => void;
};

const OrgModalContext = createContext<OrgModalContextValue | null>(null);

export function OrgModalProvider({ children }: { children: ReactNode }) {
  const { user, upsertCompany } = useAuth();
  const [open, setOpen] = useState(false);
  const [forceAdd, setForceAdd] = useState(false);
  const [waitingAuth, setWaitingAuth] = useState(false);
  const continueRef = useRef<ContinueFn | null>(null);
  const pendingRef = useRef<SavedCompany | null>(null);

  const openOrgModal = useCallback((opts?: { onContinue?: ContinueFn; forceAdd?: boolean }) => {
    continueRef.current = opts?.onContinue ?? null;
    setForceAdd(Boolean(opts?.forceAdd));
    setOpen(true);
  }, []);

  const closeOrgModal = useCallback(() => {
    setOpen(false);
    setForceAdd(false);
  }, []);

  const finish = useCallback(
    (company: SavedCompany, save: boolean) => {
      if (save && user) {
        upsertCompany(company);
        continueRef.current?.(company);
        setOpen(false);
        return;
      }
      if (save && !user) {
        pendingRef.current = company;
        setWaitingAuth(true);
        return;
      }
      continueRef.current?.(company);
      setOpen(false);
    },
    [user, upsertCompany],
  );

  useEffect(() => {
    if (!user || !pendingRef.current) {
      return;
    }
    const company = pendingRef.current;
    pendingRef.current = null;
    setWaitingAuth(false);
    upsertCompany(company);
    continueRef.current?.(company);
    setOpen(false);
  }, [user, upsertCompany]);

  const value = useMemo(
    () => ({ openOrgModal, closeOrgModal }),
    [openOrgModal, closeOrgModal],
  );

  return (
    <OrgModalContext.Provider value={value}>
      {children}
      <OrgModal
        open={open}
        forceAdd={forceAdd}
        onClose={closeOrgModal}
        onFinish={finish}
        pendingSave={waitingAuth}
      />
    </OrgModalContext.Provider>
  );
}

export function useOrgModal() {
  const ctx = useContext(OrgModalContext);
  if (!ctx) {
    throw new Error("useOrgModal must be used within OrgModalProvider");
  }
  return ctx;
}
