import { test } from "node:test";
import assert from "node:assert/strict";

// Set test environment variables before importing provider
process.env.LEMON_SQUEEZY_API_KEY = "test_ls_key_12345";
process.env.LEMON_SQUEEZY_STORE_ID = "12345";
process.env.LEMON_SQUEEZY_WEBHOOK_SECRET = "test_webhook_secret";

test("billing.lemon-squeezy: provider has correct name", async () => {
  const provider = (await import("../../src/platform/providers/impl/billing.lemon-squeezy.ts")).default;
  assert.equal(provider.name, "billing.lemon-squeezy");
});

test("billing.lemon-squeezy: has ensureCustomer method", async () => {
  const provider = (await import("../../src/platform/providers/impl/billing.lemon-squeezy.ts")).default;
  assert.equal(typeof provider.ensureCustomer, "function");
});

test("billing.lemon-squeezy: has createCheckoutSession method", async () => {
  const provider = (await import("../../src/platform/providers/impl/billing.lemon-squeezy.ts")).default;
  assert.equal(typeof provider.createCheckoutSession, "function");
});

test("billing.lemon-squeezy: has getActiveSubscription method", async () => {
  const provider = (await import("../../src/platform/providers/impl/billing.lemon-squeezy.ts")).default;
  assert.equal(typeof provider.getActiveSubscription, "function");
});

test("billing.lemon-squeezy: has cancelSubscription method", async () => {
  const provider = (await import("../../src/platform/providers/impl/billing.lemon-squeezy.ts")).default;
  assert.equal(typeof provider.cancelSubscription, "function");
});

test("billing.lemon-squeezy: has recordUsage method", async () => {
  const provider = (await import("../../src/platform/providers/impl/billing.lemon-squeezy.ts")).default;
  assert.equal(typeof provider.recordUsage, "function");
});

test("billing.lemon-squeezy: has verifyWebhook method", async () => {
  const provider = (await import("../../src/platform/providers/impl/billing.lemon-squeezy.ts")).default;
  assert.equal(typeof provider.verifyWebhook, "function");
});

test("billing.lemon-squeezy: has parseWebhookEvent method", async () => {
  const provider = (await import("../../src/platform/providers/impl/billing.lemon-squeezy.ts")).default;
  assert.equal(typeof provider.parseWebhookEvent, "function");
});

test("billing.lemon-squeezy: has health method", async () => {
  const provider = (await import("../../src/platform/providers/impl/billing.lemon-squeezy.ts")).default;
  assert.equal(typeof provider.health, "function");
});

test("billing.lemon-squeezy: health returns correct structure", async () => {
  const provider = (await import("../../src/platform/providers/impl/billing.lemon-squeezy.ts")).default;
  const result = await provider.health();

  assert.equal(typeof result.ok, "boolean");
  assert.equal(result.provider, "billing.lemon-squeezy");
  assert.equal(typeof result.details, "object");
});

test("billing.lemon-squeezy: health shows configured when API key and store ID present", async () => {
  const provider = (await import("../../src/platform/providers/impl/billing.lemon-squeezy.ts")).default;
  const result = await provider.health();

  assert.equal(result.ok, true);
  assert.equal(result.details?.configured, true);
  assert.equal(result.details?.apiKey, true);
  assert.equal(result.details?.storeId, true);
});

test("billing.lemon-squeezy: verifyWebhook returns false when signature missing", async () => {
  const provider = (await import("../../src/platform/providers/impl/billing.lemon-squeezy.ts")).default;

  const result = await provider.verifyWebhook({
    rawBody: JSON.stringify({ meta: { event_name: "test" } }),
    headers: new Headers(),
  });

  assert.equal(result, false);
});

test("billing.lemon-squeezy: verifyWebhook returns true when signature present", async () => {
  const provider = (await import("../../src/platform/providers/impl/billing.lemon-squeezy.ts")).default;

  const result = await provider.verifyWebhook({
    rawBody: JSON.stringify({ meta: { event_name: "test" } }),
    headers: new Headers({ "x-signature": "test_signature" }),
  });

  assert.equal(result, true);
});

test("billing.lemon-squeezy: parseWebhookEvent parses valid event", async () => {
  const provider = (await import("../../src/platform/providers/impl/billing.lemon-squeezy.ts")).default;

  const event = {
    meta: {
      event_name: "subscription_created",
      custom_data: { webhook_id: "wh_123" },
    },
    data: { subscription_id: "sub_123" },
  };

  const result = await provider.parseWebhookEvent(JSON.stringify(event));

  assert.equal(result.id, "wh_123");
  assert.equal(result.type, "subscription_created");
  assert.deepEqual(result.data, { subscription_id: "sub_123" });
});

test("billing.lemon-squeezy: parseWebhookEvent throws on malformed JSON", async () => {
  const provider = (await import("../../src/platform/providers/impl/billing.lemon-squeezy.ts")).default;

  await assert.rejects(
    async () => {
      await provider.parseWebhookEvent("not valid json");
    },
    (error) => {
      return error.name === "LemonSqueezyBillingError";
    }
  );
});

test("billing.lemon-squeezy: provider module structure", async () => {
  const module = await import("../../src/platform/providers/impl/billing.lemon-squeezy.ts");

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

test("billing.lemon-squeezy: getActiveSubscription returns null", async () => {
  const provider = (await import("../../src/platform/providers/impl/billing.lemon-squeezy.ts")).default;

  // Lemon Squeezy implementation returns null as it requires subscription tracking
  const result = await provider.getActiveSubscription("cus_123");
  assert.equal(result, null);
});

test("billing.lemon-squeezy: recordUsage throws not supported error", async () => {
  const provider = (await import("../../src/platform/providers/impl/billing.lemon-squeezy.ts")).default;

  await assert.rejects(
    async () => {
      await provider.recordUsage({
        subscriptionId: "sub_123",
        quantity: 100,
        timestamp: Date.now(),
      });
    },
    (error) => {
      return error.message.includes("not supported");
    }
  );
});
