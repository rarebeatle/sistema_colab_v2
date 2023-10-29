package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Inventario;
import com.mycompany.myapp.repository.InventarioRepository;
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
 * Integration tests for the {@link InventarioResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class InventarioResourceIT {

    private static final Integer DEFAULT_CANTIDAD_STOCK = 1;
    private static final Integer UPDATED_CANTIDAD_STOCK = 2;

    private static final String ENTITY_API_URL = "/api/inventarios";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private InventarioRepository inventarioRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restInventarioMockMvc;

    private Inventario inventario;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Inventario createEntity(EntityManager em) {
        Inventario inventario = new Inventario().cantidadStock(DEFAULT_CANTIDAD_STOCK);
        return inventario;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Inventario createUpdatedEntity(EntityManager em) {
        Inventario inventario = new Inventario().cantidadStock(UPDATED_CANTIDAD_STOCK);
        return inventario;
    }

    @BeforeEach
    public void initTest() {
        inventario = createEntity(em);
    }

    @Test
    @Transactional
    void createInventario() throws Exception {
        int databaseSizeBeforeCreate = inventarioRepository.findAll().size();
        // Create the Inventario
        restInventarioMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(inventario)))
            .andExpect(status().isCreated());

        // Validate the Inventario in the database
        List<Inventario> inventarioList = inventarioRepository.findAll();
        assertThat(inventarioList).hasSize(databaseSizeBeforeCreate + 1);
        Inventario testInventario = inventarioList.get(inventarioList.size() - 1);
        assertThat(testInventario.getCantidadStock()).isEqualTo(DEFAULT_CANTIDAD_STOCK);
    }

    @Test
    @Transactional
    void createInventarioWithExistingId() throws Exception {
        // Create the Inventario with an existing ID
        inventario.setId(1L);

        int databaseSizeBeforeCreate = inventarioRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restInventarioMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(inventario)))
            .andExpect(status().isBadRequest());

        // Validate the Inventario in the database
        List<Inventario> inventarioList = inventarioRepository.findAll();
        assertThat(inventarioList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkCantidadStockIsRequired() throws Exception {
        int databaseSizeBeforeTest = inventarioRepository.findAll().size();
        // set the field null
        inventario.setCantidadStock(null);

        // Create the Inventario, which fails.

        restInventarioMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(inventario)))
            .andExpect(status().isBadRequest());

        List<Inventario> inventarioList = inventarioRepository.findAll();
        assertThat(inventarioList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllInventarios() throws Exception {
        // Initialize the database
        inventarioRepository.saveAndFlush(inventario);

        // Get all the inventarioList
        restInventarioMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(inventario.getId().intValue())))
            .andExpect(jsonPath("$.[*].cantidadStock").value(hasItem(DEFAULT_CANTIDAD_STOCK)));
    }

    @Test
    @Transactional
    void getInventario() throws Exception {
        // Initialize the database
        inventarioRepository.saveAndFlush(inventario);

        // Get the inventario
        restInventarioMockMvc
            .perform(get(ENTITY_API_URL_ID, inventario.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(inventario.getId().intValue()))
            .andExpect(jsonPath("$.cantidadStock").value(DEFAULT_CANTIDAD_STOCK));
    }

    @Test
    @Transactional
    void getNonExistingInventario() throws Exception {
        // Get the inventario
        restInventarioMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingInventario() throws Exception {
        // Initialize the database
        inventarioRepository.saveAndFlush(inventario);

        int databaseSizeBeforeUpdate = inventarioRepository.findAll().size();

        // Update the inventario
        Inventario updatedInventario = inventarioRepository.findById(inventario.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedInventario are not directly saved in db
        em.detach(updatedInventario);
        updatedInventario.cantidadStock(UPDATED_CANTIDAD_STOCK);

        restInventarioMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedInventario.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedInventario))
            )
            .andExpect(status().isOk());

        // Validate the Inventario in the database
        List<Inventario> inventarioList = inventarioRepository.findAll();
        assertThat(inventarioList).hasSize(databaseSizeBeforeUpdate);
        Inventario testInventario = inventarioList.get(inventarioList.size() - 1);
        assertThat(testInventario.getCantidadStock()).isEqualTo(UPDATED_CANTIDAD_STOCK);
    }

    @Test
    @Transactional
    void putNonExistingInventario() throws Exception {
        int databaseSizeBeforeUpdate = inventarioRepository.findAll().size();
        inventario.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInventarioMockMvc
            .perform(
                put(ENTITY_API_URL_ID, inventario.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(inventario))
            )
            .andExpect(status().isBadRequest());

        // Validate the Inventario in the database
        List<Inventario> inventarioList = inventarioRepository.findAll();
        assertThat(inventarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchInventario() throws Exception {
        int databaseSizeBeforeUpdate = inventarioRepository.findAll().size();
        inventario.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInventarioMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(inventario))
            )
            .andExpect(status().isBadRequest());

        // Validate the Inventario in the database
        List<Inventario> inventarioList = inventarioRepository.findAll();
        assertThat(inventarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamInventario() throws Exception {
        int databaseSizeBeforeUpdate = inventarioRepository.findAll().size();
        inventario.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInventarioMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(inventario)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Inventario in the database
        List<Inventario> inventarioList = inventarioRepository.findAll();
        assertThat(inventarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateInventarioWithPatch() throws Exception {
        // Initialize the database
        inventarioRepository.saveAndFlush(inventario);

        int databaseSizeBeforeUpdate = inventarioRepository.findAll().size();

        // Update the inventario using partial update
        Inventario partialUpdatedInventario = new Inventario();
        partialUpdatedInventario.setId(inventario.getId());

        restInventarioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInventario.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedInventario))
            )
            .andExpect(status().isOk());

        // Validate the Inventario in the database
        List<Inventario> inventarioList = inventarioRepository.findAll();
        assertThat(inventarioList).hasSize(databaseSizeBeforeUpdate);
        Inventario testInventario = inventarioList.get(inventarioList.size() - 1);
        assertThat(testInventario.getCantidadStock()).isEqualTo(DEFAULT_CANTIDAD_STOCK);
    }

    @Test
    @Transactional
    void fullUpdateInventarioWithPatch() throws Exception {
        // Initialize the database
        inventarioRepository.saveAndFlush(inventario);

        int databaseSizeBeforeUpdate = inventarioRepository.findAll().size();

        // Update the inventario using partial update
        Inventario partialUpdatedInventario = new Inventario();
        partialUpdatedInventario.setId(inventario.getId());

        partialUpdatedInventario.cantidadStock(UPDATED_CANTIDAD_STOCK);

        restInventarioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInventario.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedInventario))
            )
            .andExpect(status().isOk());

        // Validate the Inventario in the database
        List<Inventario> inventarioList = inventarioRepository.findAll();
        assertThat(inventarioList).hasSize(databaseSizeBeforeUpdate);
        Inventario testInventario = inventarioList.get(inventarioList.size() - 1);
        assertThat(testInventario.getCantidadStock()).isEqualTo(UPDATED_CANTIDAD_STOCK);
    }

    @Test
    @Transactional
    void patchNonExistingInventario() throws Exception {
        int databaseSizeBeforeUpdate = inventarioRepository.findAll().size();
        inventario.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInventarioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, inventario.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(inventario))
            )
            .andExpect(status().isBadRequest());

        // Validate the Inventario in the database
        List<Inventario> inventarioList = inventarioRepository.findAll();
        assertThat(inventarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchInventario() throws Exception {
        int databaseSizeBeforeUpdate = inventarioRepository.findAll().size();
        inventario.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInventarioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(inventario))
            )
            .andExpect(status().isBadRequest());

        // Validate the Inventario in the database
        List<Inventario> inventarioList = inventarioRepository.findAll();
        assertThat(inventarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamInventario() throws Exception {
        int databaseSizeBeforeUpdate = inventarioRepository.findAll().size();
        inventario.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInventarioMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(inventario))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Inventario in the database
        List<Inventario> inventarioList = inventarioRepository.findAll();
        assertThat(inventarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteInventario() throws Exception {
        // Initialize the database
        inventarioRepository.saveAndFlush(inventario);

        int databaseSizeBeforeDelete = inventarioRepository.findAll().size();

        // Delete the inventario
        restInventarioMockMvc
            .perform(delete(ENTITY_API_URL_ID, inventario.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Inventario> inventarioList = inventarioRepository.findAll();
        assertThat(inventarioList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
