package com.medicalscan.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.*;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;
import java.util.function.Supplier;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()));
//            .authorizeHttpRequests(auth -> auth
//                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
//                    .anyRequest().authenticated()
//            );

        return http.build();

    }//SecurityFilterChain Bean

    //CORS 보안정책 수행 객체
    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of("http://172.16.250.23:3000","http://172.16.250.23:3000" ));
        configuration.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));

        configuration.setAllowedHeaders(List.of(
                "Authorization","Content-Type","X-XSRF-TOKEN",
                "X-Requested-With","Accept","Origin"
        ));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}//SecurityConfig class