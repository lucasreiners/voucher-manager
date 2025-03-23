package de.lr.vouchermanager.api

import de.lr.vouchermanager.VoucherManagerApplication
import de.lr.vouchermanager.api.model.ShopResponse
import de.lr.vouchermanager.data.ShopEntity
import io.kotest.matchers.collections.shouldContainExactlyInAnyOrder
import io.kotest.matchers.collections.shouldHaveSize
import io.kotest.matchers.nulls.shouldNotBeNull
import io.kotest.matchers.shouldBe
import kotlinx.coroutines.runBlocking
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.ResponseEntity
import org.springframework.test.context.ActiveProfiles
import java.util.UUID

@SpringBootTest(
    classes = [VoucherManagerApplication::class],
)
@ActiveProfiles("test")
class ShopsControllerTest {
    @Autowired
    private lateinit var shopsController: ShopsController

    @BeforeEach
    fun setUp() {
        // Clear database before each test
        transaction {
            ShopEntity.all().forEach { it.delete() }
        }
    }

    @Test
    fun `should return empty list when no shops exist`(): Unit =
        runBlocking {
            // Act
            val response: ResponseEntity<List<ShopResponse>> = shopsController.getShops()

            // Assert
            response.statusCode.value() shouldBe 200
            response.body.shouldNotBeNull() shouldHaveSize 0
        }

    @Test
    fun `should return list of shops when shops exist`(): Unit =
        runBlocking {
            // Arrange
            val shop1Id = UUID.randomUUID()
            val shop2Id = UUID.randomUUID()

            transaction {
                ShopEntity.new(shop1Id) {
                    name = "Test Shop 1"
                    backgroundColor = "#FF0000"
                    iconUrl = "https://example.com/icon1.png"
                }
                ShopEntity.new(shop2Id) {
                    name = "Test Shop 2"
                    backgroundColor = "#00FF00"
                    iconUrl = "https://example.com/icon2.png"
                }
            }

            // Act
            val response: ResponseEntity<List<ShopResponse>> = shopsController.getShops()

            // Assert
            response.statusCode.value() shouldBe 200
            response.body.shouldNotBeNull().let { body ->
                body shouldHaveSize 2
                body shouldContainExactlyInAnyOrder
                    listOf(
                        ShopResponse(
                            id = shop1Id,
                            name = "Test Shop 1",
                            backgroundColor = "#FF0000",
                            iconUrl = "https://example.com/icon1.png",
                        ),
                        ShopResponse(
                            id = shop2Id,
                            name = "Test Shop 2",
                            backgroundColor = "#00FF00",
                            iconUrl = "https://example.com/icon2.png",
                        ),
                    )
            }
        }
}
