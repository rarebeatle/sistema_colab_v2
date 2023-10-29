package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Medicamento;
import com.mycompany.myapp.repository.MedicamentoRepository;
import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link MedicamentoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MedicamentoResourceIT {

    private static final String DEFAULT_NOMBRE = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPCION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPCION = "BBBBBBBBBB";

    private static final Double DEFAULT_PRECIO = 1D;
    private static final Double UPDATED_PRECIO = 2D;

    private static final String ENTITY_API_URL = "/api/medicamentos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MedicamentoRepository medicamentoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMedicamentoMockMvc;

    private Medicamento medicamento;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Medicamento createEntity(EntityManager em) {
        Medicamento medicamento = new Medicamento().nombre(DEFAULT_NOMBRE).descripcion(DEFAULT_DESCRIPCION).precio(DEFAULT_PRECIO);
        return medicamento;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Medicamento createUpdatedEntity(EntityManager em) {
        Medicamento medicamento = new Medicamento().nombre(UPDATED_NOMBRE).descripcion(UPDATED_DESCRIPCION).precio(UPDATED_PRECIO);
        return medicamento;
    }

    @BeforeEach
    public void initTest() {
        medicamento = createEntity(em);
    }

    @Test
    @Transactional
    void createMedicamento() throws Exception {
        int databaseSizeBeforeCreate = medicamentoRepository.findAll().size();
        // Create the Medicamento
        restMedicamentoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(medicamento)))
            .andExpect(status().isCreated());

        // Validate the Medicamento in the database
        List<Medicamento> medicamentoList = medicamentoRepository.findAll();
        assertThat(medicamentoList).hasSize(databaseSizeBeforeCreate + 1);
        Medicamento testMedicamento = medicamentoList.get(medicamentoList.size() - 1);
        assertThat(testMedicamento.getNombre()).isEqualTo(DEFAULT_NOMBRE);
        assertThat(testMedicamento.getDescripcion()).isEqualTo(DEFAULT_DESCRIPCION);
        assertThat(testMedicamento.getPrecio()).isEqualTo(DEFAULT_PRECIO);
    }

    @Test
    @Transactional
    void createMedicamentoWithExistingId() throws Exception {
        // Create the Medicamento with an existing ID
        medicamento.setId(1L);

        int databaseSizeBeforeCreate = medicamentoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMedicamentoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(medicamento)))
            .andExpect(status().isBadRequest());

        // Validate the Medicamento in the database
        List<Medicamento> medicamentoList = medicamentoRepository.findAll();
        assertThat(medicamentoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNombreIsRequired() throws Exception {
        int databaseSizeBeforeTest = medicamentoRepository.findAll().size();
        // set the field null
        medicamento.setNombre(null);

        // Create the Medicamento, which fails.

        restMedicamentoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(medicamento)))
            .andExpect(status().isBadRequest());

        List<Medicamento> medicamentoList = medicamentoRepository.findAll();
        assertThat(medicamentoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPrecioIsRequired() throws Exception {
        int databaseSizeBeforeTest = medicamentoRepository.findAll().size();
        // set the field null
        medicamento.setPrecio(null);

        // Create the Medicamento, which fails.

        restMedicamentoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(medicamento)))
            .andExpect(status().isBadRequest());

        List<Medicamento> medicamentoList = medicamentoRepository.findAll();
        assertThat(medicamentoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllMedicamentos() throws Exception {
        // Initialize the database
        medicamentoRepository.saveAndFlush(medicamento);

        // Get all the medicamentoList
        restMedicamentoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(medicamento.getId().intValue())))
            .andExpect(jsonPath("$.[*].nombre").value(hasItem(DEFAULT_NOMBRE)))
            .andExpect(jsonPath("$.[*].descripcion").value(hasItem(DEFAULT_DESCRIPCION)))
            .andExpect(jsonPath("$.[*].precio").value(hasItem(DEFAULT_PRECIO.doubleValue())));
    }

    @Test
    @Transactional
    void getMedicamento() throws Exception {
        // Initialize the database
        medicamentoRepository.saveAndFlush(medicamento);

        // Get the medicamento
        restMedicamentoMockMvc
            .perform(get(ENTITY_API_URL_ID, medicamento.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(medicamento.getId().intValue()))
            .andExpect(jsonPath("$.nombre").value(DEFAULT_NOMBRE))
            .andExpect(jsonPath("$.descripcion").value(DEFAULT_DESCRIPCION))
            .andExpect(jsonPath("$.precio").value(DEFAULT_PRECIO.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingMedicamento() throws Exception {
        // Get the medicamento
        restMedicamentoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMedicamento() throws Exception {
        // Initialize the database
        medicamentoRepository.saveAndFlush(medicamento);

        int databaseSizeBeforeUpdate = medicamentoRepository.findAll().size();

        // Update the medicamento
        Medicamento updatedMedicamento = medicamentoRepository.findById(medicamento.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedMedicamento are not directly saved in db
        em.detach(updatedMedicamento);
        updatedMedicamento.nombre(UPDATED_NOMBRE).descripcion(UPDATED_DESCRIPCION).precio(UPDATED_PRECIO);

        restMedicamentoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMedicamento.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMedicamento))
            )
            .andExpect(status().isOk());

        // Validate the Medicamento in the database
        List<Medicamento> medicamentoList = medicamentoRepository.findAll();
        assertThat(medicamentoList).hasSize(databaseSizeBeforeUpdate);
        Medicamento testMedicamento = medicamentoList.get(medicamentoList.size() - 1);
        assertThat(testMedicamento.getNombre()).isEqualTo(UPDATED_NOMBRE);
        assertThat(testMedicamento.getDescripcion()).isEqualTo(UPDATED_DESCRIPCION);
        assertThat(testMedicamento.getPrecio()).isEqualTo(UPDATED_PRECIO);
    }

    @Test
    @Transactional
    void putNonExistingMedicamento() throws Exception {
        int databaseSizeBeforeUpdate = medicamentoRepository.findAll().size();
        medicamento.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMedicamentoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, medicamento.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(medicamento))
            )
            .andExpect(status().isBadRequest());

        // Validate the Medicamento in the database
        List<Medicamento> medicamentoList = medicamentoRepository.findAll();
        assertThat(medicamentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMedicamento() throws Exception {
        int databaseSizeBeforeUpdate = medicamentoRepository.findAll().size();
        medicamento.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMedicamentoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(medicamento))
            )
            .andExpect(status().isBadRequest());

        // Validate the Medicamento in the database
        List<Medicamento> medicamentoList = medicamentoRepository.findAll();
        assertThat(medicamentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMedicamento() throws Exception {
        int databaseSizeBeforeUpdate = medicamentoRepository.findAll().size();
        medicamento.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMedicamentoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(medicamento)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Medicamento in the database
        List<Medicamento> medicamentoList = medicamentoRepository.findAll();
        assertThat(medicamentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMedicamentoWithPatch() throws Exception {
        // Initialize the database
        medicamentoRepository.saveAndFlush(medicamento);

        int databaseSizeBeforeUpdate = medicamentoRepository.findAll().size();

        // Update the medicamento using partial update
        Medicamento partialUpdatedMedicamento = new Medicamento();
        partialUpdatedMedicamento.setId(medicamento.getId());

        partialUpdatedMedicamento.nombre(UPDATED_NOMBRE).descripcion(UPDATED_DESCRIPCION).precio(UPDATED_PRECIO);

        restMedicamentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMedicamento.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMedicamento))
            )
            .andExpect(status().isOk());

        // Validate the Medicamento in the database
        List<Medicamento> medicamentoList = medicamentoRepository.findAll();
        assertThat(medicamentoList).hasSize(databaseSizeBeforeUpdate);
        Medicamento testMedicamento = medicamentoList.get(medicamentoList.size() - 1);
        assertThat(testMedicamento.getNombre()).isEqualTo(UPDATED_NOMBRE);
        assertThat(testMedicamento.getDescripcion()).isEqualTo(UPDATED_DESCRIPCION);
        assertThat(testMedicamento.getPrecio()).isEqualTo(UPDATED_PRECIO);
    }

    @Test
    @Transactional
    void fullUpdateMedicamentoWithPatch() throws Exception {
        // Initialize the database
        medicamentoRepository.saveAndFlush(medicamento);

        int databaseSizeBeforeUpdate = medicamentoRepository.findAll().size();

        // Update the medicamento using partial update
        Medicamento partialUpdatedMedicamento = new Medicamento();
        partialUpdatedMedicamento.setId(medicamento.getId());

        partialUpdatedMedicamento.nombre(UPDATED_NOMBRE).descripcion(UPDATED_DESCRIPCION).precio(UPDATED_PRECIO);

        restMedicamentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMedicamento.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMedicamento))
            )
            .andExpect(status().isOk());

        // Validate the Medicamento in the database
        List<Medicamento> medicamentoList = medicamentoRepository.findAll();
        assertThat(medicamentoList).hasSize(databaseSizeBeforeUpdate);
        Medicamento testMedicamento = medicamentoList.get(medicamentoList.size() - 1);
        assertThat(testMedicamento.getNombre()).isEqualTo(UPDATED_NOMBRE);
        assertThat(testMedicamento.getDescripcion()).isEqualTo(UPDATED_DESCRIPCION);
        assertThat(testMedicamento.getPrecio()).isEqualTo(UPDATED_PRECIO);
    }

    @Test
    @Transactional
    void patchNonExistingMedicamento() throws Exception {
        int databaseSizeBeforeUpdate = medicamentoRepository.findAll().size();
        medicamento.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMedicamentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, medicamento.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(medicamento))
            )
            .andExpect(status().isBadRequest());

        // Validate the Medicamento in the database
        List<Medicamento> medicamentoList = medicamentoRepository.findAll();
        assertThat(medicamentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMedicamento() throws Exception {
        int databaseSizeBeforeUpdate = medicamentoRepository.findAll().size();
        medicamento.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMedicamentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(medicamento))
            )
            .andExpect(status().isBadRequest());

        // Validate the Medicamento in the database
        List<Medicamento> medicamentoList = medicamentoRepository.findAll();
        assertThat(medicamentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMedicamento() throws Exception {
        int databaseSizeBeforeUpdate = medicamentoRepository.findAll().size();
        medicamento.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMedicamentoMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(medicamento))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Medicamento in the database
        List<Medicamento> medicamentoList = medicamentoRepository.findAll();
        assertThat(medicamentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMedicamento() throws Exception {
        // Initialize the database
        medicamentoRepository.saveAndFlush(medicamento);

        int databaseSizeBeforeDelete = medicamentoRepository.findAll().size();

        // Delete the medicamento
        restMedicamentoMockMvc
            .perform(delete(ENTITY_API_URL_ID, medicamento.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Medicamento> medicamentoList = medicamentoRepository.findAll();
        assertThat(medicamentoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
