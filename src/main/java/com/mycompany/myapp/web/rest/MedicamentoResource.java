package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Medicamento;
import com.mycompany.myapp.repository.MedicamentoRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Medicamento}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MedicamentoResource {

    private final Logger log = LoggerFactory.getLogger(MedicamentoResource.class);

    private static final String ENTITY_NAME = "medicamento";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MedicamentoRepository medicamentoRepository;

    public MedicamentoResource(MedicamentoRepository medicamentoRepository) {
        this.medicamentoRepository = medicamentoRepository;
    }

    /**
     * {@code POST  /medicamentos} : Create a new medicamento.
     *
     * @param medicamento the medicamento to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new medicamento, or with status {@code 400 (Bad Request)} if the medicamento has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/medicamentos")
    public ResponseEntity<Medicamento> createMedicamento(@Valid @RequestBody Medicamento medicamento) throws URISyntaxException {
        log.debug("REST request to save Medicamento : {}", medicamento);
        if (medicamento.getId() != null) {
            throw new BadRequestAlertException("A new medicamento cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Medicamento result = medicamentoRepository.save(medicamento);
        return ResponseEntity
            .created(new URI("/api/medicamentos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /medicamentos/:id} : Updates an existing medicamento.
     *
     * @param id the id of the medicamento to save.
     * @param medicamento the medicamento to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated medicamento,
     * or with status {@code 400 (Bad Request)} if the medicamento is not valid,
     * or with status {@code 500 (Internal Server Error)} if the medicamento couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/medicamentos/{id}")
    public ResponseEntity<Medicamento> updateMedicamento(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Medicamento medicamento
    ) throws URISyntaxException {
        log.debug("REST request to update Medicamento : {}, {}", id, medicamento);
        if (medicamento.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, medicamento.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!medicamentoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Medicamento result = medicamentoRepository.save(medicamento);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, medicamento.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /medicamentos/:id} : Partial updates given fields of an existing medicamento, field will ignore if it is null
     *
     * @param id the id of the medicamento to save.
     * @param medicamento the medicamento to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated medicamento,
     * or with status {@code 400 (Bad Request)} if the medicamento is not valid,
     * or with status {@code 404 (Not Found)} if the medicamento is not found,
     * or with status {@code 500 (Internal Server Error)} if the medicamento couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/medicamentos/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Medicamento> partialUpdateMedicamento(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Medicamento medicamento
    ) throws URISyntaxException {
        log.debug("REST request to partial update Medicamento partially : {}, {}", id, medicamento);
        if (medicamento.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, medicamento.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!medicamentoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Medicamento> result = medicamentoRepository
            .findById(medicamento.getId())
            .map(existingMedicamento -> {
                if (medicamento.getNombre() != null) {
                    existingMedicamento.setNombre(medicamento.getNombre());
                }
                if (medicamento.getDescripcion() != null) {
                    existingMedicamento.setDescripcion(medicamento.getDescripcion());
                }
                if (medicamento.getPrecio() != null) {
                    existingMedicamento.setPrecio(medicamento.getPrecio());
                }

                return existingMedicamento;
            })
            .map(medicamentoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, medicamento.getId().toString())
        );
    }

    /**
     * {@code GET  /medicamentos} : get all the medicamentos.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of medicamentos in body.
     */
    @GetMapping("/medicamentos")
    public List<Medicamento> getAllMedicamentos(@RequestParam(required = false) String filter) {
        if ("inventario-is-null".equals(filter)) {
            log.debug("REST request to get all Medicamentos where inventario is null");
            return StreamSupport
                .stream(medicamentoRepository.findAll().spliterator(), false)
                .filter(medicamento -> medicamento.getInventario() == null)
                .toList();
        }
        log.debug("REST request to get all Medicamentos");
        return medicamentoRepository.findAll();
    }

    /**
     * {@code GET  /medicamentos/:id} : get the "id" medicamento.
     *
     * @param id the id of the medicamento to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the medicamento, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/medicamentos/{id}")
    public ResponseEntity<Medicamento> getMedicamento(@PathVariable Long id) {
        log.debug("REST request to get Medicamento : {}", id);
        Optional<Medicamento> medicamento = medicamentoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(medicamento);
    }

    /**
     * {@code DELETE  /medicamentos/:id} : delete the "id" medicamento.
     *
     * @param id the id of the medicamento to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/medicamentos/{id}")
    public ResponseEntity<Void> deleteMedicamento(@PathVariable Long id) {
        log.debug("REST request to delete Medicamento : {}", id);
        medicamentoRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
