package com.healthsync.service;

import com.healthsync.domain.BmiRecord;
import com.healthsync.repository.BmiRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class BmiServiceTest {

    private BmiRepository repository;
    private BmiService service;

    @BeforeEach
    void setUp() {
        repository = Mockito.mock(BmiRepository.class);
        service = new BmiService(repository);
    }

    @Test
    void createRecord_ShouldSaveAndReturnBmiRecord() {
        // Arrange
        BmiRecord mockRecord = new BmiRecord();
        mockRecord.setId(1L);
        mockRecord.setUserId(1L);
        mockRecord.setHeight(1.75);
        mockRecord.setWeight(70.0);
        mockRecord.setBmiValue(22.86);
        mockRecord.setCategory("Normal weight");

        when(repository.save(any(BmiRecord.class))).thenReturn(mockRecord);

        // Act
        BmiRecord result = service.createRecord(1L, 1.75, 70.0);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Normal weight", result.getCategory());
        verify(repository, times(1)).save(any(BmiRecord.class));
    }

    @Test
    void getAllRecords_ShouldReturnListOfRecords() {
        // Arrange
        BmiRecord r1 = new BmiRecord();
        r1.setId(1L);
        BmiRecord r2 = new BmiRecord();
        r2.setId(2L);

        when(repository.findAll()).thenReturn(Arrays.asList(r1, r2));

        // Act
        List<BmiRecord> records = service.getAllRecords();

        // Assert
        assertEquals(2, records.size());
        verify(repository, times(1)).findAll();
    }
}