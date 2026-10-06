package com.Revora.Revora_Main.dto;

import com.Revora.Revora_Main.model.ReviewDecision;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewResponse {

    private Long id;
    private String feedbackText;
    private LocalDateTime date;
    private ReviewDecision decision;
    private String reviewedByUsername;
    private Long submissionId;

}
