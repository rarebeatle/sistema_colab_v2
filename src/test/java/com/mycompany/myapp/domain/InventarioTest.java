package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class InventarioTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Inventario.class);
        Inventario inventario1 = new Inventario();
        inventario1.setId(1L);
        Inventario inventario2 = new Inventario();
        inventario2.setId(inventario1.getId());
        assertThat(inventario1).isEqualTo(inventario2);
        inventario2.setId(2L);
        assertThat(inventario1).isNotEqualTo(inventario2);
        inventario1.setId(null);
        assertThat(inventario1).isNotEqualTo(inventario2);
    }
}
