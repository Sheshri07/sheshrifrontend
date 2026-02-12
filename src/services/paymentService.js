import { API } from '../utils/api';

// Create payment order
export const createPaymentOrder = async (amount, orderId) => {
    const { data } = await API.post('/payment/create', { amount, orderId });
    return data;
};

// Verify payment
export const verifyPayment = async (paymentData) => {
    const { data } = await API.post('/payment/verify', paymentData);
    return data;
};

// Handle payment failure
export const handlePaymentFailure = async (orderId, error) => {
    const { data } = await API.post('/payment/failure', { orderId, error });
    return data;
};

// Get payment status
export const getPaymentStatus = async (orderId) => {
    const { data } = await API.get(`/payment/status/${orderId}`);
    return data;
};

// Mock Razorpay payment (for testing without real credentials)
export const initiateMockPayment = (options, onSuccess, onFailure) => {
    // Simulate payment modal
    const confirmed = window.confirm(
        `Mock Payment\n\nAmount: ₹${options.amount / 100}\nOrder: ${options.notes?.orderId || 'N/A'}\n\nClick OK to simulate successful payment, Cancel for failure.`
    );

    if (confirmed) {
        // Simulate successful payment
        setTimeout(() => {
            onSuccess({
                razorpay_order_id: options.order_id,
                razorpay_payment_id: `mock_payment_${Date.now()}`,
                razorpay_signature: `mock_signature_${Date.now()}`
            });
        }, 1000);
    } else {
        // Simulate payment failure
        setTimeout(() => {
            onFailure({
                error: {
                    code: 'PAYMENT_CANCELLED',
                    description: 'Payment cancelled by user',
                    source: 'customer',
                    step: 'payment_authentication',
                    reason: 'payment_cancelled'
                }
            });
        }, 500);
    }
};

// Real Razorpay Payment
export const initiatePayment = (options, onSuccess, onFailure) => {
    if (!window.Razorpay) {
        alert("Razorpay SDK failed to load. Please check your internet connection.");
        return;
    }

    const razorpayOptions = {
        key: options.key, // Enter the Key ID generated from the Dashboard
        amount: options.amount,
        currency: options.currency,
        name: "Sheshri Fashion",
        description: "Payment for Order #" + (options.notes?.orderId || ""),
        image: "/logo_v2.png", // Ensure you have a logo at this path
        order_id: options.order_id,
        handler: function (response) {
            onSuccess(response);
        },
        prefill: {
            name: options.prefill?.name,
            email: options.prefill?.email,
            contact: options.prefill?.contact
        },
        notes: options.notes,
        theme: {
            color: "#6D28D9" // Primary color
        },
        modal: {
            ondismiss: function () {
                onFailure({
                    error: {
                        description: 'Payment cancelled by user'
                    }
                });
            }
        }
        // retry: false // optional
    };

    const rzp1 = new window.Razorpay(razorpayOptions);
    rzp1.on('payment.failed', function (response) {
        onFailure(response);
    });
    rzp1.open();
};
