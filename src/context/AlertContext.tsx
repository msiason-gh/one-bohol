'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  X,
  Trash2,
  ShieldAlert
} from 'lucide-react';

export type AlertType = 'warning' | 'error' | 'success' | 'info';

export interface AlertOptions {
  title?: string;
  type?: AlertType;
  buttonText?: string;
}

export interface ConfirmOptions {
  title?: string;
  type?: 'warning' | 'danger' | 'info';
  confirmText?: string;
  cancelText?: string;
}

interface AlertContextValue {
  showAlert: (message: string, options?: AlertOptions) => Promise<void>;
  showConfirm: (message: string, options?: ConfirmOptions) => Promise<boolean>;
}

const AlertContext = createContext<AlertContextValue | null>(null);

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}

interface AlertState {
  isOpen: boolean;
  message: string;
  title: string;
  type: AlertType;
  buttonText: string;
  resolve?: () => void;
}

interface ConfirmState {
  isOpen: boolean;
  message: string;
  title: string;
  type: 'warning' | 'danger' | 'info';
  confirmText: string;
  cancelText: string;
  resolve?: (value: boolean) => void;
}

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alertState, setAlertState] = useState<AlertState>({
    isOpen: false,
    message: '',
    title: 'Notice',
    type: 'warning',
    buttonText: 'Got It',
  });

  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    message: '',
    title: 'Confirm Action',
    type: 'warning',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
  });

  const showAlert = useCallback((message: string, options?: AlertOptions): Promise<void> => {
    return new Promise((resolve) => {
      // Intelligently infer title and type if not explicitly passed
      let inferredTitle = options?.title;
      let inferredType: AlertType = options?.type || 'warning';

      if (!inferredTitle) {
        const lower = message.toLowerCase();
        if (lower.includes('error') || lower.includes('failed')) {
          inferredTitle = 'Action Error';
          inferredType = 'error';
        } else if (lower.includes('success') || lower.includes('verified')) {
          inferredTitle = 'Success';
          inferredType = 'success';
        } else if (lower.includes('please') || lower.includes('required') || lower.includes('must')) {
          inferredTitle = 'Action Required';
          inferredType = 'warning';
        } else {
          inferredTitle = 'Notice';
        }
      }

      setAlertState({
        isOpen: true,
        message,
        title: inferredTitle,
        type: inferredType,
        buttonText: options?.buttonText || 'Understood',
        resolve,
      });
    });
  }, []);

  const showConfirm = useCallback((message: string, options?: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        message,
        title: options?.title || 'Confirmation Required',
        type: options?.type || 'warning',
        confirmText: options?.confirmText || 'Proceed',
        cancelText: options?.cancelText || 'Cancel',
        resolve,
      });
    });
  }, []);

  const closeAlert = useCallback(() => {
    if (alertState.resolve) {
      alertState.resolve();
    }
    setAlertState((prev) => ({ ...prev, isOpen: false }));
  }, [alertState]);

  const handleConfirmAction = useCallback((value: boolean) => {
    if (confirmState.resolve) {
      confirmState.resolve(value);
    }
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
  }, [confirmState]);

  // Intercept window.alert for legacy or fallback calls
  useEffect(() => {
    const originalAlert = window.alert;
    window.alert = (msg?: unknown) => {
      showAlert(String(msg ?? ''));
    };
    return () => {
      window.alert = originalAlert;
    };
  }, [showAlert]);

  // Keyboard navigation for active alerts/confirms
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (alertState.isOpen) {
        if (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ') {
          e.preventDefault();
          closeAlert();
        }
      } else if (confirmState.isOpen) {
        if (e.key === 'Escape') {
          e.preventDefault();
          handleConfirmAction(false);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          handleConfirmAction(true);
        }
      }
    };

    if (alertState.isOpen || confirmState.isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [alertState.isOpen, confirmState.isOpen, closeAlert, handleConfirmAction]);

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm }}>
      {children}

      {/* =========================================================================
          PREMIUM ALERT DIALOG
          ========================================================================= */}
      {alertState.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#0B2027]/45 backdrop-blur-[4px] animate-in fade-in duration-150 no-print">
          <div
            role="alertdialog"
            aria-modal="true"
            className="relative w-full max-w-[420px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(11,32,39,0.22)] border border-[#D5EAE2] overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Color Accent Bar */}
            <div
              className="h-1.5 w-full"
              style={{
                background:
                  alertState.type === 'error'
                    ? 'linear-gradient(90deg, #EF4444 0%, #DC2626 100%)'
                    : alertState.type === 'success'
                    ? 'linear-gradient(90deg, #10B981 0%, #059669 100%)'
                    : alertState.type === 'info'
                    ? 'linear-gradient(90deg, #0EA5E9 0%, #0284C7 100%)'
                    : 'linear-gradient(90deg, #F59E0B 0%, #D97706 100%)',
              }}
            />

            <div className="p-6">
              <div className="flex items-start gap-4">
                {/* Glowing Rounded Icon Badge */}
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${
                    alertState.type === 'error'
                      ? 'bg-[#FEF2F2] border-[#FECACA] text-[#DC2626]'
                      : alertState.type === 'success'
                      ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#059669]'
                      : alertState.type === 'info'
                      ? 'bg-[#F0F9FF] border-[#BAE6FD] text-[#0284C7]'
                      : 'bg-[#FFFBEB] border-[#FDE68A] text-[#D97706]'
                  }`}
                >
                  {alertState.type === 'error' && <AlertCircle className="w-5 h-5" />}
                  {alertState.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
                  {alertState.type === 'info' && <Info className="w-5 h-5" />}
                  {alertState.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
                </div>

                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-[16px] font-bold text-[#0B2027] tracking-tight leading-snug">
                      {alertState.title}
                    </h3>
                    <button
                      type="button"
                      onClick={closeAlert}
                      className="text-[#94A3B8] hover:text-[#0B2027] p-1 rounded-md transition-colors"
                      title="Dismiss"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[13.5px] text-[#475569] font-medium leading-relaxed mt-1.5">
                    {alertState.message}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  autoFocus
                  onClick={closeAlert}
                  className="px-5 py-2.5 text-xs font-bold text-white rounded-xl shadow-[0_3px_12px_rgba(5,108,78,0.22)] hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
                  style={{
                    background:
                      alertState.type === 'error'
                        ? 'linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)'
                        : 'linear-gradient(90deg, #04684B 0%, #0A8762 48%, #1BB982 100%)',
                  }}
                >
                  {alertState.buttonText}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PREMIUM CONFIRMATION DIALOG
          ========================================================================= */}
      {confirmState.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#0B2027]/45 backdrop-blur-[4px] animate-in fade-in duration-150 no-print">
          <div
            role="alertdialog"
            aria-modal="true"
            className="relative w-full max-w-[440px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(11,32,39,0.22)] border border-[#D5EAE2] overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Color Accent Bar */}
            <div
              className="h-1.5 w-full"
              style={{
                background:
                  confirmState.type === 'danger'
                    ? 'linear-gradient(90deg, #EF4444 0%, #DC2626 100%)'
                    : 'linear-gradient(90deg, #F59E0B 0%, #D97706 100%)',
              }}
            />

            <div className="p-6">
              <div className="flex items-start gap-4">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${
                    confirmState.type === 'danger'
                      ? 'bg-[#FEF2F2] border-[#FECACA] text-[#DC2626]'
                      : 'bg-[#FFFBEB] border-[#FDE68A] text-[#D97706]'
                  }`}
                >
                  {confirmState.type === 'danger' ? (
                    <Trash2 className="w-5 h-5" />
                  ) : (
                    <ShieldAlert className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1 min-w-0 pt-0.5">
                  <h3 className="font-display text-[16px] font-bold text-[#0B2027] tracking-tight leading-snug">
                    {confirmState.title}
                  </h3>
                  <p className="text-[13.5px] text-[#475569] font-medium leading-relaxed mt-1.5">
                    {confirmState.message}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => handleConfirmAction(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#475569] bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl transition-colors cursor-pointer"
                >
                  {confirmState.cancelText}
                </button>
                <button
                  type="button"
                  autoFocus
                  onClick={() => handleConfirmAction(true)}
                  className={`px-4 py-2 text-xs font-bold text-white rounded-xl shadow-sm hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer ${
                    confirmState.type === 'danger'
                      ? 'bg-[#DC2626] hover:bg-[#B91C1C]'
                      : 'bg-[#0A8762] hover:bg-[#07684B]'
                  }`}
                >
                  {confirmState.confirmText}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
}
