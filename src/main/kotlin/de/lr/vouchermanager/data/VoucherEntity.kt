package de.lr.vouchermanager.data

import org.jetbrains.exposed.dao.UUIDEntity
import org.jetbrains.exposed.dao.UUIDEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.UUIDTable
import org.jetbrains.exposed.sql.javatime.timestamp
import java.util.UUID

@Suppress("ktlint:standard:enum-entry-name-case")
enum class CodeFormat {
    EAN13,
    ITF,
    CODE128,
    CODE128A,
    CODE128B,
    CODE128C,
    EAN8,
    EAN5,
    EAN2,
    UPCA,
    UPCE,
    CODE39,
    ITF14,
    MSI10,
    MSI11,
    MSI1010,
    MSI1110,
}

object VouchersTable : UUIDTable("vouchers") {
    val code = varchar("code", 255)
    val codeFormat = enumerationByName("code_format", 10, 1de1rm1::class).default(CodeFormat.EAN13)
    val createdAt = timestamp("created_at")
    val redeemedAt = timestamp("redeemed_at").nullable()
    val shopId = reference("shop_id", ShopsTable)
}

class VoucherEntity(
    id: EntityID<UUID>,
) : UUIDEntity(id = id) {
    companion object : UUIDEntityClass<VoucherEntity>(VouchersTable)

    var code by VouchersTable.code
    var codeFormat by VouchersTable.codeFormat
    var createdAt by VouchersTable.createdAt
    var redeemedAt by VouchersTable.redeemedAt
    var shop by ShopEntity referencedOn VouchersTable.shopId
}
