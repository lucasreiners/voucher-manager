package de.lr.vouchermanager.service

import de.lr.vouchermanager.api.model.ShopResponse
import de.lr.vouchermanager.data.ShopEntity
import org.jetbrains.exposed.sql.StdOutSqlLogger
import org.jetbrains.exposed.sql.addLogger
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.stereotype.Service

@Service
class ShopService {
    suspend fun getAllShops(): List<ShopResponse> =
        transaction {
            addLogger(StdOutSqlLogger)
            ShopEntity.all().map(ShopEntity::toResponse)
        }
}

fun ShopEntity.toResponse() =
    ShopResponse(
        id = this.id.value,
        name = this.name,
        backgroundColor = this.backgroundColor,
        iconUrl = this.iconUrl,
    )
