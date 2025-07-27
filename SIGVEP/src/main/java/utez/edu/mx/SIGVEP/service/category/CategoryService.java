package utez.edu.mx.SIGVEP.service.category;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.SIGVEP.controller.category.dto.CategoryDto;
import utez.edu.mx.SIGVEP.model.category.CategoryBean;
import utez.edu.mx.SIGVEP.model.category.CategoryRepository;
import utez.edu.mx.SIGVEP.service.product.ProductService;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class CategoryService {

    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    @Autowired
    private final CategoryRepository categoryDao;
    @Autowired
    private ProductService productService;

    public CategoryService(CategoryRepository categoryDao) {
        this.categoryDao = categoryDao;
    }

    @Transactional(readOnly = true)
    public List<CategoryDto> findAll(){
        return categoryDao.findAllByOrderByIdAsc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<CategoryDto> findById(Integer id){
        return categoryDao.findById(id).map(this::toDTO);
    }

    @Transactional
    public CategoryDto register(CategoryDto categoryDto){
        CategoryBean categoryBean = new CategoryBean();
        setCategoryData(categoryBean, categoryDto, true);
        CategoryBean savedCategoryBean = categoryDao.save(categoryBean);
        return toDTO(savedCategoryBean);
    }

    @Transactional
    public Optional<CategoryDto> update(CategoryDto categoryDto, Integer id){
        Optional<CategoryBean> existingCategory = categoryDao.findById(id);
        if(existingCategory.isPresent()){
            CategoryBean category = existingCategory.get();
            setCategoryData(category, categoryDto, false);
            CategoryBean categoryBean = categoryDao.save(category);
            return Optional.of(toDTO(categoryBean));
        }
        return Optional.empty();
    }

    @Transactional
    public Optional<CategoryDto> patch(Integer id){
        if(categoryDao.existsById(id)){
            CategoryBean category = categoryDao.findById(id).get();
            Boolean estatus = category.getStatus();
            category.setStatus(!estatus);
            return Optional.of(toDTO(category));
        }
        return Optional.empty();
    }

    private CategoryDto toDTO(CategoryBean categoryBean){
        return CategoryDto.builder()
                .id_category(categoryBean.getId_category())
                .name(categoryBean.getName())
                .description(categoryBean.getDescription())
                .status(categoryBean.getStatus())
                .build();
    }

    private void setCategoryData(CategoryBean categoryBean, CategoryDto categoryDto, Boolean isNew){
        logger.info("Registrando categoria...");
        categoryBean.setName(categoryDto.getName());
        categoryBean.setDescription(categoryDto.getDescription());
        if(isNew){
            categoryBean.setStatus(true);
        }
        logger.info("Configurando del categoria... {}", categoryBean);
    }
}
