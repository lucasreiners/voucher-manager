package de.lr.vouchermanager.data

import org.jetbrains.exposed.dao.UUIDEntity
import org.jetbrains.exposed.dao.UUIDEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.UUIDTable
import org.jetbrains.exposed.sql.javatime.timestamp
import java.util.UUID

object VouchersTable : UUIDTable("vouchers") {
    val code = varchar("code", 255)
    val createdAt = timestamp("created_at")
    val redeemedAt = timestamp("redeemed_at").nullable()
    val shopId = reference("shop_id", ShopsTable)
}

class VoucherEntity(
    id: EntityID<UUID>,
) : UUIDEntity(id = id) {
    companion object : UUIDEntityClass<VoucherEntity>(VouchersTable)

    var code by VouchersTable.code
    var createdAt by VouchersTable.createdAt
    var redeemedAt by VouchersTable.redeemedAt
    var shop by ShopEntity referencedOn VouchersTable.shopId
}
