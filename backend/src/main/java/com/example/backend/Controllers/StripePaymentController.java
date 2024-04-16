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
@CrossOrigin(origins = {"http://localhost:4200", "https://quaint-jar-production.up.railway.app/", "https://keyboardbuddy.khairul-imran.dev"})
public class StripePaymentController {

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @Value("${local.client.url}")
    private String localClientUrl;

    String URL = localClientUrl;

    @PostMapping("/create-checkout-session")
    public ResponseEntity<String> createCheckoutSession() throws StripeException {
        Stripe.apiKey = stripeApiKey;
        SessionCreateParams params = SessionCreateParams.builder()
            .setMode(SessionCreateParams.Mode.PAYMENT)
            // .setSuccessUrl(URL + "/success") // Removed .html
            .setSuccessUrl(localClientUrl + "/success?session_id={CHECKOUT_SESSION_ID}") // Removed .html
            .setCancelUrl(localClientUrl + "/cancel") // Removed .html
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
