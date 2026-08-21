import { useState } from 'react';
import { CreditCard, X } from 'lucide-react';
import type { PaymentMethod } from '../types';

interface PaymentModalProps {
  payableAmount: number;
  giftPointsApplied: number;
  onPay: () => void;
  onClose: () => void;
}

const tabs: { id: PaymentMethod; label: string }[] = [
  { id: 'credit-card', label: 'Credit Card' },
  { id: 'debit-card', label: 'Debit card' },
  { id: 'upi', label: 'UPI' },
  { id: 'wallet', label: 'Wallet' },
];

export default function PaymentModal({ payableAmount, giftPointsApplied, onPay, onClose }: PaymentModalProps) {
  const [method, setMethod] = useState<PaymentMethod>('credit-card');
  const [cardNumber, setCardNumber] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiry, setExpiry] = useState('');
  const [upiId, setUpiId] = useState('');
  const [wallet, setWallet] = useState('Paytm');
  const [paying, setPaying] = useState(false);

  const formatCard = (val: string) =>
    val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1-').replace(/-$/, '');

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 6);
    if (digits.length >= 2) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => { setPaying(false); onPay(); }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="bg-[#1e2433] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700/50">
          <h2 className="text-white font-bold text-lg">Complete Payment</h2>
          <div className="flex items-center gap-6">
            <span className="text-white font-bold text-base">
              Payable Amount: <span className="text-blue-400">₹{payableAmount}</span>
            </span>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex min-h-[280px]">
          {/* Method tabs */}
          <div className="w-36 border-r border-gray-700/50 py-2 shrink-0">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setMethod(t.id)}
                className={`w-full text-left px-4 py-3 text-sm transition-colors border-l-2 ${
                  method === t.id
                    ? 'border-blue-500 bg-blue-500/10 text-white font-medium'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Form panel */}
          <div className="flex-1 px-6 py-5">
            {(method === 'credit-card' || method === 'debit-card') && (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-gray-400 text-xs mb-1 block">Card Number</label>
                  <input
                    type="text"
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCard(e.target.value))}
                    className="w-full bg-[#2a3347] text-gray-200 placeholder-gray-600 text-sm rounded px-3 py-2.5 border border-gray-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Name on Card</label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={nameOnCard}
                    onChange={(e) => setNameOnCard(e.target.value)}
                    className="w-full bg-[#2a3347] text-gray-200 placeholder-gray-600 text-sm rounded px-3 py-2.5 border border-gray-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">CVV</label>
                  <input
                    type="password"
                    placeholder="XXX"
                    maxLength={4}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className="w-full bg-[#2a3347] text-gray-200 placeholder-gray-600 text-sm rounded px-3 py-2.5 border border-gray-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Date of Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YYYY"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    className="w-full bg-[#2a3347] text-gray-200 placeholder-gray-600 text-sm rounded px-3 py-2.5 border border-gray-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {method === 'upi' && (
              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">UPI ID</label>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full bg-[#2a3347] text-gray-200 placeholder-gray-600 text-sm rounded px-3 py-2.5 border border-gray-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <p className="text-gray-500 text-xs">You will receive a payment request on your UPI app.</p>
              </div>
            )}

            {method === 'wallet' && (
              <div className="space-y-3 pt-2">
                <p className="text-gray-400 text-xs mb-2">Select Wallet</p>
                <div className="grid grid-cols-2 gap-2">
                  {['Paytm', 'PhonePe', 'Amazon Pay', 'Mobikwik'].map((w) => (
                    <button
                      key={w}
                      onClick={() => setWallet(w)}
                      className={`px-3 py-2 rounded text-sm border transition-colors ${
                        wallet === w
                          ? 'border-blue-500 bg-blue-500/10 text-white'
                          : 'border-gray-600 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
                <p className="text-gray-500 text-xs mt-2">Wallet balance will be deducted from {wallet}.</p>
              </div>
            )}

            {/* Pay button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handlePay}
                disabled={paying}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-lg transition-colors text-sm"
              >
                {paying ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <CreditCard className="w-4 h-4" />
                )}
                {paying ? 'Processing…' : 'Pay Now'}
              </button>
            </div>
          </div>
        </div>

        {/* Gift points note */}
        {giftPointsApplied > 0 && (
          <div className="px-6 py-3 border-t border-gray-700/50 bg-green-500/5">
            <p className="text-green-400 text-xs">
              🎁 Gift points worth ₹{giftPointsApplied} have been applied to this order.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
