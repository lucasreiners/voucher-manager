package de.lr.vouchermanager.api.model

import java.util.UUID

data class VoucherResponse(
    val id: UUID,
    val code: String,
    val codeFormat: String,
    val createdAt: String,
    val redeemedAt: String?,
    val shopId: UUID,
)

data class ShopResponse(
    val id: UUID,
    val name: String,
    val backgroundColor: String,
    val iconUrl: String,
)
