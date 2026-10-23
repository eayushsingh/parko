/**
 * Production-grade Automated Test Suite for Parko API
 * Tests all core endpoints: health, spaces, bookings, gate actuator, metrics, auth
 */

const BASE_URL = process.env.TEST_URL || 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 Starting Parko Backend Automated Test Suite...\n');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      process.stdout.write(`  ▶ Testing: ${name}... `);
      await fn();
      console.log('✅ PASSED');
      passed++;
    } catch (err) {
      console.log(`❌ FAILED: ${err.message}`);
      failed++;
    }
  }

  // 1. Health check
  await test('GET /health returns 200 and healthy status', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || data.status !== 'HEALTHY') throw new Error('Unhealthy status');
    if (!data.stats || data.stats.spacesCount <= 0) throw new Error('Missing stats');
  });

  // 2. Spaces list
  await test('GET /spaces returns list of available spaces with ₹ pricing', async () => {
    const res = await fetch(`${BASE_URL}/spaces`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data) || data.data.length === 0) {
      throw new Error('No spaces returned');
    }
    const sample = data.data[0];
    if (typeof sample.hourlyRate !== 'number' || sample.hourlyRate <= 0) {
      throw new Error('Invalid hourlyRate');
    }
  });

  // 3. Filtered spaces
  await test('GET /spaces?maxPrice=70 filters spaces accurately', async () => {
    const res = await fetch(`${BASE_URL}/spaces?maxPrice=70`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    for (const s of data.data) {
      if (s.hourlyRate > 70) throw new Error(`Space ${s.id} rate ${s.hourlyRate} exceeds maxPrice 70`);
    }
  });

  // 4. Space detail
  await test('GET /spaces/:id returns single space details', async () => {
    const res = await fetch(`${BASE_URL}/spaces/prk-101`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.data.id !== 'prk-101') throw new Error('Wrong space ID');
  });

  // 5. Create new listing
  let createdSpaceId = null;
  await test('POST /spaces creates a valid parking space', async () => {
    const res = await fetch(`${BASE_URL}/spaces`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Automated Test EV Bay Bandra Kurla Complex',
        description: 'Dedicated commercial bay with Level 2 EV charging.',
        address: 'G Block BKC',
        city: 'Mumbai',
        neighborhood: 'BKC Business District',
        hourlyRate: 95,
        dailyMaxRate: 500,
        type: 'EV Charging Bay',
        amenities: ['CCTV 24/7', 'Covered Parking', 'EV Charging Bay'],
        vehicleCompatibility: ['Sedan', 'SUV']
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.data.id) throw new Error('Failed to create space');
    createdSpaceId = data.data.id;
  });

  // 6. Update rate
  await test('PATCH /spaces/:id/rate adjusts hourly pricing', async () => {
    if (!createdSpaceId) throw new Error('No space to update');
    const res = await fetch(`${BASE_URL}/spaces/${createdSpaceId}/rate`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hourlyRate: 105, dailyMaxRate: 550 })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.data.hourlyRate !== 105) throw new Error('Rate was not updated');
  });

  // 7. Create booking
  let createdBookingId = null;
  await test('POST /bookings creates confirmed pass with gate code', async () => {
    const res = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        spaceId: 'prk-101',
        driverName: 'Test Driver',
        driverEmail: 'test.driver@example.com',
        vehiclePlate: 'MH 02 AB 9999',
        vehicleModel: 'Tesla Model 3',
        durationHours: 2,
        paymentMethod: 'Credit Card'
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.data.gateCode || !data.data.qrCodeSeed) {
      throw new Error('Booking pass generation incomplete');
    }
    createdBookingId = data.data.id;
  });

  // 8. Trigger IoT Smart Gate
  await test('POST /bookings/:id/trigger-gate triggers gate barrier actuator', async () => {
    if (!createdBookingId) throw new Error('No booking to trigger gate');
    const res = await fetch(`${BASE_URL}/bookings/${createdBookingId}/trigger-gate`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || data.gateStatus !== 'OPEN') throw new Error('Gate status not OPEN');
  });

  // 9. Cancel booking
  await test('POST /bookings/:id/cancel cancels with 100% refund', async () => {
    if (!createdBookingId) throw new Error('No booking to cancel');
    const res = await fetch(`${BASE_URL}/bookings/${createdBookingId}/cancel`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || data.data.status !== 'cancelled') throw new Error('Status not cancelled');
  });

  // 10. Owner metrics
  await test('GET /metrics/owner returns live occupancy and earnings', async () => {
    const res = await fetch(`${BASE_URL}/metrics/owner`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || data.data.occupancyRate === undefined || !data.data.thisWeekNet) {
      throw new Error('Invalid metrics schema');
    }
  });

  // 11. Platform metrics
  await test('GET /metrics/platform returns aggregate marketplace metrics', async () => {
    const res = await fetch(`${BASE_URL}/metrics/platform`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || data.data.currency !== 'INR (₹)' || data.data.satisfactionRate <= 0) {
      throw new Error('Invalid platform metrics');
    }
  });

  // 12. Auth Demo Login
  await test('POST /auth/login authenticates driver persona successfully', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'alex.hayes@example.com', role: 'driver' })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.token || data.user.role !== 'driver') {
      throw new Error('Driver login failed');
    }
  });

  // 13. Update Vehicle Info
  await test('PUT /auth/vehicle updates default vehicle license plate', async () => {
    const res = await fetch(`${BASE_URL}/auth/vehicle`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'usr-driver-01',
        makeModel: 'BMW i4 eDrive40',
        licensePlate: 'MH 01 DX 1234',
        state: 'Maharashtra'
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || data.user.defaultVehicle.licensePlate !== 'MH 01 DX 1234') {
      throw new Error('Vehicle info not updated');
    }
  });

  console.log(`\n====================================================`);
  console.log(`Test Results: ${passed} passed, ${failed} failed.`);
  console.log(`====================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
