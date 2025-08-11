export interface MpesaPaymentRequest {
  amount: number;
  phoneNumber: string;
  accountReference: string;
  transactionDesc: string;
}

export interface MpesaPaymentResponse {
  merchantRequestID: string;
  checkoutRequestID: string;
  responseCode: string;
  responseDescription: string;
  customerMessage: string;
}

export interface MpesaCallbackResponse {
  merchantRequestID: string;
  checkoutRequestID: string;
  resultCode: number;
  resultDesc: string;
  amount?: number;
  mpesaReceiptNumber?: string;
  transactionDate?: string;
  phoneNumber?: string;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  amount: number;
  currency: 'KES';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  type: 'subscription' | 'featured_listing' | 'premium_feature';
  description: string;
  phoneNumber: string;
  merchantRequestID?: string;
  checkoutRequestID?: string;
  mpesaReceiptNumber?: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: any;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: 'KES';
  duration: number; // in months
  features: string[];
  featuredListingsIncluded: number;
  maxProperties: number;
  priority: number;
}
