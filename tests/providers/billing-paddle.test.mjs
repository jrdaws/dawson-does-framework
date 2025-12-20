import { test } from "node:test";
import assert from "node:assert/strict";

// Set test environment variables before importing provider
process.env.PADDLE_API_KEY = "test_paddle_key_12345";
process.env.PADDLE_WEBHOOK_SECRET = "test_webhook_secret";

test("billing.paddle: provider has correct name", async () => {
  const provider = (await import("../../src/platform/providers/impl/billing.paddle.ts")).default;
  assert.equal(provider.name, "billing.paddle");
});

test("billing.paddle: has ensureCustomer method", async () => {
  const provider = (await import("../../src/platform/providers/impl/billing.paddle.ts")).default;
  assert.equal(typeof provider.ensureCustomer, "function");
});

test("billing.paddle: has createCheckoutSession method", async () => {
  const provider = (await import("../../src/platform/providers/impl/billing.paddle.ts")).default;
  assert.equal(typeof provider.createCheckoutSession, "function");
});

test("billing.paddle: has getActiveSubscription method", async () => {
  const provider = (await import("../../src/platform/providers/impl/billing.paddle.ts")).default;
  assert.equal(typeof provider.getActiveSubscription, "function");
});

test("billing.paddle: has cancelSubscription method", async () => {
  const provider = (await import("../../src/platform/providers/impl/billing.paddle.ts")).default;
  assert.equal(typeof provider.cancelSubscription, "function");
});

test("billing.paddle: has recordUsage method", async () => {
  const provider = (await import("../../src/platform/providers/impl/billing.paddle.ts")).default;
  assert.equal(typeof provider.recordUsage, "function");
});

test("billing.paddle: has verifyWebhook method", async () => {
  const provider = (await import("../../src/platform/providers/impl/billing.paddle.ts")).default;
  assert.equal(typeof provider.verifyWebhook, "function");
});

test("billing.paddle: has parseWebhookEvent method", async () => {
  const provider = (await import("../../src/platform/providers/impl/billing.paddle.ts")).default;
  assert.equal(typeof provider.parseWebhookEvent, "function");
});

test("billing.paddle: has health method", async () => {
  const provider = (await import("../../src/platform/providers/impl/billing.paddle.ts")).default;
  assert.equal(typeof provider.health, "function");
});

test("billing.paddle: health returns correct structure", async () => {
  const provider = (await import("../../src/platform/providers/impl/billing.paddle.ts")).default;
  const result = await provider.health();

  assert.equal(typeof result.ok, "boolean");
  assert.equal(result.provider, "billing.paddle");
  assert.equal(typeof result.details, "object");
});

test("billing.paddle: health shows configured when API key present", async () => {
  const provider = (await import("../../src/platform/providers/impl/billing.paddle.ts")).default;
  const result = await provider.health();

  assert.equal(result.ok, true);
  assert.equal(result.details?.configured, true);
  assert.equal(result.details?.apiKey, true);
});

test("billing.paddle: verifyWebhook returns false when signature missing", async () => {
  const provider = (await import("../../src/platform/providers/impl/billing.paddle.ts")).default;

  const result = await provider.verifyWebhook({
    rawBody: JSON.stringify({ event_type: "test" }),
    headers: new Headers(),
  });

  assert.equal(result, false);
});

test("billing.paddle: verifyWebhook returns true when signature present", async () => {
  const provider = (await import("../../src/platform/providers/impl/billing.paddle.ts")).default;

  const result = await provider.verifyWebhook({
    rawBody: JSON.stringify({ event_type: "test" }),
    headers: new Headers({ "paddle-signature": "test_signature" }),
  });

  assert.equal(result, true);
});

test("billing.paddle: parseWebhookEvent parses valid event", async () => {
  const provider = (await import("../../src/platform/providers/impl/billing.paddle.ts")).default;

  const event = {
    event_id: "evt_123",
    event_type: "subscription.created",
    data: { subscription_id: "sub_123" },
  };

  const result = await provider.parseWebhookEvent(JSON.stringify(event));

  assert.equal(result.id, "evt_123");
  assert.equal(result.type, "subscription.created");
  assert.deepEqual(result.data, { subscription_id: "sub_123" });
});

test("billing.paddle: parseWebhookEvent throws on malformed JSON", async () => {
  const provider = (await import("../../src/platform/providers/impl/billing.paddle.ts")).default;

  await assert.rejects(
    async () => {
      await provider.parseWebhookEvent("not valid json");
    },
    (error) => {
      return error.name === "PaddleBillingError";
    }
  );
});

test("billing.paddle: provider module structure", async () => {
  const module = await import("../../src/platform/providers/impl/billing.paddle.ts");

  assert.ok(module.default, "Should have default export");
  assert.equal(typeof module.default.name, "string");
  assert.equal(typeof module.default.ensureCustomer, "function");
  assert.equal(typeof module.default.createCheckoutSession, "function");
  assert.equal(typeof module.default.getActiveSubscription, "function");
  assert.equal(typeof module.default.cancelSubscription, "function");
  assert.equal(typeof module.default.recordUsage, "function");
  assert.equal(typeof module.default.verifyWebhook, "function");
  assert.equal(typeof module.default.parseWebhookEvent, "function");
  assert.equal(typeof module.default.health, "function");
});

test("billing.paddle: getActiveSubscription returns null", async () => {
  const provider = (await import("../../src/platform/providers/impl/billing.paddle.ts")).default;

  // Paddle implementation returns null as it requires subscription tracking
  const result = await provider.getActiveSubscription("cus_123");
  assert.equal(result, null);
});
