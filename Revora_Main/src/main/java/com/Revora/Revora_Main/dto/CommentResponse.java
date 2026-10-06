package com.Revora.Revora_Main.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentResponse {

    private Long id;
    private String content;
    private int likes;
    private LocalDateTime date;
    private String createdByUsername;
    private Long submissionId;

}
