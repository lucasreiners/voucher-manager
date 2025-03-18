package de.lr.vouchermanager.data

import org.jetbrains.exposed.dao.UUIDEntity
import org.jetbrains.exposed.dao.UUIDEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.UUIDTable
import java.util.UUID

object ShopsTable : UUIDTable("shops") {
    val name = varchar("shop_name", 255)
    val backgroundColor = varchar("background_color", 255)
    val iconUrl = varchar("icon_url", 255)
}

class ShopEntity(
    id: EntityID<UUID>,
) : UUIDEntity(id = id) {
    companion object : UUIDEntityClass<ShopEntity>(ShopsTable)

    var name by ShopsTable.name
    var backgroundColor by ShopsTable.backgroundColor
    var iconUrl by ShopsTable.iconUrl
}
