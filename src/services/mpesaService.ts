import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  MpesaPaymentRequest, 
  MpesaPaymentResponse, 
  PaymentTransaction,
  SubscriptionPlan 
} from '../types/payment';

export class MpesaService {
  private readonly baseUrl = 'https://sandbox.safaricom.co.ke'; // Change to production URL for live
  private readonly consumerKey = import.meta.env.VITE_MPESA_CONSUMER_KEY;
  private readonly consumerSecret = import.meta.env.VITE_MPESA_CONSUMER_SECRET;
  private readonly passkey = import.meta.env.VITE_MPESA_PASSKEY;
  private readonly shortcode = import.meta.env.VITE_MPESA_BUSINESS_SHORTCODE;
  private readonly environment = import.meta.env.VITE_MPESA_ENVIRONMENT || 'sandbox';

  private async getAccessToken(): Promise<string> {
    const credentials = btoa(`${this.consumerKey}:${this.consumerSecret}`);
    
    const response = await fetch(`${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get access token');
    }

    const data = await response.json();
    return data.access_token;
  }

  private generateTimestamp(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}${month}${day}${hour}${minute}${second}`;
  }

  private generatePassword(): string {
    const timestamp = this.generateTimestamp();
    const dataToEncode = `${this.shortcode}${this.passkey}${timestamp}`;
    return btoa(dataToEncode);
  }

  async initiateSTKPush(paymentRequest: MpesaPaymentRequest): Promise<MpesaPaymentResponse> {
    const accessToken = await this.getAccessToken();
    const timestamp = this.generateTimestamp();
    const password = this.generatePassword();

    // Format phone number to include country code
    let phoneNumber = paymentRequest.phoneNumber;
    if (phoneNumber.startsWith('0')) {
      phoneNumber = '254' + phoneNumber.substring(1);
    } else if (phoneNumber.startsWith('+254')) {
      phoneNumber = phoneNumber.substring(1);
    } else if (!phoneNumber.startsWith('254')) {
      phoneNumber = '254' + phoneNumber;
    }

    const payload = {
      BusinessShortCode: this.shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(paymentRequest.amount), // Ensure amount is integer
      PartyA: phoneNumber,
      PartyB: this.shortcode,
      PhoneNumber: phoneNumber,
      CallBackURL: `${window.location.origin}/api/mpesa/callback`, // You'll need to implement this endpoint
      AccountReference: paymentRequest.accountReference,
      TransactionDesc: paymentRequest.transactionDesc
    };

    const response = await fetch(`${this.baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Payment request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  async checkPaymentStatus(checkoutRequestID: string): Promise<any> {
    const accessToken = await this.getAccessToken();
    const timestamp = this.generateTimestamp();
    const password = this.generatePassword();

    const payload = {
      BusinessShortCode: this.shortcode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestID
    };

    const response = await fetch(`${this.baseUrl}/mpesa/stkpushquery/v1/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Failed to check payment status');
    }

    return await response.json();
  }

  async createPaymentTransaction(
    userId: string, 
    paymentData: Omit<PaymentTransaction, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    const transaction: Omit<PaymentTransaction, 'id'> = {
      ...paymentData,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await addDoc(collection(db, 'transactions'), transaction);
    return docRef.id;
  }

  async updatePaymentTransaction(
    transactionId: string, 
    updates: Partial<PaymentTransaction>
  ): Promise<void> {
    const docRef = doc(db, 'transactions', transactionId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date()
    });
  }

  async getPaymentTransaction(transactionId: string): Promise<PaymentTransaction | null> {
    const docRef = doc(db, 'transactions', transactionId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as PaymentTransaction;
    }
    return null;
  }

  // Predefined subscription plans
  getSubscriptionPlans(): SubscriptionPlan[] {
    return [
      {
        id: 'basic',
        name: 'Basic',
        price: 0,
        currency: 'KES',
        duration: 1,
        features: [
          'List up to 5 properties',
          'Basic property photos',
          'Standard support'
        ],
        featuredListingsIncluded: 0,
        maxProperties: 5,
        priority: 1
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 2500,
        currency: 'KES',
        duration: 1,
        features: [
          'List up to 20 properties',
          'Unlimited property photos',
          'Virtual tours support',
          '5 featured listings per month',
          'Priority support',
          'Analytics dashboard'
        ],
        featuredListingsIncluded: 5,
        maxProperties: 20,
        priority: 2
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 5000,
        currency: 'KES',
        duration: 1,
        features: [
          'Unlimited properties',
          'Unlimited property photos & videos',
          'Virtual tours & 360° photos',
          '15 featured listings per month',
          'Premium support',
          'Advanced analytics',
          'Custom branding',
          'API access'
        ],
        featuredListingsIncluded: 15,
        maxProperties: -1, // Unlimited
        priority: 3
      }
    ];
  }

  async purchaseSubscription(
    userId: string, 
    planId: string, 
    phoneNumber: string
  ): Promise<{ transactionId: string; paymentResponse: MpesaPaymentResponse }> {
    const plans = this.getSubscriptionPlans();
    const plan = plans.find(p => p.id === planId);
    
    if (!plan) {
      throw new Error('Invalid subscription plan');
    }

    if (plan.price === 0) {
      // Handle free plan
      const transactionId = await this.createPaymentTransaction(userId, {
        amount: 0,
        currency: 'KES',
        status: 'completed',
        type: 'subscription',
        description: `${plan.name} subscription`,
        phoneNumber,
        metadata: { planId }
      });

      return {
        transactionId,
        paymentResponse: {
          merchantRequestID: '',
          checkoutRequestID: '',
          responseCode: '0',
          responseDescription: 'Success',
          customerMessage: 'Free plan activated successfully'
        }
      };
    }

    // Create transaction record
    const transactionId = await this.createPaymentTransaction(userId, {
      amount: plan.price,
      currency: 'KES',
      status: 'pending',
      type: 'subscription',
      description: `${plan.name} subscription - ${plan.duration} month(s)`,
      phoneNumber,
      metadata: { planId }
    });

    // Initiate MPESA payment
    const paymentResponse = await this.initiateSTKPush({
      amount: plan.price,
      phoneNumber,
      accountReference: `SUB-${transactionId}`,
      transactionDesc: `${plan.name} Subscription`
    });

    // Update transaction with payment details
    await this.updatePaymentTransaction(transactionId, {
      merchantRequestID: paymentResponse.merchantRequestID,
      checkoutRequestID: paymentResponse.checkoutRequestID
    });

    return { transactionId, paymentResponse };
  }

  async purchaseFeaturedListing(
    userId: string, 
    propertyId: string, 
    phoneNumber: string,
    duration: number = 30 // days
  ): Promise<{ transactionId: string; paymentResponse: MpesaPaymentResponse }> {
    const amount = duration * 50; // 50 KES per day

    // Create transaction record
    const transactionId = await this.createPaymentTransaction(userId, {
      amount,
      currency: 'KES',
      status: 'pending',
      type: 'featured_listing',
      description: `Featured listing for ${duration} days`,
      phoneNumber,
      metadata: { propertyId, duration }
    });

    // Initiate MPESA payment
    const paymentResponse = await this.initiateSTKPush({
      amount,
      phoneNumber,
      accountReference: `FEAT-${transactionId}`,
      transactionDesc: `Featured Listing - ${duration} days`
    });

    // Update transaction with payment details
    await this.updatePaymentTransaction(transactionId, {
      merchantRequestID: paymentResponse.merchantRequestID,
      checkoutRequestID: paymentResponse.checkoutRequestID
    });

    return { transactionId, paymentResponse };
  }
}

export const mpesaService = new MpesaService();
