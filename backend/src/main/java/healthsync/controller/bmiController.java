package com.healthsync.controller;

import com.healthsync.domain.BmiRecord;
import com.healthsync.service.BmiService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bmi")
public class BmiController {

    private final BmiService service;

    public BmiController(BmiService service) {
        this.service = service;
    }

    @PostMapping
    public BmiRecord create(@RequestParam Long userId,
                            @RequestParam double height,
                            @RequestParam double weight) {
        return service.createRecord(userId, height, weight);
    }

    @GetMapping
    public List<BmiRecord> getAll() {
        return service.getAllRecords();
    }
}