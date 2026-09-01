import React, { useState, useEffect } from 'react';
import {
  FolderUp,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Trash2,
  ExternalLink,
  RefreshCw,
  Lock,
  Download,
  FileText,
  X,
  Cloud,
  Layers,
  Sparkles,
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  initAuth,
  googleSignIn,
  googleLogout,
  getAccessToken,
} from '../../../services/firebaseAuth';
import {
  listGoogleDriveFiles,
  uploadDossierToGoogleDrive,
  deleteGoogleDriveFile,
  DriveFileItem,
} from '../../../services/googleDriveService';
import { SkipTraceContactabilityDataset } from '../../../types/contactability';

interface GoogleDriveIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataset: SkipTraceContactabilityDataset;
}

export const GoogleDriveIntegrationModal: React.FC<GoogleDriveIntegrationModalProps> = ({
  isOpen,
  onClose,
  dataset,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [driveFiles, setDriveFiles] = useState<DriveFileItem[]>([]);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [fileToDelete, setFileToDelete] = useState<DriveFileItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Initialize auth listener
  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = initAuth(
      (user, accessToken) => {
        setCurrentUser(user);
        setToken(accessToken);
        fetchFiles();
      },
      () => {
        setCurrentUser(null);
        setToken(null);
        setDriveFiles([]);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isOpen]);

  const fetchFiles = async () => {
    setIsLoadingFiles(true);
    try {
      const files = await listGoogleDriveFiles();
      setDriveFiles(files);
    } catch (err: any) {
      console.error('Failed to list files from Google Drive:', err);
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setStatusMessage(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setCurrentUser(result.user);
        setToken(result.accessToken);
        setStatusMessage({
          type: 'success',
          text: `Signed in as ${result.user.displayName || result.user.email}. Google Drive connected.`,
        });
        await fetchFiles();
      }
    } catch (err: any) {
      console.error('Google Sign-in failed:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Google Sign-in was cancelled or failed.',
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await googleLogout();
    setCurrentUser(null);
    setToken(null);
    setDriveFiles([]);
    setStatusMessage({ type: 'info', text: 'Disconnected from Google Drive.' });
  };

  const handleExportDossier = async () => {
    if (!token) {
      handleSignIn();
      return;
    }

    setIsExporting(true);
    setStatusMessage(null);
    try {
      const filename = `StageFlow_SkipTrace_${dataset.customerName.replace(/[^a-zA-Z0-9]/g, '_')}_${dataset.accountNumber}.json`;
      const content = JSON.stringify(
        {
          application: 'StageFlow AI Skip Trace Operations',
          generatedTimestamp: new Date().toISOString(),
          account: {
            customerId: dataset.customerId,
            customerName: dataset.customerName,
            accountNumber: dataset.accountNumber,
            totalBalance: dataset.totalBalance,
            stage: dataset.currentStage,
            permissiblePurpose: dataset.permissiblePurpose,
          },
          identityConfidence: dataset.identityConfidence,
          categorySummaries: dataset.categorySummaries,
          rankedChannels: dataset.channels.sort((a, b) => a.reachabilityRank - b.reachabilityRank),
        },
        null,
        2
      );

      const result = await uploadDossierToGoogleDrive(
        filename,
        content,
        'application/json',
        `StageFlow Skip Trace Contactability Intelligence Report for ${dataset.customerName} (${dataset.accountNumber})`
      );

      setStatusMessage({
        type: 'success',
        text: `Dossier "${result.name}" successfully exported to your Google Drive!`,
      });

      await fetchFiles();
    } catch (err: any) {
      console.error('Export error:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to export dossier to Google Drive.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Mandatory confirmation for destructive delete
  const confirmDeleteFile = async () => {
    if (!fileToDelete) return;
    setIsDeleting(true);
    try {
      await deleteGoogleDriveFile(fileToDelete.id);
      setStatusMessage({
        type: 'success',
        text: `File "${fileToDelete.name}" was removed from Google Drive.`,
      });
      setFileToDelete(null);
      await fetchFiles();
    } catch (err: any) {
      console.error('Delete error:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to delete file from Google Drive.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-2xs">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-blue-700">
                  Google Workspace Drive Integration
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>OAuth Authorized</span>
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight mt-0.5">
                Google Drive Intelligence Dossier Sync
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Status Message */}
          {statusMessage && (
            <div
              className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : statusMessage.type === 'error'
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : 'bg-blue-50 border-blue-200 text-blue-900'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : statusMessage.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              ) : (
                <Cloud className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              )}
              <span className="font-medium">{statusMessage.text}</span>
            </div>
          )}

          {/* Authentication State Card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-mono text-[10px] text-slate-500 uppercase font-semibold">
                  Google Account Connection
                </span>
                {currentUser ? (
                  <div className="mt-1">
                    <div className="text-sm font-bold text-slate-900">
                      {currentUser.displayName || currentUser.email}
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                      {currentUser.email}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-600 mt-1">
                    Connect your Google account to sync skip trace dossiers, evidence provenance certificates, and contactability audit records directly into your Google Drive.
                  </div>
                )}
              </div>

              {/* Official Google Sign In Button */}
              {currentUser ? (
                <button
                  onClick={handleSignOut}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors shrink-0"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={handleSignIn}
                  disabled={isSigningIn}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 shadow-xs transition-colors shrink-0 disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>{isSigningIn ? 'Connecting...' : 'Sign in with Google'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Action Trigger: Export Current Contactability Intelligence */}
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Export Active Account Dossier to Drive</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Generates an immutable JSON & Markdown Skip Trace Contactability Intelligence package for <strong>{dataset.customerName}</strong> ({dataset.accountNumber}), including identity calibration scores, 5-vector matrix, and ranked channel reasoning.
                </p>
              </div>

              <button
                onClick={handleExportDossier}
                disabled={isExporting}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs transition-colors shrink-0 disabled:opacity-50"
              >
                {isExporting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <FolderUp className="w-3.5 h-3.5" />
                    <span>Sync to Drive</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Files Synced in Google Drive */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-900 uppercase">
                Skip Trace Artifacts in Google Drive ({driveFiles.length})
              </span>
              <button
                onClick={fetchFiles}
                disabled={isLoadingFiles}
                className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 p-1 rounded hover:bg-slate-100"
              >
                <RefreshCw className={`w-3 h-3 ${isLoadingFiles ? 'animate-spin' : ''}`} />
                <span>Refresh Drive</span>
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 max-h-56 overflow-y-auto">
              {driveFiles.length > 0 ? (
                driveFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-3 bg-white hover:bg-slate-50 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                      <div className="truncate">
                        <div className="font-semibold text-slate-900 truncate">
                          {file.name}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {file.createdTime ? new Date(file.createdTime).toLocaleString() : 'Recent'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {file.webViewLink && (
                        <a
                          href={file.webViewLink}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-slate-500 hover:text-indigo-600 rounded hover:bg-indigo-50 transition-colors"
                          title="Open in Google Drive"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => setFileToDelete(file)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                        title="Delete from Google Drive (Requires confirmation)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-500">
                  {currentUser
                    ? 'No skip trace dossiers exported to this Google Drive yet. Click "Sync to Drive" above to create one.'
                    : 'Sign in with Google above to view and manage your Drive files.'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Google Drive API v3 • Scopes Granted</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>

      {/* Mandatory User Confirmation Modal for Destructive Delete (SKILL.md requirement) */}
      {fileToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl border border-slate-300 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h4 className="font-bold text-base text-slate-900">
                Confirm Deletion from Google Drive
              </h4>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete <strong>&quot;{fileToDelete.name}&quot;</strong> from your Google Drive? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setFileToDelete(null)}
                disabled={isDeleting}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteFile}
                disabled={isDeleting}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors flex items-center gap-1.5"
              >
                {isDeleting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>{isDeleting ? 'Deleting...' : 'Delete File'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
