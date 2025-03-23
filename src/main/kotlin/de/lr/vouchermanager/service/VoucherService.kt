package de.lr.vouchermanager.service

import de.lr.vouchermanager.api.model.VoucherResponse
import de.lr.vouchermanager.data.CodeFormat
import de.lr.vouchermanager.data.ShopEntity
import de.lr.vouchermanager.data.VoucherEntity
import org.jetbrains.exposed.sql.StdOutSqlLogger
import org.jetbrains.exposed.sql.addLogger
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.stereotype.Service
import java.time.Instant
import java.util.UUID

@Service
class VoucherService {
    suspend fun getAllVouchers(): List<VoucherResponse> =
        transaction {
            addLogger(StdOutSqlLogger)
            VoucherEntity.all().sortedBy { it.createdAt }.map(VoucherEntity::toResponse)
        }

    suspend fun redeemVoucher(id: UUID): VoucherResponse? =
        transaction {
            addLogger(StdOutSqlLogger)
            VoucherEntity.findById(id)?.let { voucher ->
                // Only redeem if not already redeemed
                if (voucher.redeemedAt == null) {
                    voucher.redeemedAt = Instant.now()
                }
                voucher.toResponse()
            }
        }

    suspend fun createVoucher(
        shopId: UUID,
        code: String,
        codeFormat: CodeFormat = CodeFormat.EAN13,
    ): VoucherResponse =
        transaction {
            addLogger(StdOutSqlLogger)
            val shop = ShopEntity.findById(shopId) ?: throw IllegalArgumentException("Shop not found")
            VoucherEntity
                .new {
                    this.code = code
                    this.codeFormat = codeFormat
                    this.shop = shop
                    this.createdAt = Instant.now()
                }.toResponse()
        }
}

fun VoucherEntity.toResponse() =
    VoucherResponse(
        id = this.id.value,
        code = this.code,
        codeFormat = this.codeFormat.name,
        createdAt = this.createdAt.toString(),
        redeemedAt = this.redeemedAt?.toString(),
        shopId = this.shop.id.value,
    )
