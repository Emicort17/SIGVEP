package utez.edu.mx.SIGVEP.config;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.net.Proxy;

@Configuration
public class StripeConfig {
    @Value("${stripe.secret.key}")
    private String secretKey;
    @PostConstruct
    public void init() {
        Stripe.enableTelemetry = false;
        Stripe.setConnectionProxy(Proxy.NO_PROXY);

        Stripe.apiKey = secretKey;
    }
}
