package com.example.backend.Controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

import jakarta.json.Json;
import jakarta.json.JsonObject;

@RestController
@CrossOrigin(origins = {"http://localhost:4200"})
public class StripePaymentController {

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    String URL = "http://localhost:4200";

    @PostMapping("/create-checkout-session")
    public ResponseEntity<String> createCheckoutSession() throws StripeException {
        Stripe.apiKey = stripeApiKey;
        SessionCreateParams params = SessionCreateParams.builder()
            .setMode(SessionCreateParams.Mode.PAYMENT)
            // .setSuccessUrl(URL + "/success") // Removed .html
            .setSuccessUrl(URL + "/success?session_id={CHECKOUT_SESSION_ID}") // Removed .html
            .setCancelUrl(URL + "/cancel") // Removed .html
            .addLineItem(
                SessionCreateParams.LineItem.builder()
                    .setQuantity(1L)
                    .setPrice("price_1P5qQ208WbUFB6CYjkhbdw1T")
                    .build())
                .build();
        Session session = Session.create(params);

        System.out.println("Payment Controller - URL: " + session.getUrl());

        JsonObject urlInJson = Json.createObjectBuilder().add("url", session.getUrl()).build();

        return ResponseEntity.ok(urlInJson.toString());
    }

}
