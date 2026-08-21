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
  { id: 'debit-card', label: 'Debit Card' },
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
    return digits.length >= 2 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits;
  };

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => { setPaying(false); onPay(); }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
      <div
        className="w-full max-w-2xl overflow-hidden theme-transition"
        style={{ background: 'var(--bw-bg-elevated)', border: '1px solid var(--bw-border)', boxShadow: 'var(--bw-shadow-lg)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid var(--bw-border)' }}
        >
          <h2 className="font-bold text-lg" style={{ color: 'var(--bw-text-primary)' }}>Complete Payment</h2>
          <div className="flex items-center gap-6">
            <span className="font-bold text-sm" style={{ color: 'var(--bw-text-primary)' }}>
              Payable Amount:{' '}
              <span style={{ color: 'var(--bw-accent)' }}>₹{payableAmount}</span>
            </span>
            <button onClick={onClose} className="transition-colors" style={{ color: 'var(--bw-text-muted)' }}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex min-h-[280px]">
          {/* Method tabs */}
          <div className="w-36 shrink-0 py-2" style={{ borderRight: '1px solid var(--bw-border)' }}>
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setMethod(t.id)}
                className="w-full text-left px-4 py-3 text-sm transition-colors border-l-2"
                style={{
                  borderLeftColor: method === t.id ? 'var(--bw-accent)' : 'transparent',
                  background: method === t.id ? 'var(--bw-accent-subtle)' : 'transparent',
                  color: method === t.id ? 'var(--bw-text-primary)' : 'var(--bw-text-secondary)',
                  fontWeight: method === t.id ? 600 : 400,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="flex-1 px-6 py-5">
            {(method === 'credit-card' || method === 'debit-card') && (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs mb-1 block" style={{ color: 'var(--bw-text-secondary)' }}>Card Number</label>
                  <input type="text" placeholder="XXXX-XXXX-XXXX-XXXX" value={cardNumber}
                    onChange={(e) => setCardNumber(formatCard(e.target.value))} className="bw-input" />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--bw-text-secondary)' }}>Name on Card</label>
                  <input type="text" placeholder="Full Name" value={nameOnCard}
                    onChange={(e) => setNameOnCard(e.target.value)} className="bw-input" />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--bw-text-secondary)' }}>CVV</label>
                  <input type="password" placeholder="•••" maxLength={4} value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))} className="bw-input" />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--bw-text-secondary)' }}>Date of Expiry</label>
                  <input type="text" placeholder="MM/YYYY" value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))} className="bw-input" />
                </div>
              </div>
            )}

            {method === 'upi' && (
              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--bw-text-secondary)' }}>UPI ID</label>
                  <input type="text" placeholder="yourname@upi" value={upiId}
                    onChange={(e) => setUpiId(e.target.value)} className="bw-input" />
                </div>
                <p className="text-xs" style={{ color: 'var(--bw-text-muted)' }}>You will receive a payment request on your UPI app.</p>
              </div>
            )}

            {method === 'wallet' && (
              <div className="space-y-3 pt-2">
                <p className="text-xs mb-2" style={{ color: 'var(--bw-text-secondary)' }}>Select Wallet</p>
                <div className="grid grid-cols-2 gap-2">
                  {['Paytm', 'PhonePe', 'Amazon Pay', 'Mobikwik'].map((w) => (
                    <button
                      key={w}
                      onClick={() => setWallet(w)}
                      className="px-3 py-2 text-sm transition-colors"
                      style={{
                        border: '1px solid ' + (wallet === w ? 'var(--bw-accent)' : 'var(--bw-border)'),
                        background: wallet === w ? 'var(--bw-accent-subtle)' : 'var(--bw-bg-subtle)',
                        color: wallet === w ? 'var(--bw-accent)' : 'var(--bw-text-secondary)',
                      }}
                    >
                      {w}
                    </button>
                  ))}
                </div>
                <p className="text-xs" style={{ color: 'var(--bw-text-muted)' }}>Wallet balance will be deducted from {wallet}.</p>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={handlePay}
                disabled={paying}
                className="flex items-center gap-2 font-bold px-6 py-2.5 transition-colors bw-btn-primary"
              >
                {paying ? (
                  <span className="w-4 h-4 border-2 animate-spin" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
                ) : (
                  <CreditCard className="w-4 h-4" />
                )}
                {paying ? 'Processing…' : 'Pay Now'}
              </button>
            </div>
          </div>
        </div>

        {giftPointsApplied > 0 && (
          <div
            className="px-6 py-3"
            style={{ borderTop: '1px solid var(--bw-border)', background: 'var(--bw-success-subtle)' }}
          >
            <p className="text-xs" style={{ color: 'var(--bw-success)' }}>
              🎁 Gift points worth ₹{giftPointsApplied} have been applied to this order.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
