package de.lr.vouchermanager.api

import de.lr.vouchermanager.api.model.ShopResponse
import de.lr.vouchermanager.service.ShopService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class ShopsController(
    val shopService: ShopService,
) {
    @GetMapping("/shops")
    suspend fun getShops(): ResponseEntity<List<ShopResponse>> = ResponseEntity.ok(shopService.getAllShops())
}
