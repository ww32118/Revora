package com.Revora.Revora_Main.dto;

import com.Revora.Revora_Main.model.SubmissionStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CodeSubmissionResponse {

    private Long id;
    private String title;
    private String codeContent;
    private String description;
    private String programmingLanguage;
    private SubmissionStatus status;
    private LocalDateTime submittedOn;
    private String submittedByUsername;
}