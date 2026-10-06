package com.Revora.Revora_Main.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentRequest {

    private Long userId;
    private Long submissionId;
    private String content;

}
