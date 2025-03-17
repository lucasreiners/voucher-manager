package de.lr.vouchermanager.api

import de.lr.vouchermanager.api.model.VoucherResponse
import de.lr.vouchermanager.service.VoucherService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
class VouchersController(
    val voucherService: VoucherService,
) {
    @GetMapping("/vouchers")
    suspend fun getVouchers(): ResponseEntity<List<VoucherResponse>> = ResponseEntity.ok(voucherService.getAllVouchers())
    
    @PutMapping("/vouchers/{id}/redeem")
    suspend fun redeemVoucher(@PathVariable id: UUID): ResponseEntity<VoucherResponse> {
        val redeemedVoucher = voucherService.redeemVoucher(id)
        return if (redeemedVoucher != null) {
            ResponseEntity.ok(redeemedVoucher)
        } else {
            ResponseEntity.notFound().build()
        }
    }
}
