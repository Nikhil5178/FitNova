import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PlanInfo {
  id: string;
  name: string;
  price: string;
  period: string;
  tagline: string;
  color: string;
  borderColor: string;
}

interface PaymentModalProps {
  open: boolean;
  plan: PlanInfo | null;
  onClose: () => void;
}

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

export function PaymentModal({ open, plan, onClose }: PaymentModalProps) {
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);

  if (!plan) return null;

  const DARK_BG = "oklch(0.10 0.01 260)";

  function handleSubmit(e: React.FormEvent) {
    if (!plan) return;
    e.preventDefault();
    if (
      !cardName ||
      cardNumber.replace(/\s/g, "").length < 16 ||
      expiry.length < 5 ||
      cvv.length < 3
    ) {
      toast.error("Please complete all payment fields.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem(
        "fittrack_plan",
        JSON.stringify({
          id: plan.id,
          name: plan.name,
          since: new Date().toISOString(),
        }),
      );
      toast.success(`Payment successful! Welcome to ${plan.name}! 🎉`);
      setLoading(false);
      setCardName("");
      setCardNumber("");
      setExpiry("");
      setCvv("");
      onClose();
    }, 1000);
  }

  const inputStyle: React.CSSProperties = {
    background: "oklch(0.14 0.02 260)",
    border: "1px solid oklch(0.25 0.05 260)",
    color: "oklch(0.92 0.01 260)",
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        data-ocid="payment.dialog"
        className="p-0 overflow-hidden border-0 max-w-md"
        style={{
          background: DARK_BG,
          border: `1px solid ${plan.borderColor}`,
          boxShadow: `0 0 50px ${plan.color}30`,
        }}
      >
        {/* Top glow bar */}
        <div
          className="h-0.5 w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${plan.color}, transparent)`,
          }}
        />

        <div className="px-8 pt-6 pb-8">
          <DialogHeader className="mb-6">
            {/* Plan badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1 text-[10px] font-bold tracking-[0.3em] uppercase mb-3 self-start"
              style={{
                background: `${plan.color}20`,
                border: `1px solid ${plan.color}60`,
                color: plan.color,
              }}
            >
              <span>{plan.name}</span>
              <span>•</span>
              <span>
                {plan.price}
                {plan.period}
              </span>
            </div>
            <DialogTitle className="text-2xl font-display font-bold text-white tracking-tight">
              Upgrade to {plan.name}
            </DialogTitle>
            <p className="text-xs text-white/40 tracking-wide mt-1">
              {plan.tagline}
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Cardholder Name */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px] tracking-widest uppercase text-white/50">
                Cardholder Name
              </Label>
              <Input
                data-ocid="payment.input"
                placeholder="Full name on card"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                style={inputStyle}
                className="focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            {/* Card Number */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px] tracking-widest uppercase text-white/50">
                Card Number
              </Label>
              <div className="relative">
                <Input
                  data-ocid="payment.input"
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={(e) =>
                    setCardNumber(formatCardNumber(e.target.value))
                  }
                  style={inputStyle}
                  className="focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 pr-10"
                />
                <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              </div>
            </div>

            {/* Expiry + CVV */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-[11px] tracking-widest uppercase text-white/50">
                  Expiry
                </Label>
                <Input
                  data-ocid="payment.input"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  style={inputStyle}
                  className="focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-[11px] tracking-widest uppercase text-white/50">
                  CVV
                </Label>
                <Input
                  data-ocid="payment.input"
                  placeholder="•••"
                  type="password"
                  maxLength={4}
                  value={cvv}
                  onChange={(e) =>
                    setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  style={inputStyle}
                  className="focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </div>

            {/* Price summary */}
            <div
              className="flex items-center justify-between px-4 py-3 mt-1"
              style={{
                background: `${plan.color}10`,
                border: `1px solid ${plan.color}30`,
              }}
            >
              <span className="text-xs text-white/50 tracking-wide">
                Total billed today
              </span>
              <span
                className="text-base font-display font-bold"
                style={{ color: plan.color }}
              >
                {plan.price}
                {plan.period}
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              data-ocid="payment.submit_button"
              disabled={loading}
              className="mt-1 w-full py-3.5 text-xs font-bold tracking-[0.3em] uppercase transition-all duration-300 flex items-center justify-center gap-2"
              style={{
                background: plan.color,
                color: "oklch(0.08 0.005 260)",
                boxShadow: `0 0 25px ${plan.color}50`,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Confirm Payment
                </>
              )}
            </button>

            <p className="text-center text-[10px] text-white/25 tracking-wide">
              🔒 Secured with 256-bit SSL encryption
            </p>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
