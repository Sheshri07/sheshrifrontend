import { createContext, useContext, useState } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X, Loader2 } from "lucide-react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = "info", duration = 4000) => {
        const id = Date.now() + Math.random(); // Ensure unique ID
        setToasts((prev) => [...prev, { id, message, type }]);

        if (duration) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
        return id;
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const success = (message) => addToast(message, "success");
    const error = (message) => addToast(message, "error");
    const warning = (message) => addToast(message, "warning");
    const info = (message) => addToast(message, "info");

    // New loading method: no auto-dismiss (duration = 0)
    const loading = (message) => addToast(message, "loading", 0);

    // New dismiss method
    const dismiss = (id) => removeToast(id);

    return (
        <ToastContext.Provider value={{ success, error, warning, info, loading, dismiss }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-4 right-4 z-[200] space-y-3 pointer-events-none">
            {toasts.map((toast) => (
                <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    );
};

const Toast = ({ toast, onClose }) => {
    const icons = {
        success: <div className="p-2 bg-green-500/20 rounded-full"><CheckCircle className="w-5 h-5 text-green-400" /></div>,
        error: <div className="p-2 bg-red-500/20 rounded-full"><XCircle className="w-5 h-5 text-red-400" /></div>,
        warning: <div className="p-2 bg-yellow-500/20 rounded-full"><AlertCircle className="w-5 h-5 text-yellow-400" /></div>,
        info: <div className="p-2 bg-blue-500/20 rounded-full"><Info className="w-5 h-5 text-blue-400" /></div>,
        loading: <div className="p-2 bg-white/10 rounded-full"><Loader2 className="w-5 h-5 text-white animate-spin" /></div>
    };

    const gradient = {
        success: "from-green-500/10 via-green-500/5 to-transparent",
        error: "from-red-500/10 via-red-500/5 to-transparent",
        warning: "from-yellow-500/10 via-yellow-500/5 to-transparent",
        info: "from-blue-500/10 via-blue-500/5 to-transparent",
        loading: "from-white/10 via-white/5 to-transparent shadow-white/5"
    };

    const border = {
        success: "border-green-500/30",
        error: "border-red-500/30",
        warning: "border-yellow-500/30",
        info: "border-blue-500/30",
        loading: "border-white/20"
    };

    return (
        <div
            className={`relative overflow-hidden bg-gray-900/80 backdrop-blur-xl border ${border[toast.type]} rounded-2xl shadow-2xl p-4 pr-5 min-w-[340px] max-w-md pointer-events-auto animate-in slide-in-from-right-full fade-in duration-500 flex items-center gap-4 group`}
        >
            {/* Ambient Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-r ${gradient[toast.type]} pointer-events-none`} />

            <div className="relative z-10 flex-shrink-0 animate-in zoom-in duration-500 delay-100">{icons[toast.type]}</div>

            <div className="relative z-10 flex-1 py-1">
                <p className="text-sm font-semibold text-white tracking-wide capitalize mb-0.5">{toast.type}</p>
                <p className="text-gray-300 text-xs leading-relaxed font-medium">{toast.message}</p>
            </div>

            {toast.type !== 'loading' && (
                <button
                    onClick={onClose}
                    className="relative z-10 p-1.5 hover:bg-white/10 rounded-lg transition-all text-gray-400 hover:text-white"
                >
                    <X className="w-4 h-4" />
                </button>
            )}

            {/* Progress Bar Animation (Optional visual cue) */}
            <div className="absolute bottom-0 left-0 h-[2px] bg-white/10 w-full overflow-hidden">
                <div className={`h-full bg-current ${toast.type === 'success' ? 'text-green-500' : toast.type === 'error' ? 'text-red-500' : 'text-blue-500'} animate-toast-progress shrink-0`} />
            </div>
        </div>
    );
};

export const useToast = () => useContext(ToastContext);
