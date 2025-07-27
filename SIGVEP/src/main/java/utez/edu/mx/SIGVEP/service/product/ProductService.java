package utez.edu.mx.SIGVEP.service.product;


import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productDao, CategoryRepository categoryRepository) {
        this.productDao = productDao;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductDto> findAll(){
        return productDao.findAllByOrderByIdAsc().stream()
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
            Boolean estatus = productBean.getStatus();
            productBean.setStatus(!estatus);
            return Optional.of(toDTO(productBean));
        }
        return Optional.empty();
    }

    private ProductDto toDTO(ProductBean productBean) {
        return ProductDto.builder()
                .id_product(productBean.getId())
                .name(productBean.getName())
                .unit_price(productBean.getUnit_price())
                .stock(productBean.getStock())
                .status(productBean.getStatus())
                .category(productBean.getCategory())
                .build();
    }

    private void setProductData(ProductBean productBean, ProductDto productDto, Boolean isNew ) {
        logger.info("Registrando usuario...");
        productBean.setName(productDto.getName());
        productBean.setUnit_price(productDto.getUnit_price());
        productBean.setStock(productDto.getStock());
        if (productDto.getCategory() != null && productDto.getCategory().getId_category() != null) {
            productBean.setCategory(categoryRepository.findById(productDto.getCategory().getId_category())
                    .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada")));
        } else {
            throw new IllegalArgumentException("La categoría es obligatoria");
        }
        if(isNew){
            productBean.setStatus(true);
        }
        logger.info("Configuracion del producto... {}", productBean);
    }

}
