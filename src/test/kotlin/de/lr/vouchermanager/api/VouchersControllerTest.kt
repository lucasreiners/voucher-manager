package de.lr.vouchermanager.api

import de.lr.vouchermanager.VoucherManagerApplication
import de.lr.vouchermanager.api.model.VoucherResponse
import de.lr.vouchermanager.data.CodeFormat
import de.lr.vouchermanager.data.ShopEntity
import de.lr.vouchermanager.data.VoucherEntity
import io.kotest.matchers.collections.shouldHaveSize
import io.kotest.matchers.nulls.shouldNotBeNull
import io.kotest.matchers.shouldBe
import java.time.Instant
import java.util.UUID
import kotlinx.coroutines.runBlocking
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.ResponseEntity
import org.springframework.test.context.ActiveProfiles

@SpringBootTest(classes = [VoucherManagerApplication::class])
@ActiveProfiles("test")
class VouchersControllerTest {
    @Autowired private lateinit var vouchersController: VouchersController

    private lateinit var testShop: ShopEntity
    private lateinit var testShopId: UUID

    @BeforeEach
    fun setUp() {
        // Clear database and create test shop
        transaction {
            VoucherEntity.all().forEach { it.delete() }
            ShopEntity.all().forEach { it.delete() }

            testShopId = UUID.randomUUID()
            testShop =
                    ShopEntity.new(testShopId) {
                        name = "Test Shop"
                        backgroundColor = "#000000"
                        iconUrl = "https://example.com/icon.png"
                    }
        }
    }

    @Test
    fun `should return empty list when no vouchers exist`(): Unit = runBlocking {
        // Act
        val response: ResponseEntity<List<VoucherResponse>> = vouchersController.getVouchers()

        // Assert
        response.statusCode.value() shouldBe 200
        response.body.shouldNotBeNull() shouldHaveSize 0
    }

    @Test
    fun `should return list of vouchers when vouchers exist`(): Unit = runBlocking {
        // Arrange
        val voucherId = UUID.randomUUID()
        transaction {
            VoucherEntity.new(voucherId) {
                code = "123456789"
                codeFormat = CodeFormat.EAN13
                shop = testShop
                createdAt = Instant.now()
            }
        }

        // Act
        val response: ResponseEntity<List<VoucherResponse>> = vouchersController.getVouchers()

        // Assert
        response.statusCode.value() shouldBe 200
        response.body.shouldNotBeNull().let { body ->
            body shouldHaveSize 1
            body[0].let { voucher ->
                voucher.id shouldBe voucherId
                voucher.code shouldBe "123456789"
                voucher.codeFormat shouldBe "EAN13"
                voucher.shopId shouldBe testShopId
                voucher.redeemedAt shouldBe null
            }
        }
    }

    @Test
    fun `should create new voucher`(): Unit = runBlocking {
        // Arrange
        val request =
                CreateVoucherRequest(
                        shopId = testShopId,
                        code = "987654321",
                        codeFormat = CodeFormat.CODE128,
                )

        // Act
        val response: ResponseEntity<VoucherResponse> = vouchersController.createVoucher(request)

        // Assert
        response.statusCode.value() shouldBe 200
        response.body.shouldNotBeNull().let { voucher ->
            voucher.code shouldBe "987654321"
            voucher.codeFormat shouldBe "CODE128"
            voucher.shopId shouldBe testShopId
            voucher.redeemedAt shouldBe null
        }

        // Verify in database
        transaction {
            VoucherEntity.all().count() shouldBe 1
            VoucherEntity.all().first().let { entity ->
                entity.code shouldBe "987654321"
                entity.codeFormat shouldBe CodeFormat.CODE128
                entity.shop.id.value shouldBe testShopId
                entity.redeemedAt shouldBe null
            }
        }
    }

    @Test
    fun `should redeem voucher`(): Unit = runBlocking {
        // Arrange
        val voucherId = UUID.randomUUID()
        transaction {
            VoucherEntity.new(voucherId) {
                code = "123456789"
                codeFormat = CodeFormat.EAN13
                shop = testShop
                createdAt = Instant.now()
            }
        }

        // Act
        val response: ResponseEntity<VoucherResponse> = vouchersController.redeemVoucher(voucherId)

        // Assert
        response.statusCode.value() shouldBe 200
        response.body.shouldNotBeNull().let { voucher ->
            voucher.id shouldBe voucherId
            voucher.redeemedAt.shouldNotBeNull()
        }

        // Verify in database
        transaction {
            val redeemedVoucher = VoucherEntity.findById(voucherId)
            redeemedVoucher.shouldNotBeNull()
            redeemedVoucher.redeemedAt.shouldNotBeNull()
        }
    }

    @Test
    fun `should return 404 when redeeming non-existent voucher`(): Unit = runBlocking {
        // Act
        val response: ResponseEntity<VoucherResponse> =
                vouchersController.redeemVoucher(UUID.randomUUID())

        // Assert
        response.statusCode.value() shouldBe 404
    }

    @Test
    fun `should not redeem already redeemed voucher`(): Unit = runBlocking {
        // Arrange
        val voucherId = UUID.randomUUID()
        val initialRedemptionTime = Instant.now().minusSeconds(60)

        transaction {
            VoucherEntity.new(voucherId) {
                code = "123456789"
                codeFormat = CodeFormat.EAN13
                shop = testShop
                createdAt = Instant.now()
                redeemedAt = initialRedemptionTime
            }
        }

        // Act
        val response: ResponseEntity<VoucherResponse> = vouchersController.redeemVoucher(voucherId)

        // Assert
        response.statusCode.value() shouldBe 200

        // Verify redemption time hasn't changed in database
        transaction {
            val voucher = VoucherEntity.findById(voucherId)
            voucher.shouldNotBeNull()
            voucher.redeemedAt shouldBe initialRedemptionTime
        }
    }
}
