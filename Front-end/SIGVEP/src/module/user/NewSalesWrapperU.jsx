import React from 'react';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import NewSalesU from './NewSalesU';

const stripePromise = loadStripe("pk_test_51RpwxMBweNZTlzd1jTeReXibPM1uPBziO1o267a1zz7eGZdqGpWGnokG1mQT9PDtbHkU5x2a6l6TufjGZL5Yglb500vZ2p8Iea");

export default function NewSalesWrapperU() {
  return (
    <Elements stripe={stripePromise}>
      <NewSalesU/>
    </Elements>
  );
}
