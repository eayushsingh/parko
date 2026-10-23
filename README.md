# Parko — Parking on Demand (Frontend Web Application)

> Modern two-sided mobility marketplace connecting urban drivers with guaranteed on-demand parking and empowering property owners to monetize unused parking spaces safely and effortlessly.

Built with **React**, **TypeScript**, **Tailwind CSS**, and **Vite**. Inspired by the design standards of Linear, Stripe, Airbnb, and Uber.

---

## 🚀 Key Features & Pages

### 1. Marketing Landing Page (`/`)
- **Hero & Search Engine**: "Your parking spot. Just a tap away." Interactive search bar supporting location, date, arrival, and departure filters.
- **Value Metrics**: Transparent stats (4.94★ average rating, < 30s QR gate check-in, up to 45% savings, $1M host guarantee).
- **Featured Parking Spots**: Real-time spots with pricing, distance to transit hubs, and instant reservation actions.
- **4-Step Booking Guide**: Search & Select &rarr; Instant Reserve &rarr; Navigate & Scan &rarr; Extend or Depart.
- **Two-Sided Marketplace Value Cards**: Dedicated benefits for Drivers vs. Space Owners.
- **Interactive Host Earnings Calculator**: Projected monthly revenue simulator with real-time sliders (stalls, hours/day, hourly rate).
- **Safety Highlights & FAQ Accordion**: Interactive questions and answers.

### 2. Explore Parking Page (`/explore`)
- **Live Search & Multi-Filter Bar**: Real-time filtering by neighborhood query, parking type, price sliders, vehicle compatibility, and amenities.
- **Interactive Vector Map**: Illustrative downtown map with active price pins, hovering previews, and synchronized spot selection.
- **Dual View Modes**: Switch seamlessly between **Split View** (list + map), **Grid List View**, and **Full Map View**.
- **Sorting**: Lowest price, highest price, highest rating, and spot availability.

### 3. Space Details Page (`/space/:id`)
- **Image Gallery**: High-res photo gallery with interactive thumbnail switcher.
- **Dynamic Price Calculator**: Instant calculation of duration, subtotal, 10% Parko guarantee fee, and total amount.
- **Comprehensive Amenities**: CCTV 24/7, EV charging, 24/7 access, wide SUV stalls, and gate keypad codes.
- **Verified Host Profile**: Response rate, rating, and host verification status.
- **Driver Feedback**: Simulated verified reviews.

### 4. Driver Booking Journey (`/book/:id`)
- **Step 1**: Schedule confirmation (date, arrival, departure) and driver/vehicle information (license plate, make/model).
- **Step 2**: Simulated driver's license upload with file size and format validation, plus simulated payment method selection (Credit Card, Apple Pay, Google Pay).
- **Step 3**: Instant booking confirmation with reference (e.g. `PRK-8429-SF`), digital QR access pass, gate keypad PIN, and 1-tap addition to the Driver Dashboard.

### 5. Driver Dashboard (`/dashboard/driver`)
- **Upcoming Passes**: Countdown, gate PINs, and full-screen digital QR pass modal for smart barrier entry.
- **Free Cancellation Flow**: 1-click simulated cancellation with full refund status.
- **Booking History**: Past reservations with re-booking shortcuts.
- **Saved Favorites**: Instant access to favorited parking spots.
- **Vehicle & Verification Management**: Editable primary vehicle license plate for automated ALPR gate recognition.

### 6. Space Owner Dashboard (`/dashboard/owner`)
- **Performance Overview**: Estimated monthly revenue, space occupancy rate (%), active listings, and upcoming Friday direct deposits.
- **Listing Management**: Pause/resume listing visibility, edit hourly rates inline, view live listings, and delete listings.
- **Today's Scheduled Arrivals**: Real-time vehicle check-in feed with simulated "Trigger Gate Open" controls.
- **Weekly Stall Availability Matrix**: Visual 7-day schedule of reserved vs. open hours.
- **Earnings Statement**: Simulated direct deposit statement.

### 7. Create Parking Listing Wizard (`/list-space`)
- Guided 6-step wizard:
  1. Location & Address
  2. Space details & Vehicle sizes
  3. Amenities & Security features
  4. Pricing ($/hr, daily cap) & Gate instructions
  5. Photo selector & Custom upload
  6. Review & Instant publish to the marketplace

### 8. Trust & Safety Center (`/safety`)
- Full breakdown of the 4 pillars of trust: Property Verification, Driver License Checks, Automated Smart Access, and $1,000,000 Host Protection Shield.
- Transparent distinction between the interactive prototype environment and production hardware/payment integrations.

### 9. Interactive Prototype & Persona Switcher
- A persistent prototype banner allows switching between **Driver Mode (Alexander Hayes)** and **Owner Mode (Marcus Vance)** at any time.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: React 18 + TypeScript + Vite 5
- **Styling**: Tailwind CSS with custom mobility palette (deep navy `#0F172A`, emerald accent `#10B981` / `#059669`, warm neutrals)
- **Icons**: Lucide React
- **Routing**: React Router DOM v7
- **State Management**:
  - `ParkingContext`: Spaces list, bookings list, and favorited spot IDs with `localStorage` persistence.
  - `AuthContext`: Active persona (`driver` vs `owner`) with 1-click persona switching.
  - `ToastContext`: Floating notification system for booking updates, cancellations, and gate triggers.

---

## 💻 Local Development Setup

### Prerequisites
- Node.js `^20.11.0` or higher
- npm `^10.0.0` or higher

### Installation & Run

```bash
# 1. Clone repository & enter directory
cd Parko

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

### Production Build & Typecheck

```bash
npm run build
```

The production bundle is compiled into `dist/`.
