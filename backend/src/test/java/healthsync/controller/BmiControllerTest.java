package com.healthsync.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthsync.domain.BmiRecord;
import com.healthsync.service.BmiService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BmiController.class)
class BmiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BmiService service;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
    }

    @Test
    void createRecord_ShouldReturnCreatedBmiRecord() throws Exception {
        // Arrange
        BmiRecord mockRecord = new BmiRecord();
        mockRecord.setId(1L);
        mockRecord.setUserId(1L);
        mockRecord.setHeight(1.75);
        mockRecord.setWeight(70.0);
        mockRecord.setBmiValue(22.86);
        mockRecord.setCategory("Normal weight");

        Mockito.when(service.createRecord(anyLong(), anyDouble(), anyDouble()))
                .thenReturn(mockRecord);

        // Act + Assert
        mockMvc.perform(post("/api/bmi")
                        .param("userId", "1")
                        .param("height", "1.75")
                        .param("weight", "70.0")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.userId", is(1)))
                .andExpect(jsonPath("$.category", is("Normal weight")));
    }

    @Test
    void getAllRecords_ShouldReturnListOfRecords() throws Exception {
        // Arrange
        BmiRecord r1 = new BmiRecord();
        r1.setId(1L);
        r1.setUserId(1L);
  