import { config } from 'dotenv';
import chai from 'chai';
import { describe, it, before } from 'mocha';
import Stripe from 'stripe';
const { expect } = chai;

// Load environment variables
config();

const stripe = Stripe(process.env.Stripe_secret_key);

describe('Stripe Payment Tests', () => {
  it('should create a successful charge', async () => {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 2000, // Amount in cents
      currency: 'usd',
      payment_method_types: ['card'],
    });

    expect(paymentIntent).to.have.property('id');
    expect(paymentIntent.amount).to.equal(2000);
    expect(paymentIntent.currency).to.equal('usd');
    expect(paymentIntent.status).to.equal('requires_payment_method');

    // Use a predefined test token instead of creating a payment method with raw card data
    const testToken = 'tok_visa'; // Test token that represents a successful card

    const confirmedIntent = await stripe.paymentIntents.confirm(paymentIntent.id, {
      payment_method_data: {
        type: 'card',
        card: {
          token: testToken,
        },
      },
    });

    expect(confirmedIntent.status).to.equal('succeeded');
  });

  it('should handle a failed charge due to insufficient funds', async () => {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 2000,
      currency: 'usd',
      payment_method_types: ['card'],
    });

    // Use a test token that simulates a card decline due to insufficient funds
    const testToken = 'tok_chargeCustomerFail'; // Test token that represents a declined card

    try {
      await stripe.paymentIntents.confirm(paymentIntent.id, {
        payment_method_data: {
          type: 'card',
          card: {
            token: testToken,
          },
        },
      });
    } catch (error) {
      expect(error.type).to.equal('StripeCardError');
      expect(error.code).to.equal('card_declined');
    }
  });
});
