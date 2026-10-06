package com.Revora.Revora_Main.controller;

import com.Revora.Revora_Main.dto.CodeSubmissionRequest;
import com.Revora.Revora_Main.dto.CodeSubmissionResponse;
import com.Revora.Revora_Main.dto.UpdateCodeRequest;
import com.Revora.Revora_Main.service.CodeSubmissionService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/code-submissions")
public class CodeSubmissionController {

    private final CodeSubmissionService codeSubmissionService;

    public CodeSubmissionController(CodeSubmissionService codeSubmissionService) {

        this.codeSubmissionService = codeSubmissionService;

    }

    @PostMapping("/add-code")
    public CodeSubmissionResponse addCode(@RequestBody CodeSubmissionRequest codeSubmissionRequest) {
        return codeSubmissionService.addCode(codeSubmissionRequest);

    }

    @PutMapping("/{submissionId}/update-code")
    public CodeSubmissionResponse updateCode(@RequestBody UpdateCodeRequest updateCodeRequest) {
        return codeSubmissionService.updateCode(updateCodeRequest);
    }


    @DeleteMapping("/{submissionId}")
    public void deleteCode(@PathVariable Long submissionId) {

        codeSubmissionService.deleteCode(submissionId);
    }

    @GetMapping
    public List<CodeSubmissionResponse> getAllSubmissions() {
        return codeSubmissionService.getAllSubmissions();
    }

    @GetMapping("/{id}")
    public CodeSubmissionResponse getSubmissionById(@PathVariable Long id) {
        return codeSubmissionService.getSubmissionById(id);
    }
}
