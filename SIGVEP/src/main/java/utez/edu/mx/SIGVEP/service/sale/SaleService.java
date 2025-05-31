package utez.edu.mx.SIGVEP.service.sale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.SIGVEP.controller.sale.dto.SaleDto;
import utez.edu.mx.SIGVEP.model.sale.SaleBean;
import utez.edu.mx.SIGVEP.model.sale.SaleRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SaleService {

    private static final Logger logger = LoggerFactory.getLogger(SaleService.class);

    @Autowired
    private SaleRepository saleDao;

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
        sale.setTotal_sale(saleDto.getTotal_sale());

        if (saleDto.getStatus() != null) {
            sale.setStatus(saleDto.getStatus());
        } else if (isNew) {
            sale.setStatus(true); // Valor por defecto
        }

        logger.info("Datos de venta configurados: {}", sale);
    }

    private SaleDto toDTO(SaleBean sale) {
        return SaleDto.builder()
                .id_venta(sale.getId_venta())
                .date(sale.getDate())
                .total_sale(sale.getTotal_sale())
                .status(sale.getStatus())
                .build();
    }
}
