package com.Revora.Revora_Main.dto;

import com.Revora.Revora_Main.model.ReviewDecision;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewRequest {

    private Long userId;
    private Long submissionId;
    private String feedbackText;
    private ReviewDecision decision;


}
