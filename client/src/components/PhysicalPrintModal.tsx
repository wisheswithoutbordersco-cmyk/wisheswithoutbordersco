import { useState } from "react";
import {
  X,
  Truck,
  Loader2,
  Package,
  CheckCircle,
  Printer,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export type PhysicalPrintProduct = {
  productId: string;
  name: string;
  image: string;
  country: string;
};

type Props = {
  product: PhysicalPrintProduct | null;
  onClose: () => void;
};

type PrintSize = "8x10" | "11x14";

const SIZE_OPTIONS: { value: PrintSize; label: string; price: number; desc: string }[] = [
  { value: "8x10", label: '8×10"', price: 999, desc: "Perfect for desks & small walls" },
  { value: "11x14", label: '11×14"', price: 1499, desc: "Statement piece for any room" },
];

export function PhysicalPrintModal({ product, onClose }: Props) {
  const [selectedSize, setSelectedSize] = useState<PrintSize>("8x10");
  const [step, setStep] = useState<"size" | "shipping" | "processing">("size");
  const [checkingOut, setCheckingOut] = useState(false);

  // Shipping form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postCode, setPostCode] = useState("");
  const [country, setCountry] = useState("US");

  const checkoutMutation = trpc.shop.createPrintCheckout.useMutation();

  if (!product) return null;

  const selectedOption = SIZE_OPTIONS.find((s) => s.value === selectedSize)!;

  function handleContinueToShipping() {
    setStep("shipping");
  }

  async function handleSubmitOrder() {
    // Basic validation
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !addressLine1.trim() || !city.trim() || !postCode.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setCheckingOut(true);
    setStep("processing");
    try {
      const origin = window.location.origin;
      const result = await checkoutMutation.mutateAsync({
        wallArtId: product!.productId,
        size: selectedSize,
        shippingAddress: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          addressLine1: addressLine1.trim(),
          addressLine2: addressLine2.trim(),
          city: city.trim(),
          state: state.trim(),
          postCode: postCode.trim(),
          country: country.trim(),
        },
        successUrl: `${origin}/order-success`,
        cancelUrl: `${origin}/wall-art`,
      });
      if (result.url) {
        toast.success("Redirecting to secure checkout...");
        onClose();
        window.location.href = result.url;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Order failed. Please try again.";
      toast.error(msg);
      setStep("shipping");
    } finally {
      setCheckingOut(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b bg-[#1a2744] text-white rounded-t-2xl">
            <div className="flex items-center gap-2">
              <Printer className="w-4 h-4 text-[#d4af37]" />
              <span className="text-sm font-semibold text-[#d4af37]">
                ORDER PHYSICAL PRINT
              </span>
            </div>
            <button onClick={onClose} className="hover:opacity-70 transition-opacity">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Product preview — always visible */}
            <div className="flex gap-4 mb-6">
              <div className="w-24 h-32 rounded-lg overflow-hidden shadow border border-gray-100 shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/200x260/f5f0e8/1a2744?text=Art";
                  }}
                />
              </div>
              <div>
                <p className="text-sm text-[#d4af37] font-semibold uppercase tracking-wide">
                  {product.country}
                </p>
                <h3 className="text-lg font-bold text-[#1a2744] leading-tight">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Professional-quality print · Shipped to your door
                </p>
              </div>
            </div>

            {/* Step 1: Size Selection */}
            {step === "size" && (
              <div>
                <h4 className="font-bold text-[#1a2744] mb-3">Select Print Size</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {SIZE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSelectedSize(opt.value)}
                      className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                        selectedSize === opt.value
                          ? "border-[#d4af37] bg-[#faf8f4] shadow-md"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {selectedSize === opt.value && (
                        <CheckCircle className="absolute top-3 right-3 w-5 h-5 text-[#d4af37]" />
                      )}
                      <p className="font-bold text-[#1a2744] text-lg">{opt.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                      <p className="text-[#d4af37] font-bold text-xl mt-2">
                        ${(opt.price / 100).toFixed(2)}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 gap-2 mb-6">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Printer className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                    <span>Premium matte poster print — vibrant, museum-quality colors</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Truck className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                    <span>Printed & shipped by Gelato — delivered in 5–10 business days</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Package className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                    <span>Ships worldwide from the nearest print facility</span>
                  </div>
                </div>

                <button
                  onClick={handleContinueToShipping}
                  className="w-full flex items-center justify-center gap-2 bg-[#d4af37] hover:bg-[#c49b2a] text-[#1a2744] font-bold py-3 rounded-full transition-colors text-sm"
                >
                  <Truck className="w-4 h-4" />
                  Continue — Enter Shipping Info
                </button>
              </div>
            )}

            {/* Step 2: Shipping Form */}
            {step === "shipping" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-[#1a2744]">Shipping Address</h4>
                  <button
                    onClick={() => setStep("size")}
                    className="text-xs text-[#d4af37] hover:underline"
                  >
                    ← Back to size
                  </button>
                </div>

                <div className="bg-[#faf8f4] rounded-xl p-3 mb-4 flex items-center justify-between">
                  <span className="text-sm text-[#1a2744] font-semibold">
                    {selectedOption.label} Print
                  </span>
                  <span className="text-sm font-bold text-[#d4af37]">
                    ${(selectedOption.price / 100).toFixed(2)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                      placeholder="Jane"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                      placeholder="Smith"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                      placeholder="jane@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                    placeholder="123 Main Street"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                    placeholder="Apt 4B"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                      placeholder="NY"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      ZIP / Postal *
                    </label>
                    <input
                      type="text"
                      value={postCode}
                      onChange={(e) => setPostCode(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                      placeholder="10001"
                    />
                  </div>
                </div>
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Country *
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#d4af37] transition-colors bg-white"
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="NL">Netherlands</option>
                    <option value="SE">Sweden</option>
                    <option value="NO">Norway</option>
                    <option value="DK">Denmark</option>
                    <option value="IE">Ireland</option>
                    <option value="NZ">New Zealand</option>
                    <option value="AT">Austria</option>
                    <option value="BE">Belgium</option>
                    <option value="CH">Switzerland</option>
                    <option value="ES">Spain</option>
                    <option value="IT">Italy</option>
                    <option value="PT">Portugal</option>
                    <option value="JP">Japan</option>
                    <option value="SG">Singapore</option>
                    <option value="BR">Brazil</option>
                    <option value="MX">Mexico</option>
                    <option value="IN">India</option>
                  </select>
                </div>

                <button
                  onClick={handleSubmitOrder}
                  disabled={checkingOut}
                  className="w-full flex items-center justify-center gap-2 bg-[#d4af37] hover:bg-[#c49b2a] text-[#1a2744] font-bold py-3 rounded-full transition-colors disabled:opacity-60 text-sm"
                >
                  {checkingOut ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Package className="w-4 h-4" />
                  )}
                  {checkingOut
                    ? "Processing..."
                    : `Pay ${(selectedOption.price / 100).toFixed(2)} — Proceed to Checkout`}
                </button>

                <p className="text-xs text-gray-400 text-center mt-3">
                  Secure payment via Stripe. Your print will be produced and shipped by Gelato.
                </p>
              </div>
            )}

            {/* Step 3: Processing */}
            {step === "processing" && (
              <div className="text-center py-8">
                <Loader2 className="w-10 h-10 text-[#d4af37] animate-spin mx-auto mb-4" />
                <p className="text-[#1a2744] font-semibold">Creating your order...</p>
                <p className="text-gray-500 text-sm mt-1">
                  Setting up secure checkout. Please wait.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 pb-5">
            <div className="bg-[#faf8f4] rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500">
                <strong className="text-[#1a2744]">WishesWithoutBordersco</strong> — Physical prints produced by Gelato's global network.
                Questions? Email{" "}
                <a
                  href="mailto:info@wisheswithoutbordersco.com"
                  className="text-[#d4af37] hover:underline"
                >
                  info@wisheswithoutbordersco.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
