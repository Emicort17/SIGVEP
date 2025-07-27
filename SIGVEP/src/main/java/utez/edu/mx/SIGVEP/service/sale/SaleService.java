package utez.edu.mx.SIGVEP.service.sale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.SIGVEP.controller.product.dto.ProductQuantityDto;
import utez.edu.mx.SIGVEP.controller.product.dto.ProductQuantityNewDto;
import utez.edu.mx.SIGVEP.controller.sale.dto.SaleDto;
import utez.edu.mx.SIGVEP.controller.sale.dto.SaleNewDto;
import utez.edu.mx.SIGVEP.controller.user.dto.UserPublicDto;
import utez.edu.mx.SIGVEP.model.product.ProductBean;
import utez.edu.mx.SIGVEP.model.product.ProductRepository;
import utez.edu.mx.SIGVEP.model.sale.SaleBean;
import utez.edu.mx.SIGVEP.model.sale.SaleRepository;
import utez.edu.mx.SIGVEP.model.saleproduct.SaleProductBean;
import utez.edu.mx.SIGVEP.model.user.UserBean;
import utez.edu.mx.SIGVEP.model.user.UserRepository;

import java.util.List;
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
    public SaleDto saveSale(SaleDto saleDto) {
        logger.info("Guardando nueva venta con fecha: {}", saleDto.getDate());

        SaleBean sale = new SaleBean();
        setSaleData(sale, saleDto, true);
        SaleBean savedSale = saleDao.save(sale);

        logger.info("Venta guardada con ID: {}", savedSale.getId_venta());
        return toDTO(savedSale);
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
}
