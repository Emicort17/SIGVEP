package utez.edu.mx.SIGVEP.service.sale;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.SIGVEP.controller.product.dto.ProductQuantityDto;
import utez.edu.mx.SIGVEP.controller.product.dto.ProductQuantityNewDto;
import utez.edu.mx.SIGVEP.controller.sale.dto.SaleDto;
import utez.edu.mx.SIGVEP.controller.sale.dto.SaleNewDto;
import utez.edu.mx.SIGVEP.controller.user.dto.UserDto;
import utez.edu.mx.SIGVEP.controller.user.dto.UserPublicDto;
import utez.edu.mx.SIGVEP.model.product.ProductBean;
import utez.edu.mx.SIGVEP.model.product.ProductRepository;
import utez.edu.mx.SIGVEP.model.sale.SaleBean;
import utez.edu.mx.SIGVEP.model.sale.SaleRepository;
import utez.edu.mx.SIGVEP.model.saleproduct.SaleProductBean;
import utez.edu.mx.SIGVEP.model.user.UserBean;
import utez.edu.mx.SIGVEP.model.user.UserRepository;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SaleService {

    private static final Logger logger = LoggerFactory.getLogger(SaleService.class);

    @Autowired
    private SaleRepository saleDao;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;


    @Transactional(readOnly = true)
    public List<SaleNewDto> getAllSales() {
        return saleDao.findAll().stream()
                .map(this::toNewDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<SaleNewDto> getSaleById(Integer id) {
        return saleDao.findById(id).map(this::toNewDTO);
    }


    @Transactional
    public Optional<SaleDto> updateSale(Integer id, SaleDto saleDto) {
        logger.info("Actualizando venta con ID: {}", id);

        Optional<SaleBean> existingSale = saleDao.findById(id);
        if (existingSale.isPresent()) {
            SaleBean sale = existingSale.get();
            setSaleData(sale, saleDto, false);
            saleDao.save(sale);
            logger.info("Venta actualizada correctamente.");
            return Optional.of(toDTO(sale));
        } else {
            logger.warn("Venta con ID {} no encontrada", id);
            return Optional.empty();
        }
    }

    @Transactional
    public boolean deleteSale(Integer id) {
        logger.info("Eliminando venta con ID: {}", id);

        if (saleDao.existsById(id)) {
            saleDao.deleteById(id);
            logger.info("Venta eliminada correctamente.");
            return true;
        }

        logger.warn("No se encontró la venta con ID: {}", id);
        return false;
    }

    private void setSaleData(SaleBean sale, SaleDto saleDto, boolean isNew) {
        sale.setDate(saleDto.getDate());
        sale.setTotal_sale(
                saleDto.getProducts().stream()
                        .mapToDouble(productQuantity -> productQuantity.getQuantity() * productRepository.findById(productQuantity.getProductId())
                                .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + productQuantity.getProductId()))
                                .getUnit_price())
                        .sum());
        sale.setPayment_type(saleDto.getPayment_type());

        if (saleDto.getStatus() != null) {
            sale.setStatus(saleDto.getStatus());
        } else if (isNew) {
            sale.setStatus(true);
        }

        // Buscar y setear el usuario
        if (saleDto.getUserId() != null) {
            UserBean user = userRepository.findById(saleDto.getUserId())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            sale.setUser(user);
        } else {
            throw new RuntimeException("El ID del usuario es obligatorio.");
        }

        // Limpiar productos previos si es actualización
        if (!isNew && sale.getSaleProducts() != null) {
            sale.getSaleProducts().clear();
        }

        // Crear y asociar SaleProductBean
        if (saleDto.getProducts() != null && !saleDto.getProducts().isEmpty()) {
            List<SaleProductBean> saleProducts = saleDto.getProducts().stream()
                    .map(productQuantity -> {
                        ProductBean product = productRepository.findById(productQuantity.getProductId())
                                .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + productQuantity.getProductId()));
                        if (product.getStock() < productQuantity.getQuantity()) {
                            throw new RuntimeException("Stock insuficiente para el producto: " + product.getName());
                        }
                        product.setStock(product.getStock() - productQuantity.getQuantity());
                        productRepository.save(product);

                        return utez.edu.mx.SIGVEP.model.saleproduct.SaleProductBean.builder()
                                .sale(sale)
                                .product(product)
                                .quantity(productQuantity.getQuantity())
                                .build();
                    })
                    .collect(Collectors.toList());
            sale.getSaleProducts().addAll(saleProducts);
            sale.setQuantity_products(saleProducts.stream()
                    .mapToInt(sp -> sp.getQuantity().intValue())
                    .sum());
        } else {
            throw new RuntimeException("Debes proporcionar al menos un producto.");
        }
    }

    @Transactional
    public Map<String, Object> saveSaleWithPayment(SaleDto saleDto) throws StripeException {
        double total = calculateTotalSale(saleDto);

        if ("Efectivo".equalsIgnoreCase(saleDto.getPayment_type())) {
            SaleBean sale = buildSaleEntity(saleDto, true);
            SaleBean saved = saleDao.save(sale);

            Map<String, Object> saleInfo = Map.of(
                    "id_venta", saved.getId_venta(),
                    "date", saved.getDate(),
                    "total_sale", saved.getTotal_sale(),
                    "payment_type", saved.getPayment_type()
            );

            return Map.of(
                    "message", "Venta registrada con pago en efectivo",
                    "sale", saleInfo
            );
        }

        if (saleDto.getPaymentIntentId() == null) {
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount((long) (total * 100))
                    .setCurrency("mxn")
                    .setDescription("Venta de productos SIGVEP")
                    .setPaymentMethod(saleDto.getPaymentMethodId())
                    .setConfirmationMethod(PaymentIntentCreateParams.ConfirmationMethod.AUTOMATIC)
                    .setConfirm(false)
                    .build();

            PaymentIntent intent = PaymentIntent.create(params);

            return Map.of(
                    "message", "PaymentIntent creado. Confirmar en frontend.",
                    "clientSecret", intent.getClientSecret(),
                    "paymentIntentId", intent.getId()
            );
        }

        PaymentIntent paymentIntent = PaymentIntent.retrieve(saleDto.getPaymentIntentId());

        if (!"succeeded".equals(paymentIntent.getStatus())) {
            throw new RuntimeException("El pago no fue confirmado: estado = " + paymentIntent.getStatus());
        }

        SaleBean sale = buildSaleEntity(saleDto, true);
        sale.setPaymentIntentId(paymentIntent.getId());
        SaleBean saved = saleDao.save(sale);

        Map<String, Object> saleInfo = Map.of(
                "id_venta", saved.getId_venta(),
                "date", saved.getDate(),
                "total_sale", saved.getTotal_sale(),
                "payment_type", saved.getPayment_type(),
                "paymentIntentId", paymentIntent.getId()
        );

        return Map.of(
                "message", "Venta confirmada y guardada tras pago exitoso",
                "sale", saleInfo
        );
    }



    public double calculateTotalSale(SaleDto saleDto) {
        return saleDto.getProducts().stream()
                .mapToDouble(productQuantity -> productQuantity.getQuantity() *
                        productRepository.findById(productQuantity.getProductId())
                                .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + productQuantity.getProductId()))
                                .getUnit_price())
                .sum();
    }


    @Transactional
    public Optional<SaleDto> changeStatus(Integer saleId) {
        return saleDao.findById(saleId).map(sale -> {
            sale.setStatus(!sale.getStatus());
            saleDao.save(sale);
            return toDTO(sale);
        });
    }

    @Transactional
    public List<SaleNewDto> getSalesDay() {
        logger.info("Obteniendo ventas del día actual");
        LocalDate today = LocalDate.now();
        return saleDao.findByDateBetween(today.atStartOfDay(), today.plusDays(1).atStartOfDay())
                .stream()
                .filter(sale -> Boolean.TRUE.equals(sale.getStatus()))
                .map(this::toNewDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SaleNewDto> getSalesOfWeek() {
        logger.info("Obteniendo ventas de la semana actual");
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate endOfWeek = today.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));
        return saleDao.findByDateBetween(startOfWeek.atStartOfDay(), endOfWeek.plusDays(1).atStartOfDay())
                .stream()
                .filter(sale -> Boolean.TRUE.equals(sale.getStatus()))
                .map(this::toNewDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SaleNewDto> getSalesOfMonth() {
        logger.info("Obteniendo ventas del mes actual");
        LocalDate firstDay = LocalDate.now().withDayOfMonth(1);
        LocalDate firstDayNextMonth = firstDay.plusMonths(1);
        return saleDao.findByDateBetween(firstDay.atStartOfDay(), firstDayNextMonth.atStartOfDay())
                .stream()
                .filter(sale -> Boolean.TRUE.equals(sale.getStatus()))
                .map(this::toNewDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SaleNewDto> getSalesOfYear() {
        logger.info("Obteniendo ventas del año actual");
        LocalDate firstDay = LocalDate.now().withDayOfYear(1);
        LocalDate firstDayNextYear = firstDay.plusYears(1);
        return saleDao.findByDateBetween(firstDay.atStartOfDay(), firstDayNextYear.atStartOfDay())
                .stream()
                .filter(sale -> Boolean.TRUE.equals(sale.getStatus()))
                .map(this::toNewDTO)
                .collect(Collectors.toList());
    }



    private SaleDto toDTO(SaleBean sale) {
        return SaleDto.builder()
                .id_venta(sale.getId_venta())
                .date(sale.getDate())
                .total_sale(sale.getTotal_sale())
                .status(sale.getStatus())
                .userId(sale.getUser().getId())
                .products(sale.getSaleProducts().stream()
                        .map(sp -> ProductQuantityDto.builder()
                                .productId(sp.getProduct().getId())
                                .quantity(sp.getQuantity())
                                .build())
                        .collect(Collectors.toList()))
                .payment_type(sale.getPayment_type())
                .paymentIntentId(sale.getPaymentIntentId())
                .quantity_products(sale.getQuantity_products())
                .build();
    }

    private SaleNewDto toNewDTO(SaleBean sale) {
        return SaleNewDto.builder()
                .id_venta(sale.getId_venta())
                .date(sale.getDate())
                .total_sale(sale.getTotal_sale())
                .status(sale.getStatus())
                .user(toPublicDto(sale.getUser()))
                .products(sale.getSaleProducts().stream()
                        .map(sp -> ProductQuantityNewDto.builder()
                                .product(sp.getProduct())
                                .quantity(sp.getQuantity())
                                .build())
                        .collect(Collectors.toList()))
                .payment_type(sale.getPayment_type())
                .paymentIntentId(sale.getPaymentIntentId())
                .quantity_products(sale.getQuantity_products())
                .build();
    }

    public UserPublicDto toPublicDto(UserBean userDto) {
        return UserPublicDto.builder()
                .id_usuario(userDto.getId())
                .nombre(userDto.getName())
                .apellido(userDto.getSurname())
                .build();
    }

    private SaleBean buildSaleEntity(SaleDto saleDto, boolean isNew) {
        SaleBean sale = new SaleBean();
        setSaleData(sale, saleDto, isNew);
        return sale;
    }

}
