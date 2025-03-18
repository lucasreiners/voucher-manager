package de.lr.vouchermanager.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.reactive.CorsWebFilter
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource

@Configuration
class CorsConfig {
    @Bean
    fun corsWebFilter(): CorsWebFilter {
        val corsConfig = CorsConfiguration()
        corsConfig.addAllowedOrigin("*")
        corsConfig.addAllowedHeader("*")
        corsConfig.addAllowedMethod("*")

        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", corsConfig)

        return CorsWebFilter(source)
    }
}
