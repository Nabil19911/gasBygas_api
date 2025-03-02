import { test, expect, request } from "@playwright/test";

const baseURL = "http://localhost:5000";

let apiContext;
let accessToken;
let testUser = {
  first_name: "John",
  last_name: "Doe",
  nic: `NIC${Math.floor(Math.random() * 100000)}`, // Ensure unique NIC
  email: `test${Math.floor(Math.random() * 100000)}@example.com`, // Ensure unique email
  password: "Test@1234",
  contact: "+123456789",
  full_address: JSON.stringify({
    district: "Colombo",
    post_code: "12345",
    address: "123 Main Street",
  }),
  business_type: "Individual",
};

test.beforeAll(async ({ playwright }) => {
  apiContext = await request.newContext();
});

test("Register an Individual User", async () => {
  const response = await apiContext.post(`${baseURL}/auth/register`, {
    data: {
      individual_details: JSON.stringify({
        first_name: testUser.first_name,
        last_name: testUser.last_name,
        nic: testUser.nic,
      }),
      email: testUser.email,
      password: testUser.password,
      contact: testUser.contact,
      full_address: testUser.full_address,
      business_type: testUser.business_type,
    },
  });

  const body = await response.json();
  console.log("Register Response:", body);

  expect(response.status()).toBe(201);
  expect(body.message).toBe("Customer registered successfully.");

  // Capture the accessToken from the root level
  accessToken = body.accessToken;
  expect(accessToken).toBeDefined();
});

test("Login with the Registered Individual User", async () => {
  const response = await apiContext.post(`${baseURL}/auth/login`, {
    data: {
      email: testUser.email, // Ensure this is the same as the registered email
      password: testUser.password, // Ensure this is the same as the registered password
    },
  });

  const body = await response.json();
  console.log("Login Response:", body);

  // Check that the login was successful
  expect(response.status()).toBe(200);
  expect(body).toHaveProperty("accessToken");

  // Store the access token
  accessToken = body.accessToken;
  expect(accessToken).toBeDefined();
});

test("Access protected endpoint with valid token", async () => {
  // Ensure we have a valid token
  expect(accessToken).toBeDefined();

  // Access a protected endpoint, e.g., the gas request creation endpoint
  const response = await apiContext.post(
    `${baseURL}/api/gas-request/individual`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Use the valid token here
      },
      data: {
        userId: "67a780e18985994ec55ed5b2",
        outletId: "67a7078a43bd5451d7d3a6db",
        scheduleId: "67a708c343bd5451d7d3a722",
        gas: {
          type: "LARGE",
          requestType: "New_Gas",
          gasQuantity: 5,
        },
        createdBy: "CUSTOMER",
      },
    }
  );

  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body.data).toHaveProperty("gasRequest");
  expect(body.data.gasRequest).toHaveProperty(
    "userId",
    "67a780e18985994ec55ed5b2"
  );
  expect(body.data.gasRequest.gas.type).toBe("LARGE");
  expect(body.data.gasRequest.gas.gasQuantity).toBe(5);

  console.log("Gas Request Created:", body.data.gasRequest);
});
