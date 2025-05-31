package utez.edu.mx.SIGVEP.service.product;

import jakarta.persistence.Access;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.SIGVEP.controller.product.dto.ProductDto;
import utez.edu.mx.SIGVEP.model.category.CategoryRepository;
import utez.edu.mx.SIGVEP.model.product.ProductBean;
import utez.edu.mx.SIGVEP.model.product.ProductRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ProductService {

    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    @Autowired
    private final ProductRepository productDao;

    public ProductService(ProductRepository productDao) {
        this.productDao = productDao;
    }

    @Transactional(readOnly = true)
    public List<ProductDto> findAll(){
        return productDao.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<ProductDto> findById(Integer id){
        return productDao.findById(id).map(this::toDTO);
    }

    @Transactional
    public ProductDto register(ProductDto productDto){
        ProductBean product = new ProductBean();
        setProductData(product, productDto, true);
        ProductBean savedProduct = productDao.save(product);
        return toDTO(savedProduct);
    }

    @Transactional
    public Optional<ProductDto> update(ProductDto productDto, Integer id){
        Optional<ProductBean> existingProduct = productDao.findById(id);
        if(existingProduct.isPresent()){
            ProductBean productBean = existingProduct.get();
            setProductData(productBean, productDto, false);
            productDao.save(productBean);
            return Optional.of(toDTO(productBean));
        }
        return Optional.empty();
    }

    @Transactional
    public Optional<ProductDto> patch(Integer id){
        if(productDao.existsById(id)){
            ProductBean productBean = productDao.findById(id).get();
            Boolean estatus = productBean.getEstatus();
            productBean.setEstatus(!estatus);
            return Optional.of(toDTO(productBean));
        }
        return Optional.empty();
    }

    private ProductDto toDTO(ProductBean productBean) {
        return ProductDto.builder()
                .id_producto(productBean.getId_producto())
                .clave(productBean.getClave())
                .precio_unitario(productBean.getPrecio_unitario())
                .estatus(productBean.getEstatus())
                .category(productBean.getCategory())
                .build();
    }

    private void setProductData(ProductBean productBean, ProductDto productDto, Boolean isNew ) {
        logger.info("Registrando usuario...");
        productBean.setId_producto(productDto.getId_producto());
        productBean.setClave(productDto.getClave());
        productBean.setPrecio_unitario(productDto.getPrecio_unitario());
        productBean.setCategory(productDto.getCategory());
        if(isNew){
            productBean.setEstatus(true);
        }
        logger.info("Configuracion del producto... {}", productBean);
    }

}
