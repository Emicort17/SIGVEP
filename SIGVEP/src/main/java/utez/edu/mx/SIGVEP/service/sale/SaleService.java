package utez.edu.mx.SIGVEP.service.sale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.SIGVEP.controller.sale.dto.SaleDto;
import utez.edu.mx.SIGVEP.controller.sale.dto.SaleNewDto;
import utez.edu.mx.SIGVEP.controller.user.dto.UserDto;
import utez.edu.mx.SIGVEP.controller.user.dto.UserPublicDto;
import utez.edu.mx.SIGVEP.model.product.ProductBean;
import utez.edu.mx.SIGVEP.model.product.ProductRepository;
import utez.edu.mx.SIGVEP.model.sale.SaleBean;
import utez.edu.mx.SIGVEP.model.sale.SaleRepository;
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
    public List<SaleDto> getAllSales() {
        return saleDao.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<SaleDto> getSaleById(Integer id) {
        return saleDao.findById(id).map(this::toDTO);
    }

    @Transactional
    public SaleNewDto saveSale(SaleDto saleDto) {
        logger.info("Guardando nueva venta con fecha: {}", saleDto.getDate());

        SaleBean sale = new SaleBean();
        SaleNewDto saleNewDto = new SaleNewDto();
        setSaleData(sale, saleDto, saleNewDto,true);
        SaleBean savedSale = saleDao.save(sale);

        logger.info("Venta guardada con ID: {}", savedSale.getId_venta());
        return saleNewDto;
    }

    @Transactional
    public Optional<SaleNewDto> updateSale(Integer id, SaleDto saleDto) {
        logger.info("Actualizando venta con ID: {}", id);

        Optional<SaleBean> existingSale = saleDao.findById(id);
        if (existingSale.isPresent()) {
            SaleBean sale = existingSale.get();
            SaleNewDto saleNewDto = new SaleNewDto();
            setSaleData(sale, saleDto, saleNewDto, false);
            saleDao.save(sale);
            logger.info("Venta actualizada correctamente.");
            return Optional.of(toNewDTO(sale));
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

    private void setSaleData(SaleBean sale, SaleDto saleDto, SaleNewDto saleNewDto, boolean isNew) {
        sale.setDate(saleDto.getDate());
        sale.setTotal_sale(saleDto.getTotal_sale());
        sale.setQuantity_products(saleDto.getProductIds().size());
        sale.setPayment_type(saleDto.getPayment_type());

        saleNewDto.setDate(saleDto.getDate());
        saleNewDto.setTotal_sale(saleDto.getTotal_sale());
        saleNewDto.setQuantity_products(saleDto.getProductIds().size());
        saleNewDto.setPayment_type(saleDto.getPayment_type());

        if (saleDto.getStatus() != null) {
            sale.setStatus(saleDto.getStatus());
            saleNewDto.setStatus(saleDto.getStatus());
        } else if (isNew) {
            sale.setStatus(true);
            saleNewDto.setStatus(true);
        }

        // Buscar y setear el usuario
        if (saleDto.getUserId() != null) {
            UserBean user = userRepository.findById(saleDto.getUserId())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            sale.setUser(user);
            UserPublicDto userPublicDto = toPublicDto(user);
            saleNewDto.setUser(userPublicDto);
        } else {
            throw new RuntimeException("El ID del usuario es obligatorio.");
        }

        // Buscar y setear los productos
        if (saleDto.getProductIds() != null && !saleDto.getProductIds().isEmpty()) {
            List<ProductBean> products = saleDto.getProductIds().stream()
                    .map(id -> productRepository.findById(id)
                            .orElseThrow(() -> new RuntimeException("Producto con ID " + id + " no encontrado")))
                    .collect(Collectors.toList());
            sale.setProducts(products);
            saleNewDto.setProducts(products);
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
                .productIds(sale.getProducts().stream().map(ProductBean::getId_product).collect(Collectors.toList()))
                .build();
    }

    private SaleNewDto toNewDTO(SaleBean sale) {
        return SaleNewDto.builder()
                .id_venta(sale.getId_venta())
                .date(sale.getDate())
                .total_sale(sale.getTotal_sale())
                .status(sale.getStatus())
                .user(toPublicDto(sale.getUser()))
                .products(sale.getProducts())
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
