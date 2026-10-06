package com.Revora.Revora_Main.dto;

import com.Revora.Revora_Main.model.SubmissionStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateCodeRequest {

    private Long submissionId;
    private String title;
    private String description;
    private String programmingLanguage;
    private SubmissionStatus status;

}
